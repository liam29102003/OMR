import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";


const SetupAnswerKey = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [examDetails, setExamDetails] = useState({
    examCode: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({
    examCode: '',
    answers: ''
  });

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
    
    // Clear answer
    if (errors.answers) {
      setErrors({
        ...errors,
        answers: ''
      });
    }
  };

  const handleExamDetailChange = (e) => {
    const { name, value } = e.target;
    setExamDetails({
      ...examDetails,
      [name]: value
    });
    
    if (name === 'examCode' && errors.examCode) {
      setErrors({
        ...errors,
        examCode: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      examCode: '',
      answers: ''
    };
    
    let isValid = true;
    
    // Validate exam code
    if (!examDetails.examCode.trim()) {
      newErrors.examCode = 'Exam code is required';
      isValid = false;
    }
    
    // Validate that all questions are answered
    const unansweredQuestions = answers.filter(answer => answer === null).length;
    if (unansweredQuestions > 0) {
      newErrors.answers = `Please answer all ${unansweredQuestions} remaining questions`;
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
  if (answers.some(a => a === null)) {
    alert("Please answer all questions before saving!");
    return;
  }

  const answerKeyData = {
    answers: answers  // [0,1,2,...]
  };

  try {
    const response = await fetch("http://localhost:8000/set-answer-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answerKeyData),
      credentials: 'include'
    });

    if (!response.ok) throw new Error("Failed to save answer key");

    const data = await response.json();
    console.log("Saved:", data);
    alert(`Answer key saved successfully! Exam Code: ${data.exam_code}`);
    navigate("/scanner");

  } catch (error) {
    console.error("Error:", error);
    alert("Error saving answer key: " + error.message);
  }
};


  const handleReset = () => {
    // Reset all answers to null
    setAnswers(Array(10).fill(null));
    
    // Reset exam code but keep the date
    setExamDetails({
      examCode: '',
      date: examDetails.date
    });
    
    // Clear all errors
    setErrors({
      examCode: '',
      answers: ''
    });
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="absolute top-10 left-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E97B58] text-white shadow hover:bg-[#d96b4e] transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E97B58]">Setup Answer Key</h1>
          <p className="text-gray-600 mt-2">Define the correct answers for your OMR sheet</p>
        </div>

        {/* OMR Sheet Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">OMR Answer Sheet</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={examDetails.date}
                  onChange={handleExamDetailChange}
                  className="h-10 border-2 border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-[#E97B58] focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Exam Code *</label>
                <input
                  type="text"
                  name="examCode"
                  value={examDetails.examCode}
                  onChange={handleExamDetailChange}
                  placeholder="Enter exam code"
                  className={`h-10 border-2 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-[#E97B58] focus:border-transparent ${
                    errors.examCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.examCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.examCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="mb-4">
            {errors.answers && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.answers}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-5 gap-4">
              {answers.map((answer, questionIndex) => (
                <div key={questionIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-center font-medium text-gray-700 mb-3">Q{questionIndex + 1}</div>
                  <div className="space-y-2">
                    {optionLetters.map((letter, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`flex items-center justify-center h-8 w-8 rounded-full border-2 cursor-pointer transition-all ${
                          answer === optionIndex
                            ? 'bg-[#E97B58] border-[#E97B58] text-white'
                            : 'border-gray-300 hover:border-[#E97B58]'
                        }`}
                        onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex justify-between items-center border-t pt-4">
            <div className="text-sm text-gray-600">
              {answers.filter(a => a !== null).length} of {answers.length} questions answered
            </div>
            <div className="flex items-center">
              <div className={`h-3 rounded-full bg-gray-200 w-32 mr-2`}>
                <div 
                  className="h-3 rounded-full bg-[#E97B58]" 
                  style={{ width: `${(answers.filter(a => a !== null).length / answers.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {Math.round((answers.filter(a => a !== null).length / answers.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E97B58] transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={answers.filter(a => a !== null).length === 0 || !examDetails.examCode}
              className="px-6 py-2 bg-[#E97B58] text-white rounded-md hover:bg-[#d86a47] focus:outline-none focus:ring-2 focus:ring-[#E97B58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupAnswerKey;