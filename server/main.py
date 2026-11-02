import os
import shutil
import tempfile
import subprocess
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PDF Pagenio Processing Microservice",
    description="Industrial conversion, Ghostscript compression, OCR, and QPDF security engine.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = Path(tempfile.gettempdir()) / "pdfpagenio_processing"
TEMP_DIR.mkdir(parents=True, exist_ok=True)

def cleanup_file(path: str):
  """Background task to remove temporary files after response is sent."""
  try:
    if os.path.exists(path):
      os.remove(path)
  except Exception as e:
    print(f"Error cleaning up file {path}: {e}")

@app.get("/health")
def health_check():
  return {"status": "ok", "service": "pdfpagenio-processing-microservice"}

# 1. OFFICE TO PDF (Word, Excel, PowerPoint via LibreOffice)
@app.post("/api/convert/office-to-pdf")
async def convert_office_to_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
  input_path = TEMP_DIR / file.filename
  with open(input_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  # Run LibreOffice headless
  cmd = [
      "libreoffice",
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      str(TEMP_DIR),
      str(input_path),
  ]

  try:
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=120)
    if result.returncode != 0:
      raise HTTPException(status_code=500, detail=f"Conversion failed: {result.stderr.decode()}")
    
    output_pdf = input_path.with_suffix(".pdf")
    if not output_pdf.exists():
      raise HTTPException(status_code=500, detail="Output PDF not generated.")

    background_tasks.add_task(cleanup_file, str(input_path))
    background_tasks.add_task(cleanup_file, str(output_pdf))

    return FileResponse(
        path=str(output_pdf),
        filename=output_pdf.name,
        media_type="application/pdf"
    )
  except subprocess.TimeoutExpired:
    raise HTTPException(status_code=504, detail="Conversion timed out.")

# 2. PDF TO WORD (via pdf2docx)
@app.post("/api/convert/pdf-to-word")
async def convert_pdf_to_word(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
  input_path = TEMP_DIR / file.filename
  output_docx = input_path.with_suffix(".docx")

  with open(input_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  try:
    from pdf2docx import Converter
    cv = Converter(str(input_path))
    cv.convert(str(output_docx))
    cv.close()

    background_tasks.add_task(cleanup_file, str(input_path))
    background_tasks.add_task(cleanup_file, str(output_docx))

    return FileResponse(
        path=str(output_docx),
        filename=output_docx.name,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"PDF to Word conversion failed: {str(e)}")

# 3. GHOSTSCRIPT SMART COMPRESSION
@app.post("/api/compress/smart")
async def compress_smart(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    level: str = Form("recommended") # extreme, recommended, low
):
  input_path = TEMP_DIR / file.filename
  output_pdf = TEMP_DIR / f"compressed_{file.filename}"

  with open(input_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  pdf_settings = "/ebook" # default ~150 DPI
  if level == "extreme":
    pdf_settings = "/screen" # ~72 DPI
  elif level == "low":
    pdf_settings = "/prepress" # ~300 DPI

  cmd = [
      "gs",
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      f"-dPDFSETTINGS={pdf_settings}",
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      f"-sOutputFile={str(output_pdf)}",
      str(input_path),
  ]

  try:
    subprocess.run(cmd, check=True, timeout=90)
    background_tasks.add_task(cleanup_file, str(input_path))
    background_tasks.add_task(cleanup_file, str(output_pdf))

    return FileResponse(
        path=str(output_pdf),
        filename=output_pdf.name,
        media_type="application/pdf"
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

# 4. OCR (via OCRmyPDF + Tesseract)
@app.post("/api/ocr")
async def apply_ocr(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    lang: str = Form("eng")
):
  input_path = TEMP_DIR / file.filename
  output_pdf = TEMP_DIR / f"ocr_{file.filename}"

  with open(input_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  cmd = [
      "ocrmypdf",
      "-l", lang,
      "--skip-text",
      str(input_path),
      str(output_pdf),
  ]

  try:
    subprocess.run(cmd, check=True, timeout=180)
    background_tasks.add_task(cleanup_file, str(input_path))
    background_tasks.add_task(cleanup_file, str(output_pdf))

    return FileResponse(
        path=str(output_pdf),
        filename=output_pdf.name,
        media_type="application/pdf"
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

# 5. PASSWORD PROTECT & UNLOCK (via pikepdf / QPDF)
@app.post("/api/security/protect")
async def protect_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form(...)
):
  import pikepdf

  input_path = TEMP_DIR / file.filename
  output_pdf = TEMP_DIR / f"protected_{file.filename}"

  with open(input_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  try:
    with pikepdf.open(str(input_path)) as pdf:
      pdf.save(
          str(output_pdf),
          encryption=pikepdf.Encryption(owner=password, user=password, R=6)
      )

    background_tasks.add_task(cleanup_file, str(input_path))
    background_tasks.add_task(cleanup_file, str(output_pdf))

    return FileResponse(
        path=str(output_pdf),
        filename=output_pdf.name,
        media_type="application/pdf"
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Protect failed: {str(e)}")

@app.post("/api/security/unlock")
async def unlock_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form("")
):
  import pikepdf

  input_path = TEMP_DIR / file.filename
  output_pdf = TEMP_DIR / f"unlocked_{file.filename}"

  with open(input_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  try:
    with pikepdf.open(str(input_path), password=password) as pdf:
      pdf.save(str(output_pdf))

    background_tasks.add_task(cleanup_file, str(input_path))
    background_tasks.add_task(cleanup_file, str(output_pdf))

    return FileResponse(
        path=str(output_pdf),
        filename=output_pdf.name,
        media_type="application/pdf"
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Unlock failed: {str(e)}")

