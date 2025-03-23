import { Link } from 'react-router-dom';
import { SparklesIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import image1 from '../assets/cv_images/1.jpeg';
import image2 from '../assets/cv_images/8.jpeg';
import image3 from '../assets/cv_images/3.jpeg';
import image4 from '../assets/cv_images/4.jpeg';

const templates = [
  {
    id: 1,
    name: 'Professional',
    bgColor: 'bg-blue-100',
    image: image1 // Replace with actual image path
  },
  {
    id: 2,
    name: 'Simple',
    bgColor: 'bg-green-100',
    image: image2,
  },
  {
    id: 3,
    name: 'Creative',
    bgColor: 'bg-yellow-100',
    image: image3,
  },
  {
    id: 4,
    name: 'Elegant',
    bgColor: 'bg-purple-100',
    image: image4,
  },
];

export default function Dashboard() {
  return (
    <div className="p-4 max-w-6xl mx-4">
      <div className="mb-5 flex justify-between items-center">
  <div>
    <h1 className="text-4xl font-bold text-gray-900 mb-2">Hey there, John!</h1>
    <p className="text-xl text-gray-600">What would you like to create today?</p>
  </div>
  <a
    href="/ats-score"
    className="px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 w-40 text-center"
  >
    ATS Score
  </a>
</div>



      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Templates</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {templates.map((template) => (
            <div key={template.id} className="flex flex-col items-center">
              {/* Template Box with Image */}
              <div
                className={`rounded-l overflow-hidden shadow-lg ${template.bgColor} p-3 flex justify-center items-center h-full w-full`}
              >
                <img src={template.image} alt={template.name} className="w-full h-full object-cover rounded-md p-3 " />
              </div>

              {/* Template Name */}
              <h3 className="text-lg font-bold mt-3">{template.name}</h3>

              {/* Use Template Button */}
              <Link to="/create-resume" className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-1">
                Use Template →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/enhance-resume" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Enhance Resume</h2>
          <p className="text-gray-600 text-center">Improve your existing resume with AI-powered suggestions</p>
        </Link>

        <Link to="/create-resume" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <DocumentPlusIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Create New Resume</h2>
          <p className="text-gray-600 text-center">Build a professional resume from scratch using our templates</p>
        </Link>
      </div>
    </div>
  );
}