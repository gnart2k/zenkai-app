'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MissingDataAnalysis, 
  MissingField, 
  PriorityAction 
} from '@/lib/ocr/analysis';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Clock,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';

interface MissingDataAlertProps {
  missingData: MissingDataAnalysis;
  onApplySuggestions: (suggestions: any[]) => void;
}

export function MissingDataAlert({ missingData, onApplySuggestions }: MissingDataAlertProps) {
  const getImportanceIcon = (importance: MissingField['importance']) => {
    switch (importance) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'recommended':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'optional':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getImportanceColor = (importance: MissingField['importance']) => {
    switch (importance) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'recommended':
        return 'border-yellow-200 bg-yellow-50';
      case 'optional':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getDifficultyColor = (difficulty: PriorityAction['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
    }
  };

  const getPriorityIcon = (action: PriorityAction) => {
    if (action.impactScore >= 15) return <Zap className="w-4 h-4" />;
    if (action.impactScore >= 10) return <Target className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const hasMissingData = missingData.critical.length > 0 || 
                        missingData.recommended.length > 0 || 
                        missingData.optional.length > 0;

  if (!hasMissingData) {
    return (
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <h3 className="font-semibold text-green-800">Excellent Document!</h3>
            <p className="text-green-700">Your document appears to be complete with no missing critical information.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Missing Data Analysis</h3>
            <p className="text-gray-600">Completeness Score: {missingData.overallScore}/100</p>
          </div>
          <div className={`text-3xl font-bold ${
            missingData.overallScore >= 80 ? 'text-green-600' :
            missingData.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {missingData.overallScore}%
          </div>
        </div>
      </Card>

      {/* Critical Missing Data */}
      {missingData.critical.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-800">
              Critical Missing Information ({missingData.critical.length})
            </h3>
          </div>
          <p className="text-red-700 mb-4">
            These fields are essential for a complete document and should be filled immediately.
          </p>
          <div className="space-y-3">
            {missingData.critical.map((field) => (
              <div key={field.id} className={`p-4 border rounded-lg ${getImportanceColor(field.importance)}`}>
                <div className="flex items-start space-x-3">
                  {getImportanceIcon(field.importance)}
                  <div className="flex-1">
                    <h4 className="font-medium capitalize">{field.field.replace('.', ' → ')}</h4>
                    <p className="text-sm mt-1">{field.reason}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>⏱️ {field.estimatedTime}</span>
                      <span>📊 Impact: -{field.impactOnScore} points</span>
                    </div>
                    {field.example && (
                      <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border">
                        <p className="text-sm font-medium">Example:</p>
                        <p className="text-sm">{field.example}</p>
                      </div>
                    )}
                    {field.templates && field.templates.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Templates:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {field.templates.map((template, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {template}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommended Missing Data */}
      {missingData.recommended.length > 0 && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-yellow-800">
              Recommended Information ({missingData.recommended.length})
            </h3>
          </div>
          <p className="text-yellow-700 mb-4">
            Adding these fields will significantly improve your document quality and ATS performance.
          </p>
          <div className="space-y-3">
            {missingData.recommended.map((field) => (
              <div key={field.id} className={`p-4 border rounded-lg ${getImportanceColor(field.importance)}`}>
                <div className="flex items-start space-x-3">
                  {getImportanceIcon(field.importance)}
                  <div className="flex-1">
                    <h4 className="font-medium capitalize">{field.field.replace('.', ' → ')}</h4>
                    <p className="text-sm mt-1">{field.reason}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>⏱️ {field.estimatedTime}</span>
                      <span>📊 Impact: -{field.impactOnScore} points</span>
                    </div>
                    {field.example && (
                      <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border">
                        <p className="text-sm font-medium">Example:</p>
                        <p className="text-sm">{field.example}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Priority Actions */}
      {missingData.priorityActions.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Priority Actions</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Focus on these high-impact actions to quickly improve your document.
          </p>
          <div className="space-y-3">
            {missingData.priorityActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  {getPriorityIcon(action)}
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {action.estimatedTime}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(action.difficulty)}`}>
                        {action.difficulty}
                      </span>
                      <span className="text-green-600 font-medium">
                        +{action.impactScore} points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Optional Fields */}
      {missingData.optional.length > 0 && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-blue-800">
              Optional Enhancements ({missingData.optional.length})
            </h3>
          </div>
          <p className="text-blue-700 mb-4">
            These fields can enhance your document but are not required for basic functionality.
          </p>
          <div className="space-y-3">
            {missingData.optional.map((field) => (
              <div key={field.id} className={`p-4 border rounded-lg ${getImportanceColor(field.importance)}`}>
                <div className="flex items-start space-x-3">
                  {getImportanceIcon(field.importance)}
                  <div className="flex-1">
                    <h4 className="font-medium capitalize">{field.field.replace('.', ' → ')}</h4>
                    <p className="text-sm mt-1">{field.reason}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>⏱️ {field.estimatedTime}</span>
                      <span>📊 Impact: -{field.impactOnScore} points</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}