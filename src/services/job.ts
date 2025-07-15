import mongoose, { FilterQuery } from "mongoose";
import { IJob, JOB_STATUSES, JobModel } from "../models/job";

export default class JobService {
  /**
   * @description Get all jobs with optional filters and pagination
   * @param filters - Query filters (e.g., status, flexibility)
   * @param pagination - Pagination options (page, limit)
   */
  static async getJobs(
    filters: FilterQuery<IJob> = {},
    pagination: { page: number; limit: number } = {
      page: 1,
      limit: 10,
    }
  ): Promise<IJob[]> {
    try {
      const { page, limit } = pagination;

      const searchFilter = [];

      // Apply global search on multiple fields
      if (filters.search && filters.search.trim() !== "") {
        searchFilter.push({
          $or: [
            { jobTitle: { $regex: filters.search, $options: "i" } },
            { companyName: { $regex: filters.search, $options: "i" } },
            { location: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } },
          ],
        });
      }

      // Remove search field from filters (to avoid conflicts in $match)
      delete filters.search;

      const matchStage = {
        $match: {
          $and: [filters],
        },
      };

      const facetStage = {
        $facet: {
          totalDocuments: [{ $count: "total" }],
          jobs: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      };
      const projectStage = {
        $project: {
          count: {
            $ifNull: [{ $arrayElemAt: ["$totalDocuments.total", 0] }, 0],
          },
          page,
          limit,
          jobs: 1,
        },
      };
      const pipeline = [matchStage, facetStage, projectStage];

      const result = await JobModel.aggregate(pipeline).exec();
      return result[0];
    } catch (error) {
      throw new Error(
        "Error fetching jobs: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * @description Create a new job
   * @param data - Job data to create
   */
  static async createJob(data: Partial<IJob>): Promise<IJob> {
    try {
      const newJob = new JobModel(data);
      return await newJob.save();
    } catch (error: any) {
      console.log("error", error);
      if (error.code === 11000) {
        throw new Error(
          "A job with this data already exists (duplicate key error)"
        );
      } else {
        throw new Error(
          "Error creating job: " + (error.message || "Unknown error")
        );
      }
    }
  }

  /**
   * @description Update an existing job by ID
   * @param id - Job ID
   * @param data - Updated job data
   */
  static async updateJob(
    id: string,
    data: Partial<IJob>
  ): Promise<IJob | null> {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate(id, data, {
        new: true, // Return the updated document
        runValidators: true, // Ensure schema validations are applied
      }).exec();

      if (!updatedJob) {
        throw new Error("Job not found");
      }

      return updatedJob;
    } catch (error) {
      throw new Error(
        "Error updating job: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * @description Delete a job by ID
   * @param id - Job ID
   */
  static async deleteJob(id: string): Promise<IJob | null> {
    try {
      const deletedJob = await JobModel.findByIdAndDelete(id).exec();

      if (!deletedJob) {
        throw new Error("Job not found");
      }

      return deletedJob;
    } catch (error) {
      throw new Error(
        "Error deleting job: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * @description Get a single job by ID
   * @param id - Job ID
   */
  static async getSingleJob(id: string): Promise<IJob | null> {
    try {
      const job = await JobModel.findById(id).exec();

      if (!job) {
        throw new Error("Job not found");
      }

      return job;
    } catch (error) {
      throw new Error(
        "Error fetching job: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * @description Get jobs count by status
   * @param userId
   */
  static async getJobsCountByStatus(userId: string): Promise<any | null> {
    try {
      const jobCounts = await JobModel.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId) } }, // Filter by userId
        {
          $group: {
            _id: "$status",
            count: {
              $sum: {
                $ifNull: [1, 0],
              },
            },
          },
        },
        { $project: { status: "$_id", count: 1, _id: 0 } },
      ]);

      if (!jobCounts) {
        throw new Error("Job Counts not found");
      }
      const result: { [key: string]: any }[] = [];
      JOB_STATUSES.forEach((status: string) => {
        const found = jobCounts.find((item) => item.status === status);
        result.push({ label: status, count: found ? found.count : 0 });
      });

      return result;
    } catch (error) {
      throw new Error(
        "Error fetching job: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }
}
