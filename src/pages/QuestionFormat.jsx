import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function QuestionFormat() {
  const navigate = useNavigate();
  const componentRef = useRef(null);

  const [examCodes, setExamCodes] = useState([]); // store exam codes from backend
  const [form, setForm] = useState({
    university: "",
    exam: "",
    academicYear: "",
    year: "",
    semester: "",
    examCode: "", // new field
  });

  useEffect(() => {
    fetch("http://localhost:8000/exam-codes", {
      credentials: "include" // important for cookie
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        // backend returns { exam_codes: [...] }
        setExamCodes(data.exam_codes || []);
      })
      .catch(err => console.error(err));
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onBeforeGetContent: () => {
      if (componentRef.current) {
        componentRef.current.classList.add("print-mode");
      }
    },
    onAfterPrint: () => {
      if (componentRef.current) {
        componentRef.current.classList.remove("print-mode");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="absolute top-10 left-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E97B58] text-white shadow hover:bg-[#d96b4e] transition"
          aria-label="back"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E97B58]">Create OMR Sheet</h1>
          <p className="text-gray-600 mt-2">Customize and print OMR sheets</p>
        </div>

        <div className="mb-4 flex justify-center">
          <button
            onClick={() => {
              handlePrint();
            }}
            className="px-6 py-3 bg-[#E97B58] text-white rounded-lg shadow hover:bg-[#d96b4e] transition-colors"
          >
            Print Sheet
          </button>
        </div>
      </div>

      {/* OMR Sheet */}
      <div
        ref={componentRef}
        className="mx-auto bg-white border border-black w-[800px] p-10 relative"
        style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
      >
        {/* form */}
        <div className="flex justify-between mb-6">
          <div className="w-2/3"></div>
          <div className="w-1/3">
            {/* University */}
            <div className="flex items-center mb-1">
              <input
                name="university"
                value={form.university}
                onChange={handleChange}
                placeholder="University:"
                className="w-60 h-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E97B58]"
              />
            </div>

            {/* Exam */}
            <div className="flex items-center mb-1">
              <label htmlFor="exam" className="font-medium text-sm mr-2">
                Exam:
              </label>
              <input
                name="exam"
                value={form.exam}
                onChange={handleChange}
                placeholder="Exam:"
                className="w-60 h-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E97B58]"
              />
            </div>

            {/* Exam Code Dropdown */}
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor="examCode" className="font-medium text-sm">
                Exam Code:
              </label>
              <select
                id="examCode"
                name="examCode"
                value={form.examCode}
                onChange={handleChange}
                className="w-60 h-8 px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-[#E97B58]"
              >
                <option value="">Select Exam Code</option>
                {examCodes.map((exam, idx) => (
                  <option key={idx} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>


            {/* Year & Semester */}
            <div className="flex items-center gap-3">
              <div className="flex gap-2 flex-1">
                <label htmlFor="year" className="font-medium text-sm mr-2">
                Year:
              </label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder=""
                  className="px-3 py-2 w-10 h-8 focus:outline-none focus:ring-2 focus:ring-[#E97B58]"
                />
                <div className="self-center">,</div>
                <label htmlFor="semester" className="font-medium text-sm mr-2">
                Semester:
              </label>
                <input
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  placeholder=""
                  className="px-3 py-2 w-10 h-8 focus:outline-none focus:ring-2 focus:ring-[#E97B58]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rest of OMR design unchanged */}
        <div className="mt-6">
          <div className="grid grid-cols-10 text-center border-2 border-black">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="border-r border-black py-3 font-bold text-lg"
              >
                {i}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <div className="grid grid-cols-10 gap-0 border-2 border-black">
            {Array.from({ length: 40 }).map((_, idx) => (
              <div
                key={idx}
                className="border-r border-b border-black flex items-center justify-center p-2"
              >
                <div className="w-8 h-8 rounded-full border-2 border-gray-800" />
              </div>
            ))}
          </div>
        </div>

        {/* Instructions and Ques*/}
        <div className="flex mb-6 mt-8 w-full h-auto">
          {/* Instructions */}
          <div className="w-1/3 pr-6">
            <h3 className="font-bold text-sm mb-3 border-b border-black pb-2">
              OMR Instructions: Read Carefully
            </h3>
            <ul className="text-xs list-disc pl-4 space-y-2">
              <li><strong>Pen Only:</strong> Use blue or black ballpoint pen. Pencils are forbidden</li>
              <li><strong>Keep Clean:</strong> Do not fold, tear, or make stray marks on the sheet.</li>
              <li><strong>Fill Completely:</strong> Darken circles fully. Do not use ticks or crosses</li>
              <li><strong>One Circle per Question:</strong> Making multiple answers invalidates your response although you choose correct answer.</li>
              <li><strong>No Rough Work:</strong> Use the test booklet for all rough calculations.</li>
              <li><strong>Avoid Restricted Areas:</strong> Do not write near corner index points.</li>
              <li><strong>Submit All:</strong> Return both OMR sheet and question paper to the invigilator.</li>
            </ul>
          </div>

          {/* Ques*/}
          <div className="w-2/3 flex">
            <div className="w-14 mr-3">
              <table className="w-full border-collapse border-2 border-gray-800">
                <tbody>
                  {Array.from({ length: 10 }).map((_, r) => (
                    <tr key={r}>
                      <td className="border border-gray-800 text-center font-bold h-10 text-sm">
                        {r + 1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex-1">
              <table className="w-full border-collapse border-2 border-gray-800">
                <tbody>
                  {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 4 }).map((_, colIndex) => (
                        <td key={colIndex} className="border border-gray-800 text-center h-10">
                          <div className="w-8 h-8 rounded-full border-2 border-gray-800 mx-auto"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Result*/}
        <div className="mt-8 flex justify-end items-center gap-4">
          <div className="font-semibold text-sm">Result:</div>
          <div className="w-50 h-18 border-2 border-black" />
        </div>
      </div>
    </div>
  );
}




