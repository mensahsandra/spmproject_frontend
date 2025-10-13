import React from 'react';

const TestLecturerAssessment: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Lecturer Assessment Management - Test Page
      </h1>
      
      {/* Section 1: Course Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Section 1: Course Selection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Choose a course...</option>
              <option value="BIT364">BIT 364 - Entrepreneurship</option>
              <option value="BIT376">BIT 376 - E-learning and Learning Technology</option>
              <option value="BIT372">BIT 372 - Internet Technologies</option>
              <option value="BIT368">BIT 368 - Computer Hardware and Networks</option>
              <option value="BIT366">BIT 366 - Computer Graphics and Image Processing</option>
            </select>
          </div>
          
          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>
          
          {/* Current Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Date & Time
            </label>
            <div className="p-3 bg-gray-100 rounded-lg text-sm">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
          
          {/* Block */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="1">Block 1</option>
              <option value="2">Block 2</option>
              <option value="3">Block 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Assessment Creation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Section 2: Assessment Creation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Assessment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Type
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select type...</option>
              <option value="class">Class Assessment</option>
              <option value="mid">Mid Semester</option>
              <option value="end">End of Semester</option>
            </select>
          </div>
          
          {/* Assessment Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Format
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select format...</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="description">Description/Typing</option>
              <option value="file_upload">File Upload</option>
            </select>
          </div>
        </div>
        
        {/* Assessment Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Title
          </label>
          <input 
            type="text" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter assessment title..."
          />
        </div>
        
        {/* Create Assessment Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
          Create Assessment
        </button>
        
        {/* Student Submissions Log */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Student Submissions</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-center">No submissions yet</p>
          </div>
        </div>
      </div>

      {/* Section 3: Student Management & Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Section 3: Student Performance Log
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Student ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Class Assessment</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Mid Semester</th>
                <th className="border border-gray-300 px-4 py-2 text-left">End of Semester</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample Data */}
              <tr>
                <td className="border border-gray-300 px-4 py-2">STU001</td>
                <td className="border border-gray-300 px-4 py-2">John Doe</td>
                <td className="border border-gray-300 px-4 py-2">85</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">STU002</td>
                <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
                <td className="border border-gray-300 px-4 py-2">92</td>
                <td className="border border-gray-300 px-4 py-2">78</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">STU003</td>
                <td className="border border-gray-300 px-4 py-2">Bob Johnson</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestLecturerAssessment;