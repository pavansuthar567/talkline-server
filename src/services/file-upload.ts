import { MulterRequest } from "../types/multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CustomUploadResponse {
  width: number;
  height: number;
  url: string;
  created_at: string;
  resource_type: string;
  format: string;
  asset_id: string;
  asset_folder: string;
}

export default class FileUploadService {
  static async upload(req: Request): Promise<any> {
    try {
      // Upload image to Cloudinary
      const request = req as MulterRequest;
      // Loop through all the files and upload them
      const uploadPromises = request?.files?.map(
        (file: Express.Multer.File) => {
          return new Promise<CustomUploadResponse | UploadApiResponse>(
            (resolve, reject) => {
              // can use to return CustomUploadResponse
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "jobbit", resource_type: "auto" },
                (error, result: any) => {
                  if (error) {
                    console.error(
                      "Error uploading image to Cloudinary:",
                      error
                    );
                    return reject(
                      new Error("Error uploading image to Cloudinary")
                    );
                  }
                  resolve({
                    width: result.width,
                    height: result.height,
                    url: result.secure_url,
                    created_at: result.created_at,
                    resource_type: result.resource_type,
                    format: result.format,
                    asset_id: result.asset_id,
                    asset_folder: result.asset_folder,
                  });
                }
              );

              // Create a readable stream from the file buffer
              const bufferStream = new Readable();
              bufferStream.push(file.buffer); // Push the file buffer
              bufferStream.push(null); // Mark the end of the stream
              bufferStream.pipe(uploadStream); // Pipe the stream to Cloudinary
            }
          );
        }
      );

      // Wait for all uploads to finish
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error(error);
      throw new Error("Error uploading image to Cloudinary");
    }
  }

  static async delete(req: Request): Promise<any> {
    try {
      const { urls, resource_type } = req.body as any; // Expect an array of public IDs to delete
      if (!Array.isArray(urls) || urls.length === 0) {
        throw new Error("No URLs provided");
      }

      const deletePromises = urls.map((url: string) => {
        // Extract the public ID from the URL
        const publicId = url
          .split("/")
          .slice(7)
          .join("/")
          .replace(/\.[^/.]+$/, ""); // Adjust as needed
        return cloudinary.uploader.destroy(publicId, { resource_type }); // Set resource_type to 'image'
      });

      return await Promise.all(deletePromises);
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting image from Cloudinary");
    }
  }
}

// Upload an image
//   const uploadResult = await cloudinary.uploader
//   .upload(
//       'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//           public_id: 'shoes',
//       }
//   )
//   .catch((error) => {
//       console.log(error);
//   });

// console.log(uploadResult);

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//    fetch_format: 'auto',
//    quality: 'auto'
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//    crop: 'auto',
//    gravity: 'auto',
//    width: 500,
//    height: 500,
// });

// console.log(autoCropUrl);

// cloudinary.v2.api
//   .delete_resources(['q233xfndywwbwminzkby'], { type: 'upload', resource_type: 'image' })
//   .then(console.log);
