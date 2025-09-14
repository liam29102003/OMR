import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";


const Result = () => {
  const navigate = useNavigate();  
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const detailBoxRef = useRef(null);


  useEffect(() => {
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          rollNumber: '4SE-1461',
          date: '2025-08-15',
          examCode: 'CST-8117',
          score: 80,
          totalQuestions: 10,
          correctAnswers: 8,
          status: 'Passed'
        },
        {
          id: 2,
          rollNumber: '4SE-1462',
          date: '2025-08-15',
          examCode: 'CST-8117',
          score: 90,
          totalQuestions: 10,
          correctAnswers: 9,
          status: 'Passed'
        },
        {
          id: 3,
          rollNumber: '4SE-1461',
          date: '2025-08-15',
          examCode: 'CST-8117',
          score: 40,
          totalQuestions: 10,
          correctAnswers: 4,
          status: 'Failed'
        }
      ];
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Close detail box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailBoxRef.current && !detailBoxRef.current.contains(event.target)) {
        if (!event.target.closest('.view-detail-button')) {
          setSelectedResult(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleViewDetails = (result, event) => {
    event.stopPropagation();
    setSelectedResult(selectedResult && selectedResult.id === result.id ? null : result);
  };

  const handleExport = (format) => {
    alert(`Exporting results in ${format} format`);
  };

  const confirmDelete = (id) => {
    setDeleteTarget(id);
  };

  const handleDeleteConfirmed = () => {
    if (deleteTarget !== null) {
      setResults(results.filter(result => result.id !== deleteTarget));
      if (selectedResult && selectedResult.id === deleteTarget) {
        setSelectedResult(null);
      }
      setDeleteTarget(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Passed': return 'text-green-600 bg-green-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E97B58] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E97B58]">OMR Evaluation Results</h1>
          <p className="text-gray-600 mt-2">View and manage scanned OMR sheet results</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => handleExport('CSV')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E97B58] transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <Link
              to="/scanner"
              className="px-4 py-2 bg-[#E97B58] text-white rounded-md hover:bg-[#d86a47] focus:outline-none focus:ring-2 focus:ring-[#E97B58] transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Scan
            </Link>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 relative">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.examCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-bold ${getScoreColor(result.score)}`}>{result.score}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => handleViewDetails(result, e)}
                        className="text-[#E97B58] hover:text-[#d86a47] mr-3 view-detail-button"
                      >
                        View
                      </button>
                      <button
                        onClick={() => confirmDelete(result.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Delete Confirmation Modal */}
        {deleteTarget !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-80">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this result?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Detail Box */}
        {selectedResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setSelectedResult(null)}
            ></div>
            <div
              ref={detailBoxRef}
              className="relative w-11/12 max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Same detail box content as before */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Result Details</h2>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                        {/* Your details content remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Roll Number:</span>
                <p className="text-gray-900">{selectedResult.rollNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Exam Date:</span>
                <p className="text-gray-900">{selectedResult.date}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Exam Code:</span>
                <p className="text-gray-900">{selectedResult.examCode}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Score:</span>
                <p className="text-lg font-bold text-green-600">{selectedResult.score}%</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Correct Answers:</span>
                <p className="text-gray-900">{selectedResult.correctAnswers} / {selectedResult.totalQuestions}</p>
              </div>
              {/* <div>
                <span className="text-sm font-medium text-gray-500">Time Spent:</span>
                <p className="text-gray-900">{selectedResult.timeSpent}</p>
              </div> */}
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                  {selectedResult.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Answer Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="block text-2xl font-bold text-green-600">{selectedResult.correctAnswers}</span>
              <span className="text-sm text-green-800">Correct Answers</span>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="block text-2xl font-bold text-red-600">
                {selectedResult.totalQuestions - selectedResult.correctAnswers}
              </span>
              <span className="text-sm text-red-800">Incorrect Answers</span>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="block text-2xl font-bold text-blue-600">{selectedResult.totalQuestions}</span>
              <span className="text-sm text-blue-800">Total Questions</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setSelectedResult(null)}
            className="px-4 py-2 bg-[#E97B58] text-white rounded-md hover:bg-[#d86a47] focus:outline-none focus:ring-2 focus:ring-[#E97B58] transition-colors"
          >
            Close
          </button>
        </div>
              </div>
            </div>
          </div>
        )}

        {results.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-4">Scan some OMR sheets to see results here.</p>
            <Link
              to="/scan"
              className="px-4 py-2 bg-[#E97B58] text-white rounded-md hover:bg-[#d86a47] focus:outline-none focus:ring-2 focus:ring-[#E97B58] transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Scanning
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
