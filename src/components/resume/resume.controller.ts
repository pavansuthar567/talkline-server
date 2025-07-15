import { Request, Response } from "express";
import { createError, createResponse, flattenSkills } from "../../helpers";
import { ResumeModel } from "../../models/resume";
import { IJob, JobModel } from "../../models/job";
import puppeteer from "puppeteer";
import { IUser } from "../../models/user";
import GeminiService from "../../services/ai";
import ResumeService from "../../services/resume";
import { startSession } from "mongoose";
// import Redis from "ioredis";
import { ExperienceModel } from "../../models/experience";
import { EducationModel } from "../../models/education";
import { ProjectModel } from "../../models/projects";
import { CertificationModel } from "../../models/certification";

// const redis = new Redis();

export class ResumeController {
  //   static async generateResume(req: Request, res: Response) {
  //     try {
  //       const { job_id } = req.params;
  //       const {
  //         position,
  //         company,
  //         description,
  //         certifications,
  //         skills,
  //         experience,
  //         education,
  //         projects,
  //       } = req.body as {
  //         position?: string;
  //         company?: string;
  //         description?: string;
  //         skills?: string[] | [];
  //         experience?: string[] | [];
  //         education?: string[] | [];
  //         certifications?: string[] | [];
  //         projects?: string[] | [];
  //       };
  //       const user = req.user as IUser;
  //       if (!user)
  //         return createError(
  //           res,
  //           "User not authenticated",
  //           { code: "AUTH_003" },
  //           401
  //         );

  //       let jobData: Partial<IJob>;
  //       if (job_id) {
  //         const job = await JobModel.findById(job_id);
  //         if (!job)
  //           return createError(res, "Job not found", { code: "JOB_001" }, 404);
  //         jobData = job;
  //       } else {
  //         if (!position || !company || !description) {
  //           return createError(
  //             res,
  //             "Missing job details",
  //             { code: "RESUME_006" },
  //             400
  //           );
  //         }
  //         jobData = { position, company, description };
  //       }

  //       const prompt = `
  //         Generate a professional resume in JSON format with the following structure:

  //         {
  //           "title": "Software Engineer",
  //           "summary": "A concise and impactful summary of the candidate's qualifications and career goals.",
  //           "skills": ["List", "of", "relevant", "skills"],
  //           "experience": [
  //             {
  //               "title": "Job Title",
  //               "company": "Company Name",
  //               "dates": "Start Date - End Date (e.g., 01/2020 - 06/2022, 03/2023 - Present)", // Present for current job
  //               "description": ["Key", "responsibilities", "and", "achievements", "in", "bullet", "points."] // seperate by \n
  //             },
  //             // ... more experience entries
  //           ],
  //           "education": [
  //             {
  //               "degree": "Degree Name",
  //               "university": "University Name",
  //               "dates": "Start Date - End Date (e.g., '09/2016' - '05/2020')"
  //             },
  //             // ... more education entries
  //           ],
  //           "projects": [
  //             {
  //               "name": "Project Name",
  //               "description": "Brief description of the project and your role.",
  //               "technologies": ["List", "of", "technologies", "used"]
  //             },
  //             // ... more project entries
  //           ]
  //           "certifications": [
  //             {
  //               "name": "Certification Name",
  //               "issuing_organization": "Organization Name",
  //               "description": "Brief description of the project and your role.",
  //               "issue_date": "Issue Date (e.g., 05/2020)"
  //             },
  //             // ... more certifications entries
  //           ]
  //         }

  //         Consider the following job details:
  //         - Title: ${position} || ""
  //         - Job: ${position} at ${company}
  //         - Description: ${description}
  //         - Skills: ${skills?.join(", ") || "Not provided"}
  //         - Experience: ${experience?.join("\n") || "Not provided"}
  //         - Education: ${education?.join("\n") || "Not provided"}
  //         - Certifications: ${certifications?.join("\n") || "Not provided"}
  //         - Projects: ${projects?.join("\n") || "Not provided"}

  //         Optimize for ATS with relevant keywords. Ensure the response is a valid JSON object.
  //       `;

  //       const content = await GeminiService.generateContent(prompt);
  //       console.log("raw content", content);

  //       // Clean the response to extract JSON
  //       const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  //       if (!jsonMatch || !jsonMatch[1]) {
  //         throw new Error("Invalid JSON format in Gemini response");
  //       }
  //       const cleanJson = jsonMatch[1].trim();
  //       const resumeContent = JSON.parse(cleanJson);
  //       console.log("parsed resumeContent", resumeContent);

  //       const resume = await ResumeModel.create({
  //         user_id: user?._id,
  //         target_job_id: job_id || null,
  //         version_name: `${jobData?.position} ${user?.first_name} ${user?.last_name} Resume`,
  //         content: {
  //           personal_info: {
  //             first_name: user?.first_name,
  //             last_name: user?.last_name,
  //             email: user?.email,
  //             phone: user?.mobile_number || "",
  //             linkedin: user?.linkedin || "",
  //             x: user?.x || "",
  //           },
  //           summary: resumeContent?.summary,
  //           skills: resumeContent?.skills,
  //           experience:
  //             resumeContent?.experience?.map(
  //               (exp: {
  //                 title: string;
  //                 company: string;
  //                 dates: string;
  //                 description: string[] | string; // Adjusted type
  //                 achievements: string[] | string; // Adjusted type
  //                 keywords?: string[];
  //               }) => ({
  //                 title: exp?.title || "",
  //                 company: exp?.company || "",
  //                 start_date: exp?.dates?.split("-")?.[0]?.trim() || "",
  //                 achievements: exp?.achievements || [],
  //                 end_date: exp?.dates?.split("-")?.[1]?.trim() || exp.dates, // Handle "Present"
  //                 description: Array.isArray(exp?.description)
  //                   ? exp.description.join("\n")
  //                   : exp?.description || "", // Join array to string
  //               })
  //             ) || [],
  //           education: resumeContent?.education?.map(
  //             (edu: {
  //               degree: string;
  //               university: string;
  //               location?: string;
  //               dates: string;
  //             }) => ({
  //               degree: edu?.degree || "",
  //               institution: edu?.university || "",
  //               start_date: edu?.dates?.split("-")?.[0]?.trim() || "",
  //               end_date: edu?.dates?.split("-")?.[1]?.trim() || "",
  //             })
  //           ),
  //           projects:
  //             resumeContent?.projects?.map(
  //               (proj: {
  //                 name: string;
  //                 description: string;
  //                 technologies?: string[];
  //               }) => ({
  //                 title: proj?.name || "",
  //                 description: proj?.description || "",
  //                 link: "", // Add if needed
  //               })
  //             ) || [],
  //           certifications:
  //             resumeContent?.certifications?.map(
  //               (certi: {
  //                 name: string;
  //                 description: string;
  //                 issuing_organization: string;
  //                 issue_date: string;
  //               }) => ({
  //                 title: certi?.name || "",
  //                 description: certi?.description || "",
  //                 issuing_organization: certi?.issuing_organization || "",
  //                 issue_date: certi?.issue_date || "",
  //               })
  //             ) || [],
  //         },
  //       });
  //       console.log("resume", resume);

  //       return createResponse(res, "ok", "Resume generated successfully", resume);
  //     } catch (error) {
  //       console.log("error", error);
  //       return createError(
  //         res,
  //         "Failed to generate resume",
  //         { code: "RESUME_001" },
  //         500
  //       );
  //     }
  //   }
  static async generateResume(req: Request, res: Response) {
    const session = await startSession();
    try {
      session.startTransaction();
      const { job_id } = req.params;
      const {
        position,
        company,
        description,
        skills,
        experience,
        education,
        certifications,
        projects,
      } = req.body as {
        position?: string;
        company?: string;
        description?: string;
        skills?: string[];
        experience?: string[];
        education?: string[];
        certifications?: string[];
        projects?: string[];
      };
      const user = req.user as IUser;
      if (!user) {
        return createError(
          res,
          "User not authenticated",
          { code: "AUTH_003" },
          401
        );
      }

      // Fetch or validate job data
      let jobData: Partial<IJob>;
      if (job_id) {
        const job = await JobModel.findById(job_id).session(session);
        if (!job) {
          return createError(res, "Job not found", { code: "JOB_001" }, 404);
        }
        jobData = job;
      } else {
        if (!position || !company || !description) {
          return createError(
            res,
            "Missing job details",
            { code: "RESUME_006" },
            400
          );
        }
        jobData = { position, company, description };
      }

      // Generate sections independently
      const resumeData = await ResumeController.generateResumeSections({
        user,
        jobData,
        skills,
        experience,
        education,
        certifications,
        projects,
      });

      // Create Resume document
      const resume = await ResumeModel.create(
        [
          {
            user_id: user._id,
            target_job_id: job_id || null,
            version_name: `${jobData.position} ${user.first_name} ${user.last_name} Resume`,
            summary: resumeData.summary,
            title: resumeData.title,
            skills: resumeData.skills,
            experience: resumeData.experienceIds,
            education: resumeData.educationIds,
            projects: resumeData.projectIds,
            certifications: resumeData.certificationIds,
            is_ai_generated: true,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return createResponse(
        res,
        "ok",
        "Resume generated successfully",
        resume[0]
      );
    } catch (error) {
      await session.abortTransaction();
      console.error("Error generating resume:", error);
      return createError(
        res,
        "Failed to generate resume",
        { code: "RESUME_001" },
        500
      );
    } finally {
      session.endSession();
    }
  }

  static async generateResumeSections({
    user,
    jobData,
    skills,
    experience,
    education,
    certifications,
    projects,
  }: {
    user: IUser;
    jobData: Partial<IJob>;
    skills?: string[];
    experience?: string[];
    education?: string[];
    certifications?: string[];
    projects?: string[];
  }) {
    const { position, company, description } = jobData;

    // Summary Prompt
    const summaryPrompt = `
      Generate a professional resume summary (100-150 words) for a ${position} role at ${company}.
      Job Description: ${description}
      User Details: ${user.first_name} ${user.last_name}, ${user.email}
      Optimize for ATS with relevant keywords. Return as plain text.
    `;
    const summary = await GeminiService.generateContent(summaryPrompt);

    // Skills Prompt
    const skillsPrompt = `
      Generate a list of 5-10 relevant skills for a ${position} role at ${company}.
      Job Description: ${description}
      Provided Skills: ${skills?.join(", ") || "None"}
      Return as JSON: ["skill1", "skill2", ...]
    `;
    const skillsJson = await GeminiService.generateContent(skillsPrompt);
    const skillsData = JSON.parse(skillsJson);

    // Experience Prompt
    const experiencePrompt = `
      Generate 1-3 professional experience entries for a ${position} role at ${company}.
      Job Description: ${description}
      Provided Experience: ${experience?.join("\n") || "None"}
      Return as JSON:
      [
        {
          "title": "Job Title",
          "company": "Company Name",
          "start_date": "MM/YYYY",
          "end_date": "MM/YYYY or Present",
          "description": "Key responsibilities and achievements."
        }
      ]
    `;
    const experienceJson = await GeminiService.generateContent(
      experiencePrompt
    );
    const experienceData = JSON.parse(experienceJson);
    const experienceIds = await Promise.all(
      experienceData.map(
        async (exp: any) =>
          (
            await ExperienceModel.create(
              [
                {
                  user_id: user._id,
                  resume_id: null, // Updated later
                  title: exp.title,
                  company: exp.company,
                  start_date: exp.start_date,
                  end_date: exp.end_date,
                  description: exp.description,
                },
              ],
              { session: null } // Session handled in parent
            )
          )[0]._id
      )
    );

    // Education Prompt
    const educationPrompt = `
      Generate 1-2 education entries for a ${position} role.
      Provided Education: ${education?.join("\n") || "None"}
      Return as JSON:
      [
        {
          "degree": "Degree Name",
          "institution": "University Name",
          "start_date": "MM/YYYY",
          "end_date": "MM/YYYY"
        }
      ]
    `;
    const educationJson = await GeminiService.generateContent(educationPrompt);
    const educationData = JSON.parse(educationJson);
    const educationIds = await Promise.all(
      educationData.map(
        async (edu: any) =>
          (
            await EducationModel.create(
              [
                {
                  user_id: user._id,
                  resume_id: null,
                  degree: edu.degree,
                  institution: edu.institution,
                  start_date: edu.start_date,
                  end_date: edu.end_date,
                },
              ],
              { session: null }
            )
          )[0]._id
      )
    );

    // Projects Prompt
    const projectsPrompt = `
      Generate 1-2 project entries for a ${position} role.
      Provided Projects: ${projects?.join("\n") || "None"}
      Return as JSON:
      [
        {
          "title": "Project Name",
          "description": "Brief description.",
          "link": "Optional URL"
        }
      ]
    `;
    const projectsJson = await GeminiService.generateContent(projectsPrompt);
    const projectsData = JSON.parse(projectsJson);
    const projectIds = await Promise.all(
      projectsData.map(
        async (proj: any) =>
          (
            await ProjectModel.create(
              [
                {
                  user_id: user._id,
                  resume_id: null,
                  title: proj.title,
                  description: proj.description,
                  link: proj.link,
                },
              ],
              { session: null }
            )
          )[0]._id
      )
    );

    // Certifications Prompt
    const certificationsPrompt = `
      Generate 1-2 certification entries for a ${position} role.
      Provided Certifications: ${certifications?.join("\n") || "None"}
      Return as JSON:
      [
        {
          "title": "Certification Name",
          "issuing_organization": "Organization Name",
          "description": "Brief description.",
          "issue_date": "MM/YYYY"
        }
      ]
    `;
    const certificationsJson = await GeminiService.generateContent(
      certificationsPrompt
    );
    const certificationsData = JSON.parse(certificationsJson);
    const certificationIds = await Promise.all(
      certificationsData.map(
        async (cert: any) =>
          (
            await CertificationModel.create(
              [
                {
                  user_id: user._id,
                  resume_id: null,
                  title: cert.title,
                  issuing_organization: cert.issuing_organization,
                  description: cert.description,
                  issue_date: cert.issue_date,
                },
              ],
              { session: null }
            )
          )[0]._id
      )
    );

    return {
      summary,
      title: position || "Professional",
      skills: skillsData,
      experienceIds,
      educationIds,
      projectIds,
      certificationIds,
    };
  }

  // Update a specific section (example for Experience)
  static async updateExperience(req: Request, res: Response) {
    const session = await startSession();
    try {
      session.startTransaction();
      const { resumeId, experienceId } = req.params;
      const { title, company, start_date, end_date, description } = req.body;
      const user = req.user as IUser;

      const resume = await ResumeModel.findOne({
        _id: resumeId,
        user_id: user._id,
      }).session(session);
      if (!resume) {
        return createError(
          res,
          "Resume not found",
          { code: "RESUME_002" },
          404
        );
      }

      const experience = await ExperienceModel.findOneAndUpdate(
        { _id: experienceId, user_id: user._id, resume_id: resumeId },
        { title, company, start_date, end_date, description },
        { new: true, session }
      );
      if (!experience) {
        return createError(
          res,
          "Experience not found",
          { code: "EXP_001" },
          404
        );
      }

      await session.commitTransaction();
      return createResponse(
        res,
        "ok",
        "Experience updated successfully",
        experience
      );
    } catch (error) {
      await session.abortTransaction();
      return createError(
        res,
        "Failed to update experience",
        { code: "EXP_002" },
        500
      );
    } finally {
      session.endSession();
    }
  }

  static async getResumesByJob(req: Request, res: Response) {
    try {
      const { job_id } = req.params;
      const user = req.user as IUser;
      if (!user)
        return createError(
          res,
          "User not authenticated",
          { code: "AUTH_003" },
          401
        );

      const resumes = await ResumeModel.find({
        user_id: user._id,
        target_job_id: job_id,
      });
      return createResponse(res, "ok", "Resumes retrieved", resumes);
    } catch (error) {
      return createError(
        res,
        "Failed to retrieve resumes",
        { code: "RESUME_002" },
        500
      );
    }
  }

  static async getAllResumes(req: Request, res: Response) {
    try {
      const user = req.user as IUser;
      if (!user)
        return createError(
          res,
          "User not authenticated",
          { code: "AUTH_003" },
          401
        );

      const resumes = await ResumeModel.find({ user_id: user._id });
      return createResponse(res, "ok", "All resumes retrieved", resumes);
    } catch (error) {
      return createError(
        res,
        "Failed to retrieve resumes",
        { code: "RESUME_003" },
        500
      );
    }
  }

  static async exportResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user as IUser;
      if (!user)
        return createError(
          res,
          "User not authenticated",
          { code: "AUTH_003" },
          401
        );

      const resume = await ResumeModel.findOne({
        _id: id,
        user_id: user._id,
      }).populate("experience"); // Populate experience references
      if (!resume)
        return createError(
          res,
          "Resume not found",
          { code: "RESUME_004" },
          404
        );

      // HTML with Tailwind CSS (inline for simplicity)
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-8 font-sans">
            <div class="max-w-4xl mx-auto">
              <h1 class="text-2xl font-bold text-center">${user.first_name} ${
        user.last_name
      }</h1>
              <p class="text-center text-gray-600">${user.email} | ${
        user.mobile_number
      }</p>
              ${
                user.linkedin
                  ? `<p class="text-center text-gray-600">${user.linkedin}</p>`
                  : ""
              }
              <hr class="my-4 border-gray-300" />

              <h2 class="text-xl font-semibold mt-4">Summary</h2>
              <p class="text-gray-700">${resume.summary}</p>

              <h2 class="text-xl font-semibold mt-4">Skills</h2>
              <ul class="list-disc list-inside text-gray-700">
                ${resume.skills.map((skill) => `<li>${skill}</li>`).join("")}
              </ul>

              <h2 class="text-xl font-semibold mt-4">Experience</h2>
              ${(resume.experience as any[])
                .map(
                  (exp: any) => `
                    <div class="mb-4">
                      <p class="font-semibold">${exp.title} at ${exp.company}</p>
                      <p class="text-gray-600">${exp.start_date} - ${exp.end_date}</p>
                      <p class="text-gray-700">${exp.description}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
          </body>
        </html>
      `;

      // Launch Puppeteer and generate PDF
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      });
      await browser.close();

      // Send PDF response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=resume-${resume._id}.pdf`
      );
      res.send(pdfBuffer);
    } catch (error) {
      return createError(
        res,
        "Failed to export resume",
        { code: "RESUME_005" },
        500
      );
    }
  }

  static async updateResume(req: Request, res: Response) {
    try {
      const user = req.user as IUser;
      const { resume_id } = req.params;
      const resumeData = req.body;

      if (!user)
        return createError(
          res,
          "User not authenticated",
          { code: "AUTH_003" },
          401
        );

      let resume;

      console.log("resume_id", resume_id);

      if (resume_id) {
        // Try to update existing resume
        resume = await ResumeService.getResumeByUserAndId(user._id, resume_id);
        console.log("resume", resume);
        if (resume) {
          await ResumeService.updateResume(resume_id, {
            ...resumeData, // Spread resumeData directly, as fields match IResume
            user_id: user._id, // Ensure user_id is preserved
          });
          return res
            .status(200)
            .json({ message: "Resume updated successfully" });
        }
      }
      // Create new default resume if resume_id doesn't exist or not found
      const newResumeData = {
        ...resumeData, // Spread resumeData for fields like title, summary, skills
        user_id: user._id,
        is_default: true,
        version_name: "Default Resume",
        title: resumeData.title || "",
        summary: resumeData.summary || "",
        skills: resumeData.skills || [],
        experience: resumeData.experience || [], // Should be ObjectIds or empty
        education: resumeData.education || [], // Should be ObjectIds or empty
        projects: resumeData.projects || [], // Should be ObjectIds or empty
        achievements: resumeData.achievements || [], // Should be ObjectIds or empty
        certifications: resumeData.certifications || [], // Should be ObjectIds or empty
      };

      // Create the new resume
      const newResume = await ResumeService.createResume(newResumeData);
      return res
        .status(201)
        .json({ message: "Default resume created", resume: newResume });
    } catch (error) {
      console.log("error", error);
      return createError(
        res,
        "Failed to update or create resume",
        { code: "RESUME_005" },
        500
      );
    }
  }
}

export default ResumeController;
