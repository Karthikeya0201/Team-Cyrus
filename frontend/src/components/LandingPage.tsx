import React from 'react';
import { FileText, ChevronRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Background Design */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main curved ribbon */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px]">
          <div className="absolute w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 transform rotate-12 rounded-[100px] blur-3xl"></div>
        </div>

        {/* Secondary curved ribbons */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px]">
          <div className="absolute w-full h-full bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 transform -rotate-12 rounded-[80px] blur-2xl"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-500/20 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-500/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)] opacity-50"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-xl">Builder.io</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-900">Tools</button>
          <button className="text-gray-600 hover:text-gray-900">Pricing</button>
          <button className="text-gray-600 hover:text-gray-900">FAQ's</button>
          <button className="text-indigo-600 font-medium" onClick={() => navigate('/login')}>Log In</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl font-serif tracking-tight text-gray-900 mb-6">
            Take Your Career
            <br />
            Search To The Next Level.
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Use professional field-tested resume templates that follow the exact 'resume rules'
            employers look for. Easy to use and done within minutes - try now for free!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              + Start Creating
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden w-4/5 flex flex-col">

            {/* Top Bar (Full Width) */}
            <div className="bg-[#1F2937] p-2 flex justify-end items-center gap-2 w-full">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Sidebar + Main Content Wrapper */}
            <div className="flex">
              {/* Sidebar with Background and Border */}
              <div className="w-1/6 bg-gray-100 p-6 text-black flex flex-col gap-6 border-r border-gray-300">
                <h2 className="font-semibold">Dashboard</h2>
                <nav className="flex flex-col">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-md group">
                    {/* Small Square Box */}
                    <div className="w-4 h-4 bg-gray-400 rounded-md "></div>
                    Home
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-md group ">
                    {/* Small Square Box */}
                    <div className="w-4 h-4 bg-gray-400 rounded-md "></div>
                    Projects
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-md group ">
                    {/* Small Square Box */}
                    <div className="w-4 h-4 bg-gray-400 rounded-md "></div>
                    Settings
                  </div>
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">Builder.io</span>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                    Create New
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg p-4 hover:shadow-md transition cursor-pointer backdrop-blur-sm"
                    >
                      <div className="bg-white h-40 rounded-md mb-3"></div>
                      <p className="text-sm text-gray-600">Untitled</p>
                      <p className="text-xs text-gray-400">Last modified 2 days ago</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;