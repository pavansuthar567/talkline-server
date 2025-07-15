import mongoose from "mongoose";
import { IResume, ResumeModel } from "../models/resume";

export default class ResumeService {
  /**
   * Get Resume by User ID
   * @param user_id - User ID
   * @returns Resume data
   */
  static async getDefaultResumeByUserId(
    user_id: string,
    resume_id?: string
  ): Promise<Partial<IResume> | null> {
    try {
      if (resume_id) {
        return await ResumeModel.findOne({ user_id, _id: resume_id })
          .populate([
            "experience",
            "education",
            "projects",
            "achievements",
            "certifications",
          ])
          .lean();
      }
      return await ResumeModel.findOne({
        user_id,
        is_default: true,
      }).lean();
      // .populate([
      //   "experience",
      //   "education",
      //   "projects",
      //   "achievements",
      //   "certifications",
      // ])
      // .lean();
    } catch (error) {
      throw new Error("Error fetching resume by user ID");
    }
  }

  /**
   * Create a new Resume
   * @param resumeData - Resume data
   * @returns Created Resume
   */
  static async createResume(resumeData: IResume): Promise<IResume> {
    try {
      const newResume = new ResumeModel(resumeData);
      return await newResume.save();
    } catch (error) {
      throw new Error("Error creating resume");
    }
  }

  static async getResumeByUserAndId(
    user_id: string,
    resume_id: string
  ): Promise<IResume | null> {
    try {
      return await ResumeModel.findOne({ _id: resume_id, user_id });
    } catch (error) {
      throw new Error("Error fetching resume");
    }
  }

  static async updateResume(resume_id: string, updatedData: Partial<IResume>) {
    try {
      console.log("resume_id", resume_id);
      console.log("updatedData", updatedData);
      await ResumeModel.findByIdAndUpdate(resume_id, updatedData, {
        new: true,
      });
    } catch (error) {
      throw new Error("Error updating resume");
    }
  }
}
