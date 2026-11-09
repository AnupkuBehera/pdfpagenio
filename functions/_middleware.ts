// Cloudflare Pages Edge Middleware
// Enforces single canonical domain (https://pdfpagenio.com), eliminates redirect chains, and prevents 404s.

interface PagesFunctionContext {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest(context: PagesFunctionContext): Promise<Response> {
  const url = new URL(context.request.url);

  // 1. Strict WWW -> Apex Canonical 301 Permanent Redirect (Single Hop)
  if (url.hostname === "www.pdfpagenio.com" || url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.replace(/^www\./, "");
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  // 2. Redirect preview *.pages.dev subdomains to apex
  if (url.hostname.endsWith(".pages.dev") && url.hostname.includes("pdfpagenio")) {
    url.hostname = "pdfpagenio.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  // 3. Fix 404: /translate-pdf -> /ai-translate-pdf
  if (url.pathname === "/translate-pdf" || url.pathname === "/translate-pdf/") {
    url.pathname = "/ai-translate-pdf";
    return Response.redirect(url.toString(), 301);
  }

  // 4. Fix 404: Cloudflare Email Protection -> /contact
  if (url.pathname.startsWith("/cdn-cgi/l/email-protection")) {
    url.pathname = "/contact";
    url.hash = "";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
