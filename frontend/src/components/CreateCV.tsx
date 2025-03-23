import React, { useState } from "react";
import { Plus } from "lucide-react";

const CreateCV: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    summaryAndGithub: "",
    technicalSkills: "",
    softSkills: "",
    languages: "",
    projects: [{ name: "", description: "", techStack: "", githubLink: "" }],
    workExperience: [{ role: "", company: "", duration: "", description: "" }],
    education: [{ degree: "", institution: "", graduationYear: "" }],
    achievements: "",
    volunteering: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    field?: keyof (typeof formData)["education"][number] | keyof (typeof formData)["projects"][number] | keyof (typeof formData)["workExperience"][number],
    section?: "education" | "projects" | "workExperience"
  ) => {
    if (section && index !== undefined && field) {
      const updatedSection = [...formData[section]];
      (updatedSection[index] as any)[field] = e.target.value;
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addField = (section: "education" | "projects" | "workExperience", newField: any) => {
    setFormData({ ...formData, [section]: [...formData[section], newField] });
  };

  const inputClass = "border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-black-600 mb-6 text-center">Create Your CV</h2>

      {/* Personal Information */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" onChange={handleChange} className={inputClass} />
          <input name="email" placeholder="Email" onChange={handleChange} className={inputClass} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} className={inputClass} />
          <input name="linkedin" placeholder="LinkedIn Profile" onChange={handleChange} className={inputClass} />
        </div>
      </section>

      {/* Professional Summary & GitHub */}
      <section className="mt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Professional Summary & GitHub</h3>
        <textarea name="summaryAndGithub" placeholder="AI-generated summary and GitHub profile" onChange={handleChange} className={inputClass} />
      </section>

      {/* Skills */}
      <section className="mt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Skills</h3>
        <textarea name="technicalSkills" placeholder="Technical Skills" onChange={handleChange} className={inputClass} />
        <textarea name="softSkills" placeholder="Soft Skills" onChange={handleChange} className={inputClass} />
        <textarea name="languages" placeholder="Languages" onChange={handleChange} className={inputClass} />
      </section>

      {/* Education */}
      <section className="mt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="flex flex-col gap-2 border p-4 rounded-lg shadow-sm mb-2">
            <input placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(e, index, "degree", "education")} className={inputClass} />
            <input placeholder="Institution" value={edu.institution} onChange={(e) => handleChange(e, index, "institution", "education")} className={inputClass} />
            <input placeholder="Year of Graduation" value={edu.graduationYear} onChange={(e) => handleChange(e, index, "graduationYear", "education")} className={inputClass} />
          </div>
        ))}
        <button onClick={() => addField("education", { degree: "", institution: "", graduationYear: "" })} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2">
          <Plus size={20} /> Add Education
        </button>
      </section>

      <section className="mt-4">
  <h3 className="text-xl font-semibold text-gray-700 mb-2">Projects</h3>
  {formData.projects.map((proj, index) => (
    <div key={index} className="flex flex-col gap-2 border p-4 rounded-lg shadow-sm mb-2">
      <input
        placeholder="Project Details (Name, Description, Tech Stack, GitHub Link)"
        value={proj.name}
        onChange={(e) => handleChange(e, index, "name", "projects")}
        className={inputClass}
      />
    </div>
  ))}
  <button
    onClick={() => addField("projects", { name: "" })}
    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2"
  >
    <Plus size={20} /> Add Project
  </button>
</section>

{/* Work Experience */}
<section className="mt-4">
  <h3 className="text-xl font-semibold text-gray-700 mb-2">Work Experience</h3>
  {formData.workExperience.map((exp, index) => (
    <div key={index} className="flex flex-col gap-2 border p-4 rounded-lg shadow-sm mb-2">
      <input
        placeholder="Work Experience (Role, Company, Duration, Description)"
        value={exp.role}
        onChange={(e) => handleChange(e, index, "role", "workExperience")}
        className={inputClass}
      />
    </div>
  ))}
  <button
    onClick={() => addField("workExperience", { role: "" })}
    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2"
  >
    <Plus size={20} /> Add Work Experience
  </button>
</section>      {/* Achievements */}
      <section className="mt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Achievements & Awards</h3>
        <textarea name="achievements" placeholder="Hackathons, Competitions, Scholarships" onChange={handleChange} className={inputClass} />
      </section>

      {/* Submit Button */}
      <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
        Generate CV
      </button>
    </div>
  );
};

export default CreateCV;