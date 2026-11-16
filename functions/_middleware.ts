// Cloudflare Pages Edge Middleware
// Enforces single canonical domain (https://pdfpagenio.com), eliminates redirect chains, and prevents 404s.

interface PagesFunctionContext {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest(context: PagesFunctionContext): Promise<Response> {
  const url = new URL(context.request.url);
  const originalPath = url.pathname;

  // 1. Normalize legacy and scraper paths immediately to avoid redirect hops
  if (url.pathname === "/translate-pdf" || url.pathname === "/translate-pdf/") {
    url.pathname = "/ai-translate-pdf";
  } else if (url.pathname === "/summarize-pdf" || url.pathname === "/summarize-pdf/") {
    url.pathname = "/ai-summarize-pdf";
  } else if (url.pathname.startsWith("/cdn-cgi/l/email-protection")) {
    url.pathname = "/contact";
    url.hash = "";
  }

  // 2. Strict WWW -> Apex Canonical 301 Permanent Redirect (Single Hop)
  if (url.hostname === "www.pdfpagenio.com" || url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.replace(/^www\./, "");
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  // 3. Redirect preview *.pages.dev subdomains to apex
  if (url.hostname.endsWith(".pages.dev") && url.hostname.includes("pdfpagenio")) {
    url.hostname = "pdfpagenio.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  // 4. Redirect normalized legacy path on apex in a single 301 hop
  if (url.pathname !== originalPath) {
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  // 5. Exclude PWA manifest from search engine evaluation
  if (url.pathname.endsWith("/manifest.webmanifest") || url.pathname.endsWith(".webmanifest")) {
    const response = await context.next();
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  return context.next();
}
