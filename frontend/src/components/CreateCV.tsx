import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Eye, X } from "lucide-react"; // Import icons

const templates = [
  { id: 1, name: 'Deedy Resume Reversed', image: 'src/assets/cv_images/1.jpeg' },
  { id: 2, name: 'RenderCV sb2nov Theme', image: 'src/assets/cv_images/2.jpeg' },
  { id: 3, name: 'RenderCV EngineeringResumes Theme', image: 'src/assets/cv_images/3.jpeg' },
  { id: 4, name: 'Recreating Business Insiders CV of Marissa Mayer', image: 'src/assets/cv_images/4.jpeg' },
  { id: 5, name: 'Simple Hipster CV', image: 'src/assets/cv_images/5.jpeg' },
  { id: 6, name: 'Anti CV', image: 'src/assets/cv_images/6.jpeg' },
  { id: 7, name: 'Yuans Resume Template', image: 'src/assets/cv_images/7.jpeg' },
  { id: 8, name: 'MTecks Resume', image: 'src/assets/cv_images/8.jpeg' },
  { id: 9, name: 'Clean Academic CV Template', image: 'src/assets/cv_images/9.jpeg' },
  { id: 10, name: 'Academic CV Template', image: 'src/assets/cv_images/10.jpeg' },
];


const CreateCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isJobSpecific, setIsJobSpecific] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(""); // New state for additional info
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For preview popup

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
  });
  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a CV file before submitting");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const requestData = {
      jobSpecific: isJobSpecific,
      jobDescription: isJobSpecific ? jobDescription : null,
      additionalInfo: additionalInfo || null,
      selectedTemplate: selectedTemplate || null,
    };

    formData.append("data", JSON.stringify(requestData));

    // Debugging: Log the data being sent
    console.log("Submitting CV Enhancement Request:");
    console.log("File:", file.name);
    console.log("Request Data:", requestData);

    try {
      const response = await fetch("http://localhost:5000/enhance-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("CV enhancement request submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting the request");
    }
  };



  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Enhance Your CV</h1>

      {/* Upload Section */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-gray-400 rounded-lg p-8 mb-8 text-center cursor-pointer transition-all opacity-90
          ${isDragActive ? "border-pink-500 bg-pink-50" : "border-blue-600"}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {file ? (
          <p className="text-gray-600">Selected file: {file.name}</p>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-600">Drag & drop your CV here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">Supports PDF, DOC, and DOCX files</p>
          </div>
        )}
      </div>

      {/* Enhancement Options */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="jobSpecific"
            checked={isJobSpecific}
            onChange={(e) => setIsJobSpecific(e.target.checked)}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="jobSpecific" className="text-gray-700 font-medium">Job-specific enhancement</label>
        </div>

        {isJobSpecific && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-400 rounded-lg focus:border-blue-400 focus:ring-1 focus:border-blue-400"
              placeholder="Paste the job description here..."
            />
          </div>
        )}

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
            placeholder="Add any additional details about your CV enhancement needs..."
          />
        </div>

        {/* Template Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Choose a Template (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative p-4 rounded-xl border transition-all w-full shadow-md overflow-hidden
                ${selectedTemplate === template.id ? "border-blue-500 ring-4 ring-blue-300" : "border-gray-300 hover:border-blue-400"}`}
              >
                {/* <div
                  className="absolute top-3 right-3 bg-gray-800/80 p-2 rounded-full cursor-pointer hover:bg-gray-900 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(template.image);
                  }}
                >
                  <Eye className="w-5 h-5 text-white" />
                </div> */}
                <div
                  className="w-full bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: `url(${template.image})`,
                    height: "400px",
                  }}
                />
                <p className="text-sm text-gray-700 mt-3 text-center font-semibold">{template.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-bold hover:scale-105 transition-all shadow-lg"
        disabled={!file}
        onClick={handleSubmit}
      >
        Enhance CV
      </button>
    </div>
  );
};

export default CreateCV;