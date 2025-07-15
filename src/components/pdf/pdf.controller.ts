import { Request, Response } from "express";
import { createError } from "../../helpers";
import PdfService from "../../services/pdf";

export default class PdfController {
  /**
   * @description Generate a PDF from HTML content
   */
  static async generatePdf(req: Request, res: Response) {
    try {
      const { html } = req.body;
      const user = req.user as any; // Assuming user is attached by auth middleware

      if (!user || !user._id) {
        return createError(res, { status: 401, message: "Unauthorized" });
      }

      const pdfBuffer = await PdfService.generatePdf(html);

      // Send PDF as response
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${user._id}.pdf`,
        "Content-Length": pdfBuffer.length.toString(),
      });

      return res.status(200).send(pdfBuffer);
    } catch (error) {
      return createError(res, error);
    }
  }
}
