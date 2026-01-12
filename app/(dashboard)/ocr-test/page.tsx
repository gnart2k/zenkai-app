'use client';

import { useState } from 'react';
import { DocumentUpload } from '@/components/ocr/DocumentUpload';
import { ExtractedText } from '@/components/ocr/ExtractedText';
import { detectDocumentType } from '@/lib/ocr/utils';

export default function OCRTestPage() {
  const [extractedText, setExtractedText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    setProcessing(false);
    setStatus('Processing completed successfully');
  };

  const handleError = (error: string) => {
    setStatus(`Error: ${error}`);
    setProcessing(false);
  };

  const handleProgress = (progressStatus: string) => {
    setStatus(progressStatus);
    if (progressStatus.includes('Processing') || progressStatus.includes('Uploading')) {
      setProcessing(true);
    }
  };

  const documentType = extractedText ? detectDocumentType(extractedText) : undefined;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">OCR Test Page</h1>
        <p className="text-gray-600">
          Test OCR functionality by uploading documents and viewing extracted text.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Documents are processed using the external OCR service at{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            {process.env.OCR_SERVICE_URL || 'http://localhost:8000/extract-text'}
          </code>
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DocumentUpload 
            onTextExtracted={handleTextExtracted}
            onError={handleError}
            onProgress={handleProgress}
          />
          
          {processing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 font-medium">Processing document...</span>
              </div>
            </div>
          )}
          
          {status && status.includes('Error') && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0 1 18 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Processing failed</p>
                  <p className="text-sm text-red-600">{status}</p>
                </div>
              </div>
            </div>
          )}
          
          {status && status.includes('successfully') && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4 6.01L21 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">Success!</p>
                  <p className="text-sm text-green-600">{status}</p>
                </div>
              </div> 
            </div>
          )}
        </div>
        
        <div>
          {extractedText && (
            <ExtractedText 
              text={extractedText} 
              type={documentType}
            />
          )}
        </div>
      </div>
    </div>
  );
}