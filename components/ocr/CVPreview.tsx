'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CVData, 
  ValidationResult, 
  ValidationIssue,
  DataSuggestion 
} from '@/lib/ocr/analysis';
import { 
  Edit2, 
  Save, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Lightbulb,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Plus,
  Trash2
} from 'lucide-react';

interface CVPreviewProps {
  cvData: Partial<CVData>;
  validation: ValidationResult;
  onDataChange: (data: Partial<CVData>) => void;
  onValidationChange: (validation: ValidationResult) => void;
  editable?: boolean;
}

export function CVPreview({ 
  cvData, 
  validation, 
  onDataChange, 
  onValidationChange,
  editable = true 
}: CVPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<CVData>>(cvData);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal-info', 'experience']));

  useEffect(() => {
    setTempData(cvData);
  }, [cvData]);

  const handleSaveChanges = () => {
    onDataChange(tempData);
    setIsEditing(false);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setTempData(cvData);
    setIsEditing(false);
    setEditingField(null);
  };

  const handleFieldChange = (field: string, value: any) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedFieldChange = (parent: string, field: string, value: any) => {
    setTempData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof CVData] as any),
        [field]: value
      }
    }));
  };

  const handleArrayItemChange = (array: string, index: number, field: string, value: any) => {
    setTempData(prev => ({
      ...prev,
      [array]: (prev[array as keyof CVData] as any[])?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (array: string) => {
    const newItem = getDefaultArrayItem(array);
    setTempData(prev => ({
      ...prev,
      [array]: [...(prev[array as keyof CVData] as any[] || []), newItem]
    }));
  };

  const removeArrayItem = (array: string, index: number) => {
    setTempData(prev => ({
      ...prev,
      [array]: (prev[array as keyof CVData] as any[])?.filter((_, i) => i !== index)
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getIssueIcon = (severity: ValidationIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIssuesForField = (field: string): ValidationIssue[] => {
    return validation.issues.filter(issue => issue.field === field);
  };

  const getSuggestionsForField = (field: string): DataSuggestion[] => {
    return validation.suggestions.filter(suggestion => suggestion.field === field);
  };

  const applySuggestion = (suggestion: DataSuggestion) => {
    const fieldParts = suggestion.field.split('.');
    
    if (fieldParts.length === 1) {
      handleFieldChange(fieldParts[0], suggestion.suggestedValue);
    } else if (fieldParts.length === 2) {
      handleNestedFieldChange(fieldParts[0], fieldParts[1], suggestion.suggestedValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">CV Preview</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              validation.score >= 80 ? 'bg-green-500' :
              validation.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">Score: {validation.score}/100 ({validation.grade})</span>
          </div>
        </div>
        
        {editable && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button onClick={handleSaveChanges} size="sm" variant="default">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancelEdit} size="sm" variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <CollapsibleSection
        title="Summary"
        icon={<User className="w-5 h-5" />}
        expanded={expandedSections.has('summary')}
        onToggle={() => toggleSection('summary')}
        issues={getIssuesForField('summary')}
        suggestions={getSuggestionsForField('summary')}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <textarea
              id="summary"
              value={tempData.summary || ''}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              className="w-full p-3 border rounded-md min-h-[100px] resize-y"
              placeholder="Brief professional summary highlighting your experience and goals..."
            />
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">
            {cvData.summary || 'No summary provided'}
          </p>
        )}
      </CollapsibleSection>

      {/* Personal Information Section */}
      <CollapsibleSection
        title="Personal Information"
        icon={<User className="w-5 h-5" />}
        expanded={expandedSections.has('personal-info')}
        onToggle={() => toggleSection('personal-info')}
        issues={validation.issues.filter(i => i.field.startsWith('personalInfo.'))}
        suggestions={validation.suggestions.filter(s => s.field.startsWith('personalInfo.'))}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { field: 'name', label: 'Name', placeholder: 'John Doe' },
            { field: 'email', label: 'Email', placeholder: 'john@example.com' },
            { field: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567' },
            { field: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
            { field: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe' },
            { field: 'github', label: 'GitHub', placeholder: 'github.com/johndoe' }
          ].map(({ field, label, placeholder }) => (
            <div key={field} className="space-y-1">
              <Label htmlFor={field}>{label}</Label>
              {isEditing ? (
                <Input
                  id={field}
                  value={tempData.personalInfo?.[field as keyof typeof tempData.personalInfo] || ''}
                  onChange={(e) => handleNestedFieldChange('personalInfo', field, e.target.value)}
                  placeholder={placeholder}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  {(cvData.personalInfo?.[field as keyof typeof cvData.personalInfo] as string) || 
                   <span className="text-gray-400">Not provided</span>}
                </div>
              )}
              <FieldIssues
                issues={getIssuesForField(`personalInfo.${field}`)}
                suggestions={getSuggestionsForField(`personalInfo.${field}`)}
                onApplySuggestion={applySuggestion}
                isEditing={isEditing}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Experience Section */}
      <CollapsibleSection
        title="Experience"
        icon={<Briefcase className="w-5 h-5" />}
        expanded={expandedSections.has('experience')}
        onToggle={() => toggleSection('experience')}
        issues={validation.issues.filter(i => i.field.startsWith('experience'))}
        suggestions={validation.suggestions.filter(s => s.field.startsWith('experience'))}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        <div className="space-y-4">
          {tempData.experience?.map((exp, index) => (
            <Card key={index} className="p-4 border-l-4 border-l-blue-500">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Experience #{index + 1}</h4>
                  {isEditing && (
                    <Button
                      onClick={() => removeArrayItem('experience', index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { field: 'title', label: 'Job Title', placeholder: 'Software Engineer' },
                    { field: 'company', label: 'Company', placeholder: 'Tech Corp' },
                    { field: 'duration', label: 'Duration', placeholder: '2020 - Present' },
                    { field: 'location', label: 'Location', placeholder: 'San Francisco, CA' }
                  ].map(({ field, label, placeholder }) => (
                    <div key={field} className="space-y-1">
                      <Label>{label}</Label>
                      {isEditing ? (
                        <Input
                          value={(exp[field as keyof typeof exp] as string) || ''}
                          onChange={(e) => handleArrayItemChange('experience', index, field, e.target.value)}
                          placeholder={placeholder}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border text-sm">
                          {(exp[field as keyof typeof exp] as string) || <span className="text-gray-400">Not provided</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-1">
                  <Label>Description</Label>
                  {isEditing ? (
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)}
                      className="w-full p-2 border rounded-md min-h-[80px] resize-y"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border text-sm">
                      {exp.description || 'No description provided'}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {isEditing && (
            <Button onClick={() => addArrayItem('experience')} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
      </CollapsibleSection>

      {/* Education Section */}
      <CollapsibleSection
        title="Education"
        icon={<GraduationCap className="w-5 h-5" />}
        expanded={expandedSections.has('education')}
        onToggle={() => toggleSection('education')}
        issues={validation.issues.filter(i => i.field.startsWith('education'))}
        suggestions={validation.suggestions.filter(s => s.field.startsWith('education'))}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        <div className="space-y-4">
          {tempData.education?.map((edu, index) => (
            <Card key={index} className="p-4 border-l-4 border-l-green-500">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Education #{index + 1}</h4>
                  {isEditing && (
                    <Button
                      onClick={() => removeArrayItem('education', index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { field: 'degree', label: 'Degree', placeholder: 'Bachelor of Science in Computer Science' },
                    { field: 'institution', label: 'Institution', placeholder: 'University of Technology' },
                    { field: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
                    { field: 'year', label: 'Year', placeholder: '2020' }
                  ].map(({ field, label, placeholder }) => (
                    <div key={field} className="space-y-1">
                      <Label>{label}</Label>
                      {isEditing ? (
                        <Input
                          value={(edu[field as keyof typeof edu] as string) || ''}
                          onChange={(e) => handleArrayItemChange('education', index, field, e.target.value)}
                          placeholder={placeholder}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border text-sm">
                          {(edu[field as keyof typeof edu] as string) || <span className="text-gray-400">Not provided</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          
          {isEditing && (
            <Button onClick={() => addArrayItem('education')} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          )}
        </div>
      </CollapsibleSection>

      {/* Skills Section */}
      <CollapsibleSection
        title="Skills"
        icon={<Code className="w-5 h-5" />}
        expanded={expandedSections.has('skills')}
        onToggle={() => toggleSection('skills')}
        issues={validation.issues.filter(i => i.field.startsWith('skills'))}
        suggestions={validation.suggestions.filter(s => s.field.startsWith('skills'))}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        <div className="space-y-4">
          {[
            { key: 'technical', label: 'Technical Skills', color: 'blue' },
            { key: 'soft', label: 'Soft Skills', color: 'green' },
            { key: 'languages', label: 'Languages', color: 'purple' }
          ].map(({ key, label, color }) => (
            <div key={key} className="space-y-2">
              <Label className="font-medium">{label}</Label>
              {isEditing ? (
                <Input
                  value={(tempData.skills?.[key as keyof typeof tempData.skills] as string[] || []).join(', ')}
                  onChange={(e) => {
                    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    handleNestedFieldChange('skills', key, skillsArray);
                  }}
                  placeholder={`Enter ${label.toLowerCase()} separated by commas`}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(cvData.skills?.[key as keyof typeof cvData.skills] as string[] || []).map((skill, index) => (
                    <Badge key={index} variant={`secondary`} className={`${color === 'blue' ? 'bg-blue-100 text-blue-800' : color === 'green' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                      {skill}
                    </Badge>
                  ))}
                  {(!cvData.skills?.[key as keyof typeof cvData.skills] || 
                    (cvData.skills?.[key as keyof typeof cvData.skills] as string[] || []).length === 0) && (
                    <span className="text-gray-400 text-sm">No {label.toLowerCase()} added</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

// Helper Components
interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  issues: ValidationIssue[];
  suggestions: DataSuggestion[];
  onApplySuggestion: (suggestion: DataSuggestion) => void;
  isEditing: boolean;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  expanded,
  onToggle,
  issues,
  suggestions,
  onApplySuggestion,
  isEditing,
  editingField,
  setEditingField,
  children
}: CollapsibleSectionProps) {
  const hasIssues = issues.length > 0 || suggestions.length > 0;
  const hasErrors = issues.some(i => i.severity === 'error');
  const hasWarnings = issues.some(i => i.severity === 'warning');

  return (
    <Card className={`overflow-hidden ${hasErrors ? 'border-red-200' : hasWarnings ? 'border-yellow-200' : ''}`}>
      <div
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
          hasErrors ? 'bg-red-50' : hasWarnings ? 'bg-yellow-50' : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`}>
            <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400" />
          </div>
          {icon}
          <h3 className="font-semibold">{title}</h3>
          {hasIssues && (
            <div className="flex items-center space-x-1">
              {hasErrors && <AlertCircle className="w-4 h-4 text-red-500" />}
              {hasWarnings && !hasErrors && <AlertCircle className="w-4 h-4 text-yellow-500" />}
              {suggestions.length > 0 && issues.length === 0 && <Lightbulb className="w-4 h-4 text-blue-500" />}
              <span className="text-sm text-gray-600">
                ({issues.length + suggestions.length} items)
              </span>
            </div>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </Card>
  );
}

interface FieldIssuesProps {
  issues: ValidationIssue[];
  suggestions: DataSuggestion[];
  onApplySuggestion: (suggestion: DataSuggestion) => void;
  isEditing: boolean;
}

function FieldIssues({ issues, suggestions, onApplySuggestion, isEditing }: FieldIssuesProps) {
  if (issues.length === 0 && suggestions.length === 0) return null;

  return (
    <div className="space-y-1">
      {issues.map((issue, index) => (
        <div key={index} className="flex items-start space-x-2 text-xs p-2 bg-gray-50 rounded">
          {issue.severity === 'error' && <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />}
          {issue.severity === 'warning' && <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />}
          {issue.severity === 'info' && <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />}
          <span className="text-gray-600">{issue.message}</span>
        </div>
      ))}
      
      {suggestions.map((suggestion, index) => (
        <div key={index} className="flex items-start space-x-2 text-xs p-2 bg-blue-50 rounded">
          <Lightbulb className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-gray-600">{suggestion.reason}</span>
            {isEditing && (
              <Button
                onClick={() => onApplySuggestion(suggestion)}
                size="sm"
                variant="outline"
                className="mt-1 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Apply Suggestion
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to get default array items
function getDefaultArrayItem(array: string): any {
  switch (array) {
    case 'experience':
      return {
        title: '',
        company: '',
        duration: '',
        description: '',
        location: ''
      };
    case 'education':
      return {
        degree: '',
        institution: '',
        field: '',
        year: ''
      };
    default:
      return {};
  }
}