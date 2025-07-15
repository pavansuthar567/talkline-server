import { Request, Response } from "express";
import { createError, createResponse } from "../../helpers";
import GeminiService from "../../services/ai";

export default class AIController {
  /**
   * @description
   */
  static async generateResume(req: Request, res: Response) {
    try {
      const { skills, experience, jobDescription } = req.body;
      // In ResumeController
      const prompt = `Generate a resume summary for a software engineer with skills: ${skills.join(
        ", "
      )}, experience: ${experience.join(
        "\n"
      )}, targeting job: ${jobDescription}`;

      const data = await GeminiService.generateContent(prompt);
      return createResponse(res, "ok", "Resume crafted!", { data });
    } catch (error) {
      return createError(res, error);
    }
  }
}
