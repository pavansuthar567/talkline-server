import { Response } from "express";

/**
 * Options for error handling.
 */
interface ErrorOptions {
  other?: Record<string, any>;
  returnStackTrace?: boolean;
  code?: string;
  message?: string; // Add message property here
}

export interface MulterRequest extends Request {
  files: Array<any>;
}

/**
 * Create a response object.
 * @param {Response} res - The response object
 * @param {string} status - 'ok' | 'error'
 * @param {string} msg - Response message
 * @param {object | Array<any>} payload - Array or Object
 * @param {object} [other] - Additional object properties
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {Response} - Express response
 */
export const createResponse = (
  res: Response,
  status: "ok" | "error",
  msg: string,
  payload: object | any[],
  other: Record<string, any> = {},
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    status,
    message: msg,
    data: payload,
    ...other,
  });
};

/**
 * Create an error response object.
 * @param {Response} res - The response object
 * @param {any} error - Error object or message
 * @param {ErrorOptions} [options] - Options for error handling
 * @param {number} [statusCode=400] - HTTP status code
 * @returns {Response} - Express response
 */
export const createError = (
  res: Response,
  error: any,
  options: ErrorOptions = {},
  statusCode: number = 400
): Response => {
  if (!options) options = {};
  if (!options.other) options.other = {};

  const message =
    (error && error.message) ||
    (typeof error === "string" && error) ||
    options.message || // Now TypeScript recognizes message
    "Error Occurred";

  const stackTrace = error || message;

  console.error("ERROR:", message, stackTrace);

  res.locals.errorStr = message;

  const other = {
    ...options.other,
    ...(options.returnStackTrace ? { error: error.message } : {}),
  };

  const other2 = options.code ? { code: options.code } : {};

  if (error && error.message && !options.code) {
    const exception =
      error.error || error.message || error.originalError || error;
    // Sentry.captureException(exception);
  }

  return createResponse(res, "error", message, other, other2, statusCode);
};

export class Logger {
  static SUCCESS(message: string) {
    console.log("✅", message);
  }
  static ERROR(message: string) {
    console.log("❌", message);
  }
  static INFO(message: string) {
    console.log("ℹ️", message);
  }
}

export function flattenSkills(skills: any): string[] {
  if (!skills) return []; // Handle null/undefined

  if (Array.isArray(skills)) {
    return skills.reduce((acc: string[], item: any) => {
      if (typeof item === "string") {
        acc.push(item); // Direct string
      } else if (Array.isArray(item)) {
        acc.push(...flattenSkills(item)); // Nested array
      } else if (typeof item === "object" && item !== null) {
        acc.push(...flattenSkills(Object.values(item))); // Object values
      }
      return acc;
    }, []);
  }

  if (typeof skills === "object" && skills !== null) {
    return flattenSkills(Object.values(skills)); // Flatten object values (e.g., technical_skills, other_skills)
  }

  return []; // Fallback for unexpected types
}
