'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DocumentUpload } from '@/components/ocr/DocumentUpload';
import { CVPreview } from '@/components/ocr/CVPreview';
import { JDPreview } from '@/components/ocr/JDPreview';
import { MissingDataAlert } from '@/components/ocr/MissingDataAlert';
import { 
  extractDocumentText 
} from '@/lib/ocr/actions';
import { 
  extractCVData, 
  extractJDData 
} from '@/lib/ocr/extractors';
import { 
  validateDocument 
} from '@/lib/ocr/validator';
import { 
  analyzeMissingData 
} from '@/lib/ocr/missing-data';
import {
  CVData,
  JDData,
  ValidationResult,
  MissingDataAnalysis,
  ProcessingPipeline
} from '@/lib/ocr/analysis';
import { 
  Upload, 
  FileText, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface DocumentUploadFlowProps {
  onDocumentComplete: (data: { cv?: CVData; jd?: JDData }, type: 'cv' | 'jd') => void;
  initialDocumentType?: 'cv' | 'jd';
  mode?: 'single' | 'both'; // single document vs both CV and JD
  allowSwitchType?: boolean;
}

type UploadStep = 'upload' | 'preview' | 'validate' | 'complete';
type DocumentType = 'cv' | 'jd';

interface DocumentData {
  type: DocumentType;
  originalText: string;
  extractedData: Partial<CVData> | Partial<JDData>;
  validation: ValidationResult;
  missingData: MissingDataAnalysis;
  fileName: string;
  extractedAt: Date;
}

export function DocumentUploadFlow({ 
  onDocumentComplete, 
  initialDocumentType = 'cv',
  mode = 'single',
  allowSwitchType = true
}: DocumentUploadFlowProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [documentType, setDocumentType] = useState<DocumentType>(initialDocumentType);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null);
  const [bothDocuments, setBothDocuments] = useState<{ cv?: DocumentData; jd?: DocumentData }>({});
  const [errors, setErrors] = useState<string[]>([]);

  const steps = mode === 'both' 
    ? [
        { id: 'upload-cv', name: 'Upload CV', icon: FileText },
        { id: 'upload-jd', name: 'Upload JD', icon: FileText },
        { id: 'preview-cv', name: 'Review CV', icon: Eye },
        { id: 'preview-jd', name: 'Review JD', icon: Eye },
        { id: 'validate', name: 'Validate', icon: AlertCircle },
        { id: 'complete', name: 'Complete', icon: CheckCircle }
      ]
    : [
        { id: 'upload', name: 'Upload Document', icon: Upload },
        { id: 'preview', name: 'Review & Edit', icon: Eye },
        { id: 'validate', name: 'Validation', icon: AlertCircle },
        { id: 'complete', name: 'Complete', icon: CheckCircle }
      ];

  const getCurrentStepIndex = () => {
    if (mode === 'both') {
      if (!bothDocuments.cv && !bothDocuments.jd) return 0; // upload-cv
      if (!bothDocuments.jd) return 1; // upload-jd
      if (!currentDocument) return 2; // preview-cv
      if (currentDocument.type === 'cv') return 3; // preview-jd
      if (!currentDocument.validation) return 4; // validate
      return 5; // complete
    } else {
      switch (currentStep) {
        case 'upload': return 0;
        case 'preview': return 1;
        case 'validate': return 2;
        case 'complete': return 3;
        default: return 0;
      }
    }
  };

  const getProgress = () => {
    const totalSteps = steps.length;
    const currentStepIndex = getCurrentStepIndex();
    return ((currentStepIndex + 1) / totalSteps) * 100;
  };

  const handleTextExtracted = async (text: string, fileName: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setErrors([]);
    setProcessingMessage('Extracting structured data...');

    try {
      // Update progress
      setProcessingProgress(20);

      // Detect document type if not specified
      const detectedType = mode === 'both' ? documentType : await detectDocumentType(text);
      
      // Extract structured data
      setProcessingMessage('Analyzing document content...');
      setProcessingProgress(40);

      let extractedData: CVData | JDData;
      let confidence: number;

      if (detectedType === 'cv') {
        const result = await extractCVData(text);
        extractedData = result.data as CVData;
        confidence = result.confidence;
      } else {
        const result = await extractJDData(text);
        extractedData = result.data as JDData;
        confidence = result.confidence;
      }

      setProcessingProgress(60);
      setProcessingMessage('Validating extracted data...');

      // Validate the extracted data
      const validation = await validateDocument(extractedData, detectedType);
      setProcessingProgress(80);

      setProcessingMessage('Analyzing missing information...');
      
      // Analyze missing data
      const missingData = await analyzeMissingData(extractedData, detectedType, validation);
      setProcessingProgress(100);

      const documentData: DocumentData = {
        type: detectedType,
        originalText: text,
        extractedData,
        validation,
        missingData,
        fileName,
        extractedAt: new Date()
      };

      if (mode === 'both') {
        setBothDocuments(prev => ({
          ...prev,
          [detectedType]: documentData
        }));
        
        // If this is the first document, set up for the next
        if (!bothDocuments.cv && detectedType === 'cv') {
          setDocumentType('jd');
          setCurrentStep('upload');
        } else if (!bothDocuments.jd) {
          // Both documents uploaded, move to preview
          setCurrentDocument(documentData);
          setCurrentStep('preview');
        }
      } else {
        setCurrentDocument(documentData);
        setCurrentStep('preview');
      }

    } catch (error) {
      console.error('Document processing error:', error);
      setErrors([error instanceof Error ? error.message : 'Failed to process document']);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingMessage('');
    }
  };

  const handleDocumentDataChange = (updatedData: Partial<CVData> | Partial<JDData>) => {
    if (!currentDocument) return;

    const updatedDocument: DocumentData = {
      ...currentDocument,
      extractedData: updatedData
    };

    setCurrentDocument(updatedDocument);

    // Re-validate and re-analyze
    validateAndUpdateDocument(updatedDocument);
  };

  const validateAndUpdateDocument = async (document: DocumentData) => {
    try {
      const validation = await validateDocument(document.extractedData, document.type);
      const missingData = await analyzeMissingData(document.extractedData, document.type, validation);

      const updatedDocument: DocumentData = {
        ...document,
        validation,
        missingData
      };

      setCurrentDocument(updatedDocument);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleProceedToValidation = () => {
    if (!currentDocument) return;
    setCurrentStep('validate');
    validateAndUpdateDocument(currentDocument);
  };

  const handleComplete = () => {
    if (mode === 'both') {
      onDocumentComplete({
        cv: bothDocuments.cv?.extractedData as CVData,
        jd: bothDocuments.jd?.extractedData as JDData
      }, 'cv');
    } else if (currentDocument) {
      onDocumentComplete({
        [currentDocument.type]: currentDocument.extractedData
      }, currentDocument.type);
    }
  };

  const handleRetry = () => {
    setCurrentDocument(null);
    setBothDocuments({});
    setCurrentStep('upload');
    setErrors([]);
  };

  const handleSwitchDocumentType = (type: DocumentType) => {
    setDocumentType(type);
    if (bothDocuments[type]) {
      setCurrentDocument(bothDocuments[type]!);
      setCurrentStep('preview');
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'upload':
        return mode === 'both' ? bothDocuments.cv && bothDocuments.jd : currentDocument !== null;
      case 'preview':
        return currentDocument !== null;
      case 'validate':
        return currentDocument?.validation?.score && currentDocument.validation.score > 50;
      default:
        return false;
    }
  };

  const getNextStepLabel = () => {
    switch (currentStep) {
      case 'upload':
        return mode === 'both' && !bothDocuments.jd ? 'Upload JD' : 'Review Document';
      case 'preview':
        return 'Validate Data';
      case 'validate':
        return 'Complete Setup';
      default:
        return 'Next';
    }
  };

  const getStepIcon = (stepId: string, index: number) => {
    const currentStepIndex = getCurrentStepIndex();
    const isActive = index === currentStepIndex;
    const isCompleted = index < currentStepIndex;
    
    const StepIcon = steps[index].icon;
    
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (isActive) {
      return <StepIcon className="w-5 h-5 text-blue-500" />;
    } else {
      return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  // Simple document type detection
  const detectDocumentType = async (text: string): Promise<'cv' | 'jd'> => {
    const cvIndicators = ['experience', 'education', 'skills', 'summary', 'objective', 'employment'];
    const jdIndicators = ['requirements', 'responsibilities', 'qualifications', 'job description', 'position', 'company'];
    
    const cvScore = cvIndicators.filter(word => text.toLowerCase().includes(word)).length;
    const jdScore = jdIndicators.filter(word => text.toLowerCase().includes(word)).length;
    
    return cvScore > jdScore ? 'cv' : 'jd';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Document Upload & Analysis</h1>
        <p className="text-gray-600">
          {mode === 'both' 
            ? 'Upload your CV and Job Description for intelligent analysis and validation'
            : 'Upload your document for intelligent extraction and validation'
          }
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  {getStepIcon(step.id, index)}
                </div>
                <span className={`text-sm font-medium ${
                  index <= getCurrentStepIndex() ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  index < getCurrentStepIndex() ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Overall Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} className="w-full" />
        </div>
      </div>

      {/* Document Type Switcher (for both mode) */}
      {mode === 'both' && allowSwitchType && (
        <div className="flex justify-center space-x-4">
          <Button
            variant={documentType === 'cv' ? 'default' : 'outline'}
            onClick={() => handleSwitchDocumentType('cv')}
            disabled={!bothDocuments.cv}
          >
            <FileText className="w-4 h-4 mr-2" />
            CV {bothDocuments.cv && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
          </Button>
          <Button
            variant={documentType === 'jd' ? 'default' : 'outline'}
            onClick={() => handleSwitchDocumentType('jd')}
            disabled={!bothDocuments.jd}
          >
            <FileText className="w-4 h-4 mr-2" />
            JD {bothDocuments.jd && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
          </Button>
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {errors.length > 0 && (
            <Card className="p-4 mb-6 border-red-200 bg-red-50">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Processing Errors</h3>
                  <ul className="mt-2 space-y-1 text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                  <Button onClick={handleRetry} variant="outline" size="sm" className="mt-3">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {isProcessing && (
            <Card className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                <h3 className="text-lg font-semibold">{processingMessage}</h3>
                <div className="w-full max-w-md">
                  <Progress value={processingProgress} className="w-full" />
                </div>
              </div>
            </Card>
          )}

          {!isProcessing && currentStep === 'upload' && (
            <DocumentUpload 
              onTextExtracted={(text: string) => handleTextExtracted(text, 'document.pdf')}
            />
          )}

          {!isProcessing && currentStep === 'preview' && currentDocument && (
            <div className="space-y-6">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      Document Analysis: {currentDocument.type === 'cv' ? 'CV' : 'Job Description'}
                    </h3>
                    <p className="text-sm text-blue-600 mt-1">
                      File: {currentDocument.fileName} | 
                      Extracted: {currentDocument.extractedAt.toLocaleString()} |
                      Confidence: {currentDocument.validation.confidence}%
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={currentDocument.validation.score >= 80 ? 'default' : 'secondary'}>
                      Score: {currentDocument.validation.score}/100
                    </Badge>
                    <Badge variant="outline">
                      {currentDocument.validation.grade}
                    </Badge>
                  </div>
                </div>
              </Card>

              {currentDocument.type === 'cv' ? (
                <CVPreview
                  cvData={currentDocument.extractedData as CVData}
                  validation={currentDocument.validation}
                  onDataChange={handleDocumentDataChange}
                  onValidationChange={() => {}}
                  editable={true}
                />
              ) : (
                <JDPreview
                  jdData={currentDocument.extractedData as JDData}
                  validation={currentDocument.validation}
                  onDataChange={handleDocumentDataChange}
                  onValidationChange={() => {}}
                  editable={true}
                />
              )}
            </div>
          )}

          {!isProcessing && currentStep === 'validate' && currentDocument && (
            <div className="space-y-6">
              <MissingDataAlert
                missingData={currentDocument.missingData}
                onApplySuggestions={(suggestions: any[]) => {
                  // Apply suggestions to the document
                  console.log('Applying suggestions:', suggestions);
                }}
              />

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Validation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      currentDocument.validation.score >= 80 ? 'text-green-600' :
                      currentDocument.validation.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {currentDocument.validation.score}
                    </div>
                    <p className="text-sm text-gray-600">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {currentDocument.validation.completeness.overall}%
                    </div>
                    <p className="text-sm text-gray-600">Completeness</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {currentDocument.validation.qualityScore.overall}%
                    </div>
                    <p className="text-sm text-gray-600">Quality Score</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {!isProcessing && currentStep === 'complete' && (
            <Card className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Document Processing Complete!</h2>
              <p className="text-gray-600 mb-6">
                Your {currentDocument?.type === 'cv' ? 'CV' : 'Job Description'} has been successfully analyzed and validated.
                You can now proceed to create your interview session.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <Button onClick={handleComplete} size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Continue to Interview
                </Button>
                <Button onClick={handleRetry} variant="outline" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Process Another Document
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      {!isProcessing && (
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (mode === 'both' && currentStep === 'upload' && bothDocuments.cv && !bothDocuments.jd) {
                setDocumentType('cv');
                setCurrentDocument(bothDocuments.cv!);
                setCurrentStep('preview');
              } else if (currentStep !== 'upload') {
                setCurrentStep(currentStep === 'complete' ? 'validate' : 
                             currentStep === 'validate' ? 'preview' : 'upload');
              }
            }}
            disabled={currentStep === 'upload' && !currentDocument}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={() => {
              if (currentStep === 'upload') {
                if (mode === 'both' && !bothDocuments.jd) {
                  // Will move to preview after JD upload
                } else {
                  setCurrentStep('preview');
                }
              } else if (currentStep === 'preview') {
                handleProceedToValidation();
              } else if (currentStep === 'validate') {
                setCurrentStep('complete');
              }
            }}
            disabled={!canProceedToNext()}
          >
            {getNextStepLabel()}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}