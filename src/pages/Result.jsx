import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { ArrowDownOnSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";

const Result = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [grades, setGrades] = useState({});
  const [expandedExam, setExpandedExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Fetch results summary
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:8000/my-exams/summary", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch results");

        const datata = await res.json();
        const data = datata.exams;

        const formatted = data.map((item, index) => ({
          id: index + 1,
          date: item.date,
          examCode: item.exam_code,
          score: item.avg_score,
        }));

        setResults(formatted);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const [showModal, setShowModal] = useState(false);

  // 🔹 Fetch grades for a specific exam_code
  const fetchGrades = async (examCode) => {
    try {
      const res = await fetch(`http://localhost:8000/my-exams/${examCode}/grades`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch grades");

      const data = await res.json();
      setGrades((prev) => ({
        ...prev,
        [examCode]: data.grades,
      }));
    } catch (err) {
      console.error("Error fetching grades:", err);
    }
  };

  // Toggle expanded exam
  const handleToggle = (examCode) => {
    if (expandedExam === examCode) {
      setExpandedExam(null);
    } else {
      setExpandedExam(examCode);
      if (!grades[examCode]) fetchGrades(examCode);
    }
  };
  const formatAnswers = (answers) => {
  const map = { 0: "A", 1: "B", 2: "C", 3: "D", "-1": "-" };
  return answers.map(a => map[a] ?? "N/A").join(", ");
};


  // Download graded images for an exam
  const handleDownloadImages = async (examCode) => {
    try {
      const res = await fetch(`http://localhost:8000/my-exams/${examCode}/graded-images`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to download images");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${examCode}_graded_images.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading images:", err);
      alert("Failed to download graded images.");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
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

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 relative">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <React.Fragment key={result.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.examCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggle(result.examCode)}
                          className="text-[#E97B58] hover:text-[#d86a47] mr-3"
                        >
                          {expandedExam === result.examCode ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Grades */}
                    {expandedExam === result.examCode && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4">
                          {!grades[result.examCode] ? (
                            <p className="text-gray-500 text-sm">Loading grades...</p>
                          ) : (
                            <div>
                              <div className="mt-2 flex space-x-3 justify-end">
                                {/* CSV Download */}
                                <button
                                  onClick={() =>
                                    window.open(
                                      `http://localhost:8000/my-exams/${result.examCode}/grades/csv`,
                                      "_blank"
                                    )
                                  }
                                  className="flex items-center space-x-2 text-green-600 hover:text-green-800 focus:outline-none"
                                  title="Download CSV"
                                >
                                  <ArrowDownOnSquareIcon className="w-5 h-5" />
                                  <span className="text-sm font-medium">CSV</span>
                                </button>

                                {/* Graded Images Download */}
                                <button
                                  onClick={() => handleDownloadImages(result.examCode)}
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                  title="Download Graded Images"
                                >
                                  <ArrowDownOnSquareIcon className="w-5 h-5" />
                                  <span className="text-sm font-medium">Images</span>
                                </button>
                              </div>

                              <div className="overflow-x-auto mt-2">
                                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {grades[result.examCode].map((grade, idx) => {
                                      return (
                                        <React.Fragment key={idx}>
                                          <tr>
                                            <td className="px-4 py-2 text-sm text-gray-600">{grade.roll_number}</td>
                                            <td className="px-4 py-2 text-sm">
                                              <span className={`font-bold ${getScoreColor(grade.score)}`}>
                                                {grade.score}
                                              </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-600">{grade.date}</td>
                                            <td className="px-4 py-2 text-sm flex space-x-2">
                                              {/* View Details Modal */}
                                              <button
                                                onClick={() => setShowModal(true)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="View Details"
                                              >
                                                <PhotoIcon className="w-5 h-5" />
                                              </button>

                                              {/* Download Image */}
                                              <a
                                                href={`http://localhost:8000/download/${grade.graded_image}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-800"
                                                title="Download Graded Image"
                                              >
                                                <ArrowDownOnSquareIcon className="w-5 h-5" />
                                              </a>
                                            </td>
                                          </tr>

                                          {/* Modal */}
                                          {showModal && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                                              <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 relative">
                                                <button
                                                  onClick={() => setShowModal(false)}
                                                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                                >
                                                  X
                                                </button>
                                                <h3 className="text-lg font-bold text-gray-800 mb-4">Grade Details</h3>
                                                <p><span className="font-medium">Roll Number:</span> {grade.roll_number}</p>
                                                <p><span className="font-medium">Score:</span> {grade.score}</p>
                                                <p><span className="font-medium">Date:</span> {grade.date}</p>
                                                <p><span className="font-medium">Invalid Count:</span> {grade.invalid_count}</p>
                                                <p><span className="font-medium">Answers:</span> {formatAnswers(grade.student_answers)}</p>
                                              </div>
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {results.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-4">Scan some OMR sheets to see results here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
