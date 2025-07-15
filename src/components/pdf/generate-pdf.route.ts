import express, { Request, Response } from "express";
import PdfController from "../../components/pdf/pdf.controller";
import AuthMiddleware from "../auth/auth.validation";
import PdfValidations from "../../components/pdf/pdf.validation";

const router = express.Router();

/**
 * @route POST /api/v1/generate-pdf/
 * @description Generate a PDF from HTML content
 * @returns PDF file
 * @access private
 */
router.post(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  PdfValidations.generatePdf,
  (req: Request, res: Response) => {
    PdfController.generatePdf(req, res);
  }
);

const pdfRoutes = router;
export default pdfRoutes;
