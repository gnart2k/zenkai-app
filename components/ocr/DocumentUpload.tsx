"use client";

import { useState, useCallback } from "react";
import { extractDocumentText } from "@/lib/ocr/actions";
import { formatFileSize } from "@/lib/ocr/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getFileExtension, validateFileForOCR } from "@/lib/ocr/validation";

interface DocumentUploadProps {
  onTextExtracted: (text: string) => void;
  onError?: (error: string) => void;
  onProgress?: (status: string) => void;
  disabled?: boolean;
}

export function DocumentUpload({
  onTextExtracted,
  onError,
  onProgress,
  disabled = false,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = useCallback(
    async () => {
      if (uploading || disabled || !file) {
        console.log("uploading:", uploading, "disabled:", disabled, "file:", file);
        console.error("Upload in progress or disabled, or no file selected");
        return
      };
      const selectedFile: File = file;
      // Client-side validation
      const validation = validateFileForOCR(selectedFile);
      if (!validation.isValid) {
        const errorMsg = validation.error || "Invalid file";
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Show warnings if any
      if (validation.warnings && validation.warnings.length > 0) {
        onProgress?.(`Warnings: ${validation.warnings.join(", ")}`);
      }

      setUploading(true);
      setError("");
      onProgress?.("Validating file...");

      try {
        // Prepare form data for server action
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("extractText", "true");
        formData.append("extractTables", "false");
        formData.append("extractImages", "false");

        onProgress?.("Uploading to OCR service...");

        const result = await extractDocumentText(formData);
        console.log("OCR result:", result);
        if (result.success && result.data) {
          onTextExtracted(result.data.text);
          onProgress?.("Processing completed successfully");
        } else {
          const errorMsg = result.error || "Upload failed";
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (error) {
        const errorMsg = "Upload error occurred";
        setError(errorMsg);
        onError?.(errorMsg);
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
        setFile(null);
        // Clear progress after delay
        setTimeout(() => onProgress?.(""), 2000);
      }
    },
    [uploading, disabled, onError, onProgress, onTextExtracted]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
    }
  };

  const formatFileDisplay = (file: File) => {
    const extension = getFileExtension(file.name);
    const size = formatFileSize(file.size);
    return `${file.name} (${size}, ${extension})`;
  };

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return "📄";
      case "jpg":
      case "jpeg":
        return "🖼️";
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}
            ${error ? "border-red-300 bg-red-50" : ""}
            ${
              uploading || disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={uploading || disabled}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${
              uploading || disabled ? "pointer-events-none" : ""
            }`}
          >
            <div className="space-y-4">
              <div className="text-6xl mb-4">
                {file ? getFileIcon(getFileExtension(file.name)) : "📄"}
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {uploading ? "Processing..." : "Upload Document"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {file
                    ? formatFileDisplay(file)
                    : "PDF, JPG, or PNG files up to 10MB"}
                </p>
              </div>
              <Button
                disabled={uploading || disabled || !file}
                className="mt-4"
              >
                {uploading? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Choose File"
                )}
              </Button>
            </div>
          </label>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0 1 18 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Upload Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!error && !uploading && (
          <div className="text-sm text-gray-500 space-y-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4v4m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0 1 18 0z"
                />
              </svg>
              <span>Supported formats: PDF, JPG, PNG</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2v5a2 2 0 002 2h9.5a1.5 1.5 0 001.5-1.5v-5a2 2 0 00-2-2H7z"
                />
              </svg>
              <span>Maximum file size: 10MB</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z"
                />
              </svg>
              <span>Drag and drop supported</span>
            </div>
          </div>
        )}
        <Button className="" onClick={()=> handleFileUpload()}>
          Upload and Extract Text
        </Button>
      </div>
    </Card>
  );
}
