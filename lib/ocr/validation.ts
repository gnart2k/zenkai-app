import type { FileValidation } from './types';

export function validateFileForOCR(file: File): FileValidation {
  if (!file) {
    return { 
      isValid: false, 
      error: 'No file provided' 
    };
  }

  // File type validation
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Only PDF, JPG, and PNG files are allowed.' 
    };
  }

  // File size validation (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File size too large. Maximum size is 10MB.' 
    };
  }

  // File name validation
  if (!file.name || file.name.trim().length === 0) {
    return { 
      isValid: false, 
      error: 'Invalid file name.' 
    };
  }

  // Check for problematic file extensions in name
  const problematicExtensions = ['.exe', '.bat', '.cmd', '.scr', '.php', '.js', '.vbs'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (problematicExtensions.includes(fileExtension)) {
    return { 
      isValid: false, 
      error: 'File type not allowed for security reasons.' 
    };
  }

  // Additional validation for specific file types
  const warnings: string[] = [];

  // PDF-specific validations
  if (file.type === 'application/pdf') {
    if (file.size > 8 * 1024 * 1024) { // > 8MB
      warnings.push('Large PDF files may have reduced accuracy. Consider optimizing the PDF if possible.');
    }
  }

  // Image-specific validations
  if (file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) { // > 5MB
      warnings.push('Large image files may take longer to process.');
    }
    
    // Check if image dimensions might be too small (potential quality issue)
    if (file.name.toLowerCase().includes('thumbnail') || file.name.toLowerCase().includes('small')) {
      warnings.push('Small or thumbnail images may produce poor OCR results.');
    }
  }

  // General large file warnings
  if (file.size > 5 * 1024 * 1024) { // > 5MB
    warnings.push('Large files may take longer to process.');
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

export function validateFileName(fileName: string): { isValid: boolean; error?: string } {
  if (!fileName || typeof fileName !== 'string') {
    return { isValid: false, error: 'Invalid file name' };
  }

  const trimmedName = fileName.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: false, error: 'File name cannot be empty' };
  }

  if (trimmedName.length > 255) {
    return { isValid: false, error: 'File name too long (max 255 characters)' };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(trimmedName)) {
    return { isValid: false, error: 'File name contains invalid characters' };
  }

  // Check for reserved names (Windows)
  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ];
  
  const nameWithoutExt = trimmedName.split('.')[0].toUpperCase();
  if (reservedNames.includes(nameWithoutExt)) {
    return { isValid: false, error: 'File name is reserved' };
  }

  return { isValid: true };
}

export function sanitizeFileName(fileName: string): string {
  if (!fileName) return 'untitled';

  // Remove invalid characters
  let sanitized = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
  
  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1f\x7f-\x9f]/g, '');
  
  // Ensure it's not empty
  if (sanitized.trim().length === 0) {
    sanitized = 'untitled';
  }

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized;
}

export function getFileExtension(fileName: string): string {
  if (!fileName) return '';
  
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  
  return fileName.substring(lastDotIndex).toLowerCase();
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf';
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  return `${nameWithoutExt}_${timestamp}${extension}`;
}