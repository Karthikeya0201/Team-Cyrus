import React from 'react';
import ATSAnalysisForm from './ATSAnalysisForm';

const ATSScore: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ATS Score Analysis</h1>
            <p className="mt-2 text-gray-600">
              Analyze your resume against job descriptions to improve your chances
            </p>
          </div>
        </div>
        <ATSAnalysisForm />
      </div>
    </div>
  );
};

export default ATSScore;