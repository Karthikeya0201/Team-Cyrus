import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js'; // Import html2pdf for PDF generation
import { FaUser, FaGlobe } from 'react-icons/fa'; // Add this import at the top

interface JobExperience {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
  location?: string;
  jobType?: string;
}

interface ResumeData {
  basicDetails: {
    name: string;
    title: string;
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  // ... rest of the interfaces
}

const ResumeBuilder = () => {
  // Initial resume data with structure matching the example
  const [resumeData, setResumeData] = useState({
    basicDetails: {
      name: 'John Doe',
      title: 'Senior Frontend Developer',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
    },
    skills: [
      'Frontend Development',
      'React.js',
      'TypeScript',
      'UI/UX Design',
      'Responsive Design',
      'Performance Optimization'
    ],
    summary: 'Results-driven Senior Frontend Developer with 8+ years of experience building scalable web applications. Specialized in React.js and modern JavaScript. Passionate about creating intuitive user interfaces and optimizing web performance.',
    objective: 'Seeking a challenging position as a Lead Frontend Developer where I can leverage my expertise in React.js and modern web technologies to build innovative user experiences and mentor junior developers.',
    education: [
      {
        degree: 'Master of Computer Science',
        institution: 'Stanford University',
        duration: '2015 - 2017',
      },
      {
        degree: 'Bachelor of Computer Science',
        institution: 'University of California, Berkeley',
        duration: '2011 - 2015',
      },
    ],
    experience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Frontend Developer',
        duration: '2020 - Present',
        responsibilities: [
          'Lead a team of 5 frontend developers in developing and maintaining enterprise-scale React applications',
          'Implemented micro-frontend architecture resulting in 40% faster deployment cycles',
          'Established frontend testing protocols increasing code coverage from 65% to 95%',
          'Mentored junior developers and conducted technical interviews',
        ],
      },
      {
        company: 'Digital Innovations Corp',
        position: 'Frontend Developer',
        duration: '2017 - 2020',
        responsibilities: [
          'Developed responsive web applications using React.js and Redux',
          'Reduced application bundle size by 60% through code splitting and lazy loading',
          'Collaborated with UX designers to implement pixel-perfect interfaces',
          'Integrated REST APIs and implemented real-time features using WebSocket',
        ],
      },
    ],
    activities: [
      'Tech Conference Speaker',
      'Open Source Contributor',
      'Tech Blog Author',
      'Local JavaScript Meetup Organizer'
    ],
    languages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Python'],
    technologies: ['REST APIs', 'GraphQL', 'WebSocket', 'Webpack', 'Docker'],
    frameworks: ['React.js', 'Next.js', 'Redux', 'Material-UI', 'Tailwind CSS'],
    tools: ['Git', 'VS Code', 'Jira', 'Figma', 'Chrome DevTools', 'Jest'],
    volunteering: [
      {
        organization: 'Code for Community',
        position: 'Technical Mentor',
        duration: '2019 - Present',
        description: 'Mentor underprivileged students in web development technologies and career guidance',
      },
    ],
    awards: [
      {
        title: 'Outstanding Technical Leadership',
        issuer: 'Tech Solutions Inc.',
        date: 'Dec 2022',
        description: 'Recognized for exceptional leadership in frontend architecture and team mentoring',
      },
      {
        title: 'Best Frontend Innovation',
        issuer: 'Web Dev Conference 2021',
        date: 'Sept 2021',
        description: 'Award for developing an innovative micro-frontend architecture solution',
      },
    ],
  });

  // Current section being edited
  const [activeSection, setActiveSection] = useState('basicDetails');
  const resumeRef = useRef(); // Ref to capture the resume preview for PDF generation

  // First, add a new state for template selection
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  // Add new state for managing subsection visibility
  const [expandedSubsections, setExpandedSubsections] = useState<{ [key: string]: boolean }>({});

  // Add template options
  const templates = {
    modern: {
      sections: [
        {
          id: 'personal',
          label: 'Personal Information',
          subsections: ['basicDetails', 'summary', 'objective']
        },
        {
          id: 'expertise',
          label: 'Expertise',
          subsections: ['skills', 'languages', 'technologies', 'frameworks', 'tools']
        },
        {
          id: 'experience',
          label: 'Professional Experience',
          subsections: ['experience', 'education']
        },
        {
          id: 'achievements',
          label: 'Achievements',
          subsections: ['awards', 'volunteering', 'activities']
        }
      ]
    },
    'modern-alt': {
      sections: [
        {
          id: 'header',
          label: 'Header Information',
          subsections: ['basicDetails', 'profileImage']
        },
        {
          id: 'professional-summary',
          label: 'Professional Summary',
          subsections: ['summary', 'objective', 'highlights']
        },
        {
          id: 'core-competencies',
          label: 'Core Competencies',
          subsections: [
            'technicalSkills',
            'softSkills',
            'certifications',
            'languages'
          ]
        },
        {
          id: 'professional-journey',
          label: 'Professional Journey',
          subsections: ['workHistory', 'projects', 'achievements']
        },
        {
          id: 'education-training',
          label: 'Education & Training',
          subsections: ['education', 'certifications', 'workshops']
        },
        {
          id: 'additional-info',
          label: 'Additional Information',
          subsections: ['volunteering', 'publications', 'conferences']
        }
      ],
      layout: 'sidebar', // New property for layout variation
      colors: {
        primary: '#2563eb',
        secondary: '#475569',
        accent: '#f97316'
      }
    }
  };

  // Handle input changes for basic details
  const handleBasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      basicDetails: {
        ...resumeData.basicDetails,
        [name]: value,
      },
    });
  };

  // Handle text area changes for summary and objective
  const handleTextAreaChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      [name]: value,
    });
  };

  // Handle array input (skills, activities)
  const handleArrayInput = (e, section) => {
    const { value } = e.target;
    const items = value.split(',').map((item) => item.trim()).filter((item) => item !== '');
    setResumeData({
      ...resumeData,
      [section]: items,
    });
  };

  // Add new education entry
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { degree: '', institution: '', duration: '' }],
    });
  };

  // Update education entry
  const updateEducation = (index, field, value) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    });
  };

  // Remove education entry
  const removeEducation = (index) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { company: '', position: '', duration: '', responsibilities: [''] },
      ],
    });
  };

  // Add new handler for adding job experience
  const addJobExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          company: '',
          position: '',
          duration: '',
          responsibilities: [''],
          location: '', // New field
          jobType: 'Full-time', // New field
        }
      ]
    });
  };

  // Update experience entry
  const updateExperience = (index, field, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    });
  };

  // Update responsibility
  const updateResponsibility = (expIndex, respIndex, value) => {
    const updatedExperience = [...resumeData.experience];
    const updatedResponsibilities = [...updatedExperience[expIndex].responsibilities];
    updatedResponsibilities[respIndex] = value;
    updatedExperience[expIndex].responsibilities = updatedResponsibilities;
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    });
  };

  // Add responsibility
  const addResponsibility = (expIndex) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].responsibilities.push('');
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    });
  };

  // Remove responsibility
  const removeResponsibility = (expIndex, respIndex) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].responsibilities.splice(respIndex, 1);
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    });
  };

  // Remove experience entry
  const removeExperience = (index) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience.splice(index, 1);
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    });
  };

  // Add new volunteering entry
  const addVolunteering = () => {
    setResumeData({
      ...resumeData,
      volunteering: [
        ...resumeData.volunteering,
        { organization: '', position: '', duration: '', description: '' },
      ],
    });
  };

  // Update volunteering entry
  const updateVolunteering = (index, field, value) => {
    const updatedVolunteering = [...resumeData.volunteering];
    updatedVolunteering[index] = {
      ...updatedVolunteering[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      volunteering: updatedVolunteering,
    });
  };

  // Remove volunteering entry
  const removeVolunteering = (index) => {
    const updatedVolunteering = [...resumeData.volunteering];
    updatedVolunteering.splice(index, 1);
    setResumeData({
      ...resumeData,
      volunteering: updatedVolunteering,
    });
  };

  // Add new award entry
  const addAward = () => {
    setResumeData({
      ...resumeData,
      awards: [...resumeData.awards, { title: '', issuer: '', date: '', description: '' }],
    });
  };

  // Update award entry
  const updateAward = (index, field, value) => {
    const updatedAwards = [...resumeData.awards];
    updatedAwards[index] = {
      ...updatedAwards[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      awards: updatedAwards,
    });
  };

  // Remove award entry
  const removeAward = (index) => {
    const updatedAwards = [...resumeData.awards];
    updatedAwards.splice(index, 1);
    setResumeData({
      ...resumeData,
      awards: updatedAwards,
    });
  };

  // Handle download as PDF
  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  // Reset all edits
  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all edits? This cannot be undone.')) {
      window.location.reload();
    }
  };

  // Add handlers for subsection controls
  const handleSubsectionToggle = (sectionId: string, subsection: string) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [`${sectionId}_${subsection}`]: !prev[`${sectionId}_${subsection}`]
    }));
  };

  // Render section editor based on active section
  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'basicDetails':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={resumeData.basicDetails.name}
                onChange={handleBasicDetailsChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={resumeData.basicDetails.title}
                onChange={handleBasicDetailsChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={resumeData.basicDetails.phone}
                onChange={handleBasicDetailsChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={resumeData.basicDetails.email}
                onChange={handleBasicDetailsChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={resumeData.basicDetails.location}
                onChange={handleBasicDetailsChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Website</label>
              <input
                type="text"
                name="website"
                value={resumeData.basicDetails.website}
                onChange={handleBasicDetailsChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        );
      case 'skillsExpertise':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Skills and Expertise</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">Languages</label>
              <input
                type="text"
                value={resumeData.languages.join(', ')}
                onChange={(e) => handleArrayInput(e, 'languages')}
                className="w-full border p-2 rounded"
                placeholder="Separate by commas (e.g. JavaScript, HTML5, CSS)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Technologies</label>
              <input
                type="text"
                value={resumeData.technologies.join(', ')}
                onChange={(e) => handleArrayInput(e, 'technologies')}
                className="w-full border p-2 rounded"
                placeholder="Separate by commas (e.g. Algorithms, SQL, Data Structures)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Frameworks & Libraries</label>
              <input
                type="text"
                value={resumeData.frameworks.join(', ')}
                onChange={(e) => handleArrayInput(e, 'frameworks')}
                className="w-full border p-2 rounded"
                placeholder="Separate by commas (e.g. React, Angular, jQuery)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Tools</label>
              <input
                type="text"
                value={resumeData.tools.join(', ')}
                onChange={(e) => handleArrayInput(e, 'tools')}
                className="w-full border p-2 rounded"
                placeholder="Separate by commas (e.g. Git, VS Code, Jira)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Skills</label>
              <input
                type="text"
                value={resumeData.skills.join(', ')}
                onChange={(e) => handleArrayInput(e, 'skills')}
                className="w-full border p-2 rounded"
                placeholder="Separate by commas (e.g. UI/UX Design, Responsive Design)"
              />
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-6 p-3 border rounded">
                <div className="mb-2">
                  <label className="block text-sm mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Duration</label>
                  <input
                    type="text"
                    value={edu.duration}
                    onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Jan 2020 - Jan 2024"
                  />
                </div>
                <button
                  className="text-red-500 text-sm mt-2"
                  onClick={() => removeEducation(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={addEducation}
            >
              Add Education
            </button>
          </div>
        );
      case 'experience':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Professional Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-6 p-3 border rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label className="block text-sm mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm mb-1">Job Type</label>
                    <select
                      value={exp.jobType}
                      onChange={(e) => updateExperience(index, 'jobType', e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm mb-1">Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder="Apr 2021 - present"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm mb-1">Responsibilities</label>
                    {exp.responsibilities.map((resp, respIndex) => (
                      <div key={respIndex} className="flex mb-2">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) =>
                            updateResponsibility(index, respIndex, e.target.value)
                          }
                          className="flex-grow border p-2 rounded mr-2"
                        />
                        <button
                          className="text-red-500 px-2"
                          onClick={() => removeResponsibility(index, respIndex)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      className="text-blue-500 text-sm"
                      onClick={() => addResponsibility(index)}
                    >
                      + Add Responsibility
                    </button>
                  </div>
                </div>
                <button
                  className="text-red-500 text-sm mt-2"
                  onClick={() => removeExperience(index)}
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={addJobExperience}
            >
              Add Job Experience
            </button>
          </div>
        );
      case 'activities':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Activities</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">List your activities</label>
              <input
                type="text"
                value={resumeData.activities.join(', ')}
                onChange={(e) => handleArrayInput(e, 'activities')}
                className="w-full border p-2 rounded"
                placeholder="Separate by commas (e.g. Technical Blog Writing, Open Source Contribution)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate activities with commas</p>
            </div>
          </div>
        );
      case 'volunteering':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Volunteering</h2>
            {resumeData.volunteering.map((vol, index) => (
              <div key={index} className="mb-6 p-3 border rounded">
                <div className="mb-2">
                  <label className="block text-sm mb-1">Organization</label>
                  <input
                    type="text"
                    value={vol.organization}
                    onChange={(e) =>
                      updateVolunteering(index, 'organization', e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Position</label>
                  <input
                    type="text"
                    value={vol.position}
                    onChange={(e) => updateVolunteering(index, 'position', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Duration</label>
                  <input
                    type="text"
                    value={vol.duration}
                    onChange={(e) => updateVolunteering(index, 'duration', e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Jan 2021 - Jan 2022"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Description</label>
                  <input
                    type="text"
                    value={vol.description}
                    onChange={(e) =>
                      updateVolunteering(index, 'description', e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <button
                  className="text-red-500 text-sm mt-2"
                  onClick={() => removeVolunteering(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={addVolunteering}
            >
              Add Volunteering
            </button>
          </div>
        );
      case 'awards':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Awards</h2>
            {resumeData.awards.map((award, index) => (
              <div key={index} className="mb-6 p-3 border rounded">
                <div className="mb-2">
                  <label className="block text-sm mb-1">Title</label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => updateAward(index, 'title', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Issuer</label>
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={(e) => updateAward(index, 'issuer', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Date</label>
                  <input
                    type="text"
                    value={award.date}
                    onChange={(e) => updateAward(index, 'date', e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Nov 2022"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Description</label>
                  <input
                    type="text"
                    value={award.description}
                    onChange={(e) => updateAward(index, 'description', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <button
                  className="text-red-500 text-sm mt-2"
                  onClick={() => removeAward(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addAward}>
              Add Award
            </button>
          </div>
        );
      case 'summary':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <textarea
              name="summary"
              value={resumeData.summary}
              onChange={handleTextAreaChange}
              className="w-full border p-2 rounded h-32"
              placeholder="Write a brief summary of your professional background and expertise"
            />
          </div>
        );
      case 'objective':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Objective</h2>
            <textarea
              name="objective"
              value={resumeData.objective}
              onChange={handleTextAreaChange}
              className="w-full border p-2 rounded h-32"
              placeholder="Write a clear statement about your career objectives"
            />
          </div>
        );
      case 'expertise': 
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Expertise & Skills</h2>
            {templates[selectedTemplate].sections
              .find(s => s.id === 'expertise')
              ?.subsections.map((subsection) => (
                <div key={subsection} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {subsection.charAt(0).toUpperCase() + subsection.slice(1)}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSubsectionToggle('expertise', subsection)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {expandedSubsections[`expertise_${subsection}`] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {expandedSubsections[`expertise_${subsection}`] && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={resumeData[subsection].join(', ')}
                        onChange={(e) => handleArrayInput(e, subsection)}
                        className="w-full border p-2 rounded"
                        placeholder={`Add ${subsection}...`}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        );
      default:
        return (
          <div className="p-4">
            <p>Select a section to edit from the sidebar.</p>
          </div>
        );
    }
  };

  // Resume preview component
  const ResumePreview = () => (
    <div ref={resumeRef} className="bg-white shadow-lg p-8 mx-auto max-w-4xl">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{resumeData.basicDetails.name}</h1>
          <p className="text-xl text-blue-600 mb-3">{resumeData.basicDetails.title}</p>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-4">{resumeData.basicDetails.phone}</span>
            <span className="mr-4">{resumeData.basicDetails.email}</span>
            <span>{resumeData.basicDetails.location}</span>
          </p>
          <p className="text-sm text-gray-600">
            <a href={resumeData.basicDetails.website} 
               className="text-blue-600 hover:text-blue-800 flex items-center">
              <FaGlobe className="mr-1" />
              {resumeData.basicDetails.website}
            </a>
          </p>
        </div>
        <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden">
          <FaUser className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2 uppercase">Summary</h2>
          <p className="text-sm">{resumeData.summary}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold border-b pb-1 mb-2 uppercase">Objective</h2>
          <p className="text-sm">{resumeData.objective}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-4 uppercase">Experience</h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{exp.company}</h3>
              <span className="text-sm text-gray-600">{exp.duration}</span>
            </div>
            <p className="text-blue-500">{exp.position}</p>
            <ul className="list-disc ml-5 text-sm mt-2">
              {exp.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2 uppercase">Languages</h2>
        <div className="flex flex-wrap">
          {resumeData.languages.map((lang, index) => (
            <span key={index} className="bg-gray-200 rounded px-2 py-1 text-sm mr-2 mb-2">
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2 uppercase">Technologies</h2>
        <div className="flex flex-wrap">
          {resumeData.technologies.map((tech, index) => (
            <span key={index} className="bg-gray-200 rounded px-2 py-1 text-sm mr-2 mb-2">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2 uppercase">
          Frameworks & Libraries
        </h2>
        <div className="flex flex-wrap">
          {resumeData.frameworks.map((framework, index) => (
            <span key={index} className="bg-gray-200 rounded px-2 py-1 text-sm mr-2 mb-2">
              {framework}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2 uppercase">Tools</h2>
        <div className="flex flex-wrap">
          {resumeData.tools.map((tool, index) => (
            <span key={index} className="bg-gray-200 rounded px-2 py-1 text-sm mr-2 mb-2">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-4 uppercase">Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{edu.degree}</h3>
              <span className="text-sm text-gray-600">{edu.duration}</span>
            </div>
            <p className="text-sm">{edu.institution}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-2 uppercase">Activities</h2>
        <ul className="list-disc ml-5 text-sm">
          {resumeData.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-4 uppercase">Volunteering</h2>
        {resumeData.volunteering.map((vol, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{vol.organization}</h3>
              <span className="text-sm text-gray-600">{vol.duration}</span>
            </div>
            <p className="text-blue-500">{vol.position}</p>
            <p className="text-sm mt-1">{vol.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b pb-1 mb-4 uppercase">Awards</h2>
        {resumeData.awards.map((award, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{award.title}</h3>
              <span className="text-sm text-gray-600">{award.date}</span>
            </div>
            <p className="text-sm">{award.issuer}</p>
            <p className="text-sm mt-1">{award.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-6">
          {/* Live Preview on the Left */}
          <div className="w-2/3 bg-white shadow-sm p-4 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4 text-center">Live Preview</h2>
            <ResumePreview />
          </div>

          {/* Editor on the Right */}
          <div className="w-1/3 flex flex-col">
            {/* Sidebar */}
            <div className="bg-white shadow-sm p-4 mb-4">
              {/* Template Selection Dropdown */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Template</h2>
                <div className="relative">
                  <button 
                    onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                    className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 rounded border"
                  >
                    {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isTemplateMenuOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
                      {Object.keys(templates).map((template) => (
                        <button
                          key={template}
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsTemplateMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          {template.charAt(0).toUpperCase() + template.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sections with Subsections */}
              <h2 className="text-lg font-semibold mb-4">Sections</h2>
              <nav className="space-y-2">
                {templates[selectedTemplate].sections.map((section) => (
                  <div key={section.id} className="border rounded">
                    <button
                      className="w-full flex justify-between items-center p-3 hover:bg-gray-50"
                      onClick={() => {
                        setActiveSection(section.id === activeSection ? '' : section.id);
                      }}
                    >
                      {section.label}
                      <svg
                        className={`w-4 h-4 transform ${
                          activeSection === section.id ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {activeSection === section.id && (
                      <div className="border-t bg-gray-50">
                        {section.subsections.map((subsection) => (
                          <button
                            key={subsection}
                            onClick={() => setActiveSection(subsection)}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              activeSection === subsection
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {subsection.charAt(0).toUpperCase() + subsection.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Editor Section */}
            <div className="bg-white shadow-sm p-4 flex-1 overflow-y-auto max-h-[60vh]">
              {renderSectionEditor()}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleResetAll}
              >
                Reset All
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;