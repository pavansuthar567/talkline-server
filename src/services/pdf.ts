import puppeteer, { Browser, Page } from "puppeteer";

export default class PdfService {
  /**
   * @description Generate a PDF from HTML content
   * @param html - HTML string to convert to PDF
   * @returns Buffer - PDF file buffer
   */
  static async generatePdf(html: string): Promise<Buffer> {
    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page: Page = await browser.newPage();

      // Set the HTML content
      await page.setContent(html, { waitUntil: "networkidle0" });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      if (browser) await browser.close();
      throw new Error(
        "Error generating PDF: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }
}
