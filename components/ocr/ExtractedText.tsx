'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { calculateTextStats, truncateText, formatDuration } from '@/lib/ocr/utils';

interface ExtractedTextProps {
  text: string;
  type?: DocumentType | null | undefined;
}

export function ExtractedText({ text, type }: ExtractedTextProps) {
  const [copied, setCopied] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const stats = calculateTextStats(text);
  const previewLength = 500;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getDocumentTypeColor = () => {
    if (!type || type === 'unknown') return 'bg-gray-100 text-gray-800 border-gray-200';
    if (type === 'resume') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (type === 'job-description') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDocumentTypeLabel = () => {
    if (!type || type === 'unknown') return 'Unknown Document';
    if (type === 'resume') return 'Resume';
    if (type === 'job-description') return 'Job Description';
    return 'Document';
  };

  const displayText = showFullText ? text : truncateText(text, previewLength);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Extracted Text</h3>
        <div className="flex items-center gap-3">
          {type && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor()}`}>
              {getDocumentTypeLabel()}
            </span>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{stats.characters} chars</span>
            <span>•</span>
            <span>{stats.words} words</span>
            <span>•</span>
            <span>{stats.lines} lines</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {text.length > 0 ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
              {displayText}
            </pre>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2v5a2 2 0 002 2h9.5a1.5 1.5 0 001.5-1.5v-5a2 2 0 00-2-2H7z" />
              </svg>
              <p className="text-lg font-medium mb-2">No text extracted</p>
              <p className="text-sm">Please upload a document to see extracted text here.</p>
            </div>
          )}
        </div>
        
        {text.length > previewLength && !showFullText && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 to-transparent p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullText(true)}
              className="w-full"
            >
              Show Full Text ({text.length - previewLength} more characters)
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {text.length > 0 ? (
            <span>Estimated reading time: {Math.ceil(stats.words / 200)} min</span>
          ) : (
            <span>Ready for document upload</span>
          )}
        </div>
        
        {text.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h2M8 12H6a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2" />
                  </svg>
                  Copy Text
                </>
              )}
            </Button>
            
            {text.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpanded}
                className="text-gray-600 hover:text-gray-800"
              >
                {isExpanded ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Collapse
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Expand
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
      
      {isExpanded && text.length > 200 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">Document Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Characters:</p>
                <p className="text-gray-600">{stats.characters.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Words:</p>
                <p className="text-gray-600">{stats.words.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Lines:</p>
                <p className="text-gray-600">{stats.lines.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Sentences:</p>
                <p className="text-gray-600">{stats.sentences.toLocaleString()}</p>
              </div>
            </div>
            
            {type === 'resume' && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Resume detected!</p>
                <p className="text-sm text-blue-700">
                  This document appears to be a resume. Common elements like experience, education, and skills were detected in the text.
                </p>
              </div>
            )}
            
            {type === 'job-description' && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Job Description detected!</p>
                <p className="text-sm text-blue-700">
                  This document appears to be a job description. Elements like requirements and responsibilities were detected.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}