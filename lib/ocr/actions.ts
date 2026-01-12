"use server";

import { revalidatePath } from "next/cache";
import type { OCRResult, FileValidation } from "./types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export async function extractDocumentText(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const extractText = formData.get("extractText") === "true";
    const extractTables = formData.get("extractTables") === "true";
    const extractImages = formData.get("extractImages") === "true";

    // Validation
    if (!file) {
      return { error: "No file provided", success: false };
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        error: "Invalid file type. Only PDF, JPG, and PNG files are allowed.",
        success: false,
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        error: "File size too large. Maximum size is 10MB.",
        success: false,
      };
    }

    // Prepare form data for OCR service
    const ocrFormData = new FormData();
    ocrFormData.append("file", file);
    ocrFormData.append("extract_text", extractText.toString());
    ocrFormData.append("extract_tables", extractTables.toString());
    ocrFormData.append("extract_images", extractImages.toString());

    // Call OCR service
    const ocrServiceUrl =
      process.env.OCR_SERVICE_URL || "http://localhost:8000/extract-text";

    console.log(
      `Processing file: ${file.name}, Size: ${file.size}, Type: ${file.type}`
    );
    console.log(`Calling OCR service at: ${ocrServiceUrl}`);

    const startTime = Date.now();

    const response = await fetch(ocrServiceUrl, {
      method: "POST",
      body: ocrFormData,
    });

    const processingTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OCR service error (${response.status}):`, errorText);
      throw new Error(
        `OCR service error: ${response.statusText} (${response.status})`
      );
    }

    const result = await response.json();
    console.log(result);
    console.log("OCR processing completed successfully");

    // Enhance result with metadata
    const enhancedResult: OCRResult = {
      text: result.text || "",
      tables: result.tables || [],
      images: result.images || [],
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        processingTime,
        extractedAt: new Date(),
      },
    };

    // Revalidate any relevant paths
    revalidatePath("/ocr-test");

    return {
      success: true,
      data: enhancedResult,
      message: "Document processed successfully",
    };
  } catch (error) {
    console.error("OCR processing error:", error);

    let errorMessage = "Failed to process document. Please try again.";
    let details = "";

    if (error instanceof Error) {
      details = error.message;

      // Provide more specific error messages
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Unable to connect to OCR service. Please ensure the service is running.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "OCR service timed out. Please try with a smaller file.";
      } else if (
        error.message.includes("413") ||
        error.message.includes("too large")
      ) {
        errorMessage =
          "File is too large for processing. Maximum size is 10MB.";
      }
    }

    return {
      error: errorMessage,
      details,
      success: false,
    };
  }
}

export async function validateFileForOCR(file: File): Promise<FileValidation> {
  if (!file) {
    return {
      isValid: false,
      error: "No file provided",
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Only PDF, JPG, and PNG files are allowed.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "File size too large. Maximum size is 10MB.",
    };
  }

  // Check if file is actually readable
  try {
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength === 0) {
      return {
        isValid: false,
        error: "File appears to be empty or corrupted.",
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: "Unable to read file. The file may be corrupted.",
    };
  }

  const warnings: string[] = [];

  // Add warnings for potentially problematic files
  if (file.size > 5 * 1024 * 1024) {
    // > 5MB
    warnings.push("Large files may take longer to process.");
  }

  if (file.type === "application/pdf" && file.size > 8 * 1024 * 1024) {
    // > 8MB PDF
    warnings.push(
      "Large PDF files may have reduced accuracy. Consider optimizing the PDF if possible."
    );
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

export async function getOCRServiceStatus() {
  try {
    const ocrServiceUrl =
      process.env.OCR_SERVICE_URL || "http://localhost:8000/extract-text";

    const response = await fetch(ocrServiceUrl, {
      method: "HEAD",
    });

    return {
      available: response.ok,
      url: ocrServiceUrl,
      status: response.status,
      message: response.ok
        ? "OCR service is available"
        : `OCR service returned status ${response.status}`,
    };
  } catch (error) {
    console.error("OCR service status check error:", error);

    return {
      available: false,
      url: process.env.OCR_SERVICE_URL || "http://localhost:8000/extract-text",
      status: null,
      message:
        error instanceof Error
          ? error.message
          : "Unable to connect to OCR service",
    };
  }
}
