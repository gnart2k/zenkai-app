'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  JDData, 
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
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Users,
  Target,
  Code,
  Plus,
  Trash2
} from 'lucide-react';

interface JDPreviewProps {
  jdData: Partial<JDData>;
  validation: ValidationResult;
  onDataChange: (data: Partial<JDData>) => void;
  onValidationChange: (validation: ValidationResult) => void;
  editable?: boolean;
}

export function JDPreview({ 
  jdData, 
  validation, 
  onDataChange, 
  onValidationChange,
  editable = true 
}: JDPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<JDData>>(jdData);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['job-info', 'responsibilities']));

  useEffect(() => {
    setTempData(jdData);
  }, [jdData]);

  const handleSaveChanges = () => {
    onDataChange(tempData);
    setIsEditing(false);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setTempData(jdData);
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
        ...(prev[parent as keyof JDData] as any),
        [field]: value
      }
    }));
  };

  const handleArrayItemChange = (array: string, index: number, value: string) => {
    setTempData(prev => ({
      ...prev,
      [array]: (prev[array as keyof JDData] as string[])?.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (array: string) => {
    setTempData(prev => ({
      ...prev,
      [array]: [...(prev[array as keyof JDData] as string[] || []), '']
    }));
  };

  const removeArrayItem = (array: string, index: number) => {
    setTempData(prev => ({
      ...prev,
      [array]: (prev[array as keyof JDData] as string[])?.filter((_, i) => i !== index)
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

  const formatSalary = (salary?: JDData['salary']) => {
    if (!salary) return 'Not specified';
    const { min, max, currency, period } = salary;
    if (!min && !max) return 'Not specified';
    
    const formattedMin = min ? `$${min.toLocaleString()}` : '';
    const formattedMax = max ? `$${max.toLocaleString()}` : '';
    const range = formattedMin && formattedMax ? `${formattedMin} - ${formattedMax}` : formattedMin || formattedMax;
    const periodLabel = period === 'yearly' ? '/year' : period === 'hourly' ? '/hour' : '';
    
    return `${range}${periodLabel}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Job Description Preview</h2>
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

      {/* Job Information Section */}
      <CollapsibleSection
        title="Job Information"
        icon={<Briefcase className="w-5 h-5" />}
        expanded={expandedSections.has('job-info')}
        onToggle={() => toggleSection('job-info')}
        issues={validation.issues.filter(i => 
          ['jobTitle', 'company', 'location', 'employmentType', 'experienceLevel'].includes(i.field)
        )}
        suggestions={validation.suggestions.filter(s => 
          ['jobTitle', 'company', 'location', 'employmentType', 'experienceLevel'].includes(s.field)
        )}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { field: 'jobTitle', label: 'Job Title', icon: <Briefcase className="w-4 h-4" />, placeholder: 'Senior Software Engineer' },
            { field: 'company', label: 'Company', icon: <Briefcase className="w-4 h-4" />, placeholder: 'Tech Corp' },
            { field: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" />, placeholder: 'San Francisco, CA' },
            { field: 'employmentType', label: 'Employment Type', icon: <Clock className="w-4 h-4" />, placeholder: 'Full-time' },
            { field: 'experienceLevel', label: 'Experience Level', icon: <Users className="w-4 h-4" />, placeholder: 'Senior' }
          ].map(({ field, label, icon, placeholder }) => (
            <div key={field} className="space-y-2">
              <div className="flex items-center space-x-2">
                {icon}
                <Label htmlFor={field}>{label}</Label>
              </div>
              {isEditing && field !== 'salary' ? (
                <Input
                  id={field}
                  value={tempData[field as keyof JDData] as string || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={placeholder}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  {field === 'salary' ? formatSalary(jdData.salary) : 
                   (jdData[field as keyof JDData] as string) || 
                   <span className="text-gray-400">Not provided</span>}
                </div>
              )}
              <FieldIssues
                issues={getIssuesForField(field)}
                suggestions={getSuggestionsForField(field)}
                onApplySuggestion={applySuggestion}
                isEditing={isEditing}
              />
            </div>
          ))}
          
          {/* Salary Display */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <Label>Salary Range</Label>
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
                <Input
                  value={tempData.salary?.min || ''}
                  onChange={(e) => handleNestedFieldChange('salary', 'min', parseInt(e.target.value) || undefined)}
                  placeholder="Min"
                  type="number"
                />
                <Input
                  value={tempData.salary?.max || ''}
                  onChange={(e) => handleNestedFieldChange('salary', 'max', parseInt(e.target.value) || undefined)}
                  placeholder="Max"
                  type="number"
                />
              </div>
            ) : (
              <div className="p-2 bg-gray-50 rounded border">
                {formatSalary(jdData.salary)}
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Summary Section */}
      <CollapsibleSection
        title="Job Summary"
        icon={<Target className="w-5 h-5" />}
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
            <Label htmlFor="summary">Job Summary</Label>
            <textarea
              id="summary"
              value={tempData.summary || ''}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              className="w-full p-3 border rounded-md min-h-[120px] resize-y"
              placeholder="Brief description of the role, team, and company culture..."
            />
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">
            {jdData.summary || 'No summary provided'}
          </p>
        )}
      </CollapsibleSection>

      {/* Responsibilities Section */}
      <CollapsibleSection
        title="Key Responsibilities"
        icon={<Target className="w-5 h-5" />}
        expanded={expandedSections.has('responsibilities')}
        onToggle={() => toggleSection('responsibilities')}
        issues={validation.issues.filter(i => i.field.startsWith('responsibilities'))}
        suggestions={validation.suggestions.filter(s => s.field.startsWith('responsibilities'))}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        <div className="space-y-3">
          {tempData.responsibilities?.map((resp, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              {isEditing ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={resp}
                    onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
                    placeholder="Enter a key responsibility..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeArrayItem('responsibilities', index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-gray-700 flex-1">{resp}</p>
              )}
            </div>
          ))}
          
          {isEditing && (
            <Button onClick={() => addArrayItem('responsibilities')} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Responsibility
            </Button>
          )}
        </div>
      </CollapsibleSection>

      {/* Requirements Section */}
      <CollapsibleSection
        title="Requirements"
        icon={<Users className="w-5 h-5" />}
        expanded={expandedSections.has('requirements')}
        onToggle={() => toggleSection('requirements')}
        issues={validation.issues.filter(i => i.field.startsWith('requirements'))}
        suggestions={validation.suggestions.filter(s => s.field.startsWith('requirements'))}
        onApplySuggestion={applySuggestion}
        isEditing={isEditing}
        editingField={editingField}
        setEditingField={setEditingField}
      >
        <div className="space-y-6">
          {/* Required Skills */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Required Qualifications</h4>
            {tempData.requirements?.required?.map((req, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                {isEditing ? (
                  <div className="flex-1 flex space-x-2">
                    <Input
                      value={req}
                      onChange={(e) => handleArrayItemChange('requirements.required', index, e.target.value)}
                      placeholder="Enter a required qualification..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeArrayItem('requirements.required', index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-700 flex-1">{req}</p>
                )}
              </div>
            ))}
            
            {isEditing && (
              <Button 
                onClick={() => addArrayItem('requirements.required')} 
                variant="outline" 
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Required Qualification
              </Button>
            )}
          </div>

          {/* Preferred Skills */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Preferred Qualifications</h4>
            {tempData.requirements?.preferred?.map((req, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                {isEditing ? (
                  <div className="flex-1 flex space-x-2">
                    <Input
                      value={req}
                      onChange={(e) => handleArrayItemChange('requirements.preferred', index, e.target.value)}
                      placeholder="Enter a preferred qualification..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeArrayItem('requirements.preferred', index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-700 flex-1">{req}</p>
                )}
              </div>
            ))}
            
            {isEditing && (
              <Button 
                onClick={() => addArrayItem('requirements.preferred')} 
                variant="outline" 
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Preferred Qualification
              </Button>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Skills Section */}
      <CollapsibleSection
        title="Technical Skills"
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
            { key: 'tools', label: 'Tools', color: 'green' },
            { key: 'frameworks', label: 'Frameworks', color: 'purple' }
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
                  {(jdData.skills?.[key as keyof typeof jdData.skills] as string[] || []).map((skill, index) => (
                    <Badge key={index} variant={`secondary`} className={`${color === 'blue' ? 'bg-blue-100 text-blue-800' : color === 'green' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                      {skill}
                    </Badge>
                  ))}
                  {(!jdData.skills?.[key as keyof typeof jdData.skills] || 
                    (jdData.skills?.[key as keyof typeof jdData.skills] as string[] || []).length === 0) && (
                    <span className="text-gray-400 text-sm">No {label.toLowerCase()} specified</span>
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

// Helper Components (reusing from CVPreview)
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