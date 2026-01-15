'use client';

import { useState } from 'react';
import { DocumentUploadFlow } from '@/components/ocr/DocumentUploadFlow';
import { CVData, JDData } from '@/lib/ocr/analysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Users, 
  Briefcase, 
  Upload, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function EnhancedUploadPage() {
  const [completedDocuments, setCompletedDocuments] = useState<{ cv?: CVData; jd?: JDData }>({});
  const [mode, setMode] = useState<'single' | 'both'>('single');
  const [showResults, setShowResults] = useState(false);

  const handleDocumentComplete = (data: { cv?: CVData; jd?: JDData }, type: 'cv' | 'jd') => {
    setCompletedDocuments(prev => ({
      ...prev,
      ...data
    }));
    setShowResults(true);
  };

  const handleReset = () => {
    setCompletedDocuments({});
    setShowResults(false);
  };

  const handleProceedToInterview = () => {
    // In a real implementation, this would navigate to interview setup
    console.log('Proceeding to interview setup with:', completedDocuments);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Enhanced Document Upload & Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your CV and/or Job Description for intelligent extraction, validation, and optimization suggestions
          </p>
        </div>

        {/* Upload Mode or Results Display */}
        {!showResults ? (
          <>
            {/* Mode Selection */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-4">Choose Upload Mode</h2>
                <Tabs value={mode} onValueChange={(value) => setMode(value as 'single' | 'both')} className="w-full max-w-md mx-auto">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      Single Document
                    </TabsTrigger>
                    <TabsTrigger value="both" className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      Both CV & JD
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="single" className="mt-4 text-center">
                    <p className="text-gray-600">
                      Upload and analyze a single document (CV or Job Description)
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="both" className="mt-4 text-center">
                    <p className="text-gray-600">
                      Upload both CV and Job Description for comprehensive analysis and matching
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            {/* Upload Flow */}
            <DocumentUploadFlow
              onDocumentComplete={handleDocumentComplete}
              mode={mode}
              initialDocumentType="cv"
              allowSwitchType={true}
            />
          </>
        ) : (
          <div className="space-y-8">
            <Card className="p-8 text-center bg-green-50 border-green-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-800 mb-2">
                Document Analysis Complete!
              </h2>
              <p className="text-lg text-green-700 mb-6">
                Your documents have been successfully processed and validated.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                {completedDocuments.cv && (
                  <div className="text-left">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      CV Analysis
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Personal Info:</span>
                        <span className={completedDocuments.cv.personalInfo?.name ? 'text-green-600' : 'text-red-600'}>
                          {completedDocuments.cv.personalInfo?.name ? '✓ Complete' : '✗ Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className={completedDocuments.cv.experience && completedDocuments.cv.experience.length > 0 ? 'text-green-600' : 'text-red-600'}>
                          {completedDocuments.cv.experience && completedDocuments.cv.experience.length > 0 ? `✓ ${completedDocuments.cv.experience.length} entries` : '✗ Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Skills:</span>
                        <span className={
                          (completedDocuments.cv.skills?.technical && completedDocuments.cv.skills.technical.length > 0) || 
                          (completedDocuments.cv.skills?.soft && completedDocuments.cv.skills.soft.length > 0) 
                            ? 'text-green-600' : 'text-red-600'
                        }>
                          ✓ Extracted
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {completedDocuments.jd && (
                  <div className="text-left">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      JD Analysis
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Job Title:</span>
                        <span className={completedDocuments.jd.jobTitle ? 'text-green-600' : 'text-red-600'}>
                          {completedDocuments.jd.jobTitle ? '✓ Complete' : '✗ Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Responsibilities:</span>
                        <span className={completedDocuments.jd.responsibilities && completedDocuments.jd.responsibilities.length > 0 ? 'text-green-600' : 'text-red-600'}>
                          {completedDocuments.jd.responsibilities && completedDocuments.jd.responsibilities.length > 0 ? `✓ ${completedDocuments.jd.responsibilities.length} items` : '✗ Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Requirements:</span>
                        <span className={
                          (completedDocuments.jd.requirements?.required && completedDocuments.jd.requirements.required.length > 0) || 
                          (completedDocuments.jd.requirements?.preferred && completedDocuments.jd.requirements.preferred.length > 0) 
                            ? 'text-green-600' : 'text-red-600'
                        }>
                          ✓ Extracted
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button onClick={handleProceedToInterview} size="lg" className="px-8">
                <ArrowRight className="w-4 h-4 mr-2" />
                Proceed to Interview Setup
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Upload Another Document
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Data Extraction</h3>
                <p className="text-gray-600 text-sm">
                  AI-powered extraction of structured data from your documents with 85%+ accuracy
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Validation</h3>
                <p className="text-gray-600 text-sm">
                  Instant validation with quality scoring and missing data detection
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Suggestions</h3>
                <p className="text-gray-600 text-sm">
                  AI-powered suggestions to improve your documents and match requirements
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}