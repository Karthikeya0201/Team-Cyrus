import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Upload, FileText, BarChart2 } from 'lucide-react';
import config from '../config';
import React from 'react';

// Define TypeScript interfaces
interface MatchingScore {
  overall_match: number;
  skill_match: number;
  experience_match: number;
  score_breakdown: Array<{
    skill: string;
    match: number;
  }>;
  missing_skills: string[];
  experience_gap: string;
  match_analysis: string;
}

interface CircularProgressProps {
  percentage: number;
  color: string;
  label: string;
  animateCircles: boolean;
  animationKey: string | number;
}

interface SkillMatchBarProps {
  skill: string;
  match: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, color, label, animateCircles, animationKey }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-24 h-24">
      <svg key={animationKey} className="w-24 h-24 transform -rotate-90">
        <circle cx="48" cy="48" r="45" fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx="48" cy="48" r="45" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={2 * Math.PI * 45}
          strokeDashoffset={
            animateCircles
              ? (2 * Math.PI * 45) - (2 * Math.PI * 45 * percentage) / 100
              : 2 * Math.PI * 45
          }
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
    <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
  </div>
);

const SkillMatchBar: React.FC<SkillMatchBarProps> = ({ skill, match }) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{skill}</span>
      <span className="text-sm font-medium text-gray-700">{match}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${match}%` }}
      ></div>
    </div>
  </div>
);

const ATSAnalysisForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [matchingScore, setMatchingScore] = useState<MatchingScore | null>(null);
  const [animateCircles, setAnimateCircles] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (matchingScore) {
      setAnimationKey(prev => prev + 1);
      setAnimateCircles(false);
      setTimeout(() => setAnimateCircles(true), 50);
    }
  }, [matchingScore]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a resume');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.resume.ats}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze resume');
      }
      
      const data = await response.json();
      setMatchingScore(data as MatchingScore);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setJobDescription('');
    setMatchingScore(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-8 border-b border-gray-200">
        <div className="grid grid-cols-1 gap-8">
          {!matchingScore ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Resume
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 
                            transition-colors duration-200 ease-in-out
                            hover:border-gray-400 focus:border-gray-400"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  {file ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mx-auto flex items-center space-x-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2.5 text-base font-medium rounded-md"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Select Resume</span>
                      </Button>
                      <p className="mt-2 text-sm text-gray-500">
                        Supported formats: PDF, DOC, DOCX
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  rows={8}
                  className="w-full rounded-xl border-gray-300 shadow-sm 
                           focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Paste the job description here..."
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 
                         text-white rounded-lg py-3 font-bold hover:scale-105 
                         transition-all shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <BarChart2 className="w-5 h-5" />
                    <span>Analyze Resume</span>
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Match Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CircularProgress
                  percentage={matchingScore.overall_match}
                  color="#3B82F6"
                  label="Overall Match"
                  animateCircles={animateCircles}
                  animationKey={animationKey}
                />
                <CircularProgress
                  percentage={matchingScore.skill_match}
                  color="#10B981"
                  label="Skills Match"
                  animateCircles={animateCircles}
                  animationKey={`${animationKey}_skill`}
                />
                <CircularProgress
                  percentage={matchingScore.experience_match}
                  color="#8B5CF6"
                  label="Experience Match"
                  animateCircles={animateCircles}
                  animationKey={`${animationKey}_exp`}
                />
              </div>

              {/* Match Analysis */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Match Analysis</h3>
                <p className="text-gray-700">{matchingScore.match_analysis}</p>
              </div>

              {/* Skill Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Breakdown</h3>
                <div className="space-y-1">
                  {matchingScore.score_breakdown.map((item, index) => (
                    <SkillMatchBar 
                      key={index} 
                      skill={item.skill} 
                      match={item.match} 
                    />
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {matchingScore.missing_skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Missing Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {matchingScore.missing_skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Gap */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience Gap</h3>
                <p className="text-gray-700">{matchingScore.experience_gap}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2.5 text-base font-medium rounded-md"
                >
                  Analyze Another Resume
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1 bg-black text-white hover:bg-gray-800 py-2.5 text-base font-medium rounded-md"
                >
                  Print Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSAnalysisForm;