import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const Scanner = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle file/folder selection by clicking
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  // Open hidden input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle drag & drop (files + folders)
  const handleDrop = (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    const filesArr = [];

    if (items) {
      let pending = items.length;

      const checkDone = () => {
        pending--;
        if (pending === 0) {
          setUploadedFiles(prev => [...prev, ...filesArr]);
        }
      };

      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (entry) {
          traverseFileTree(entry, filesArr, checkDone);
        } else {
          checkDone();
        }
      }
    } else {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  // Recursively read folder structure
  const traverseFileTree = (item, filesArr, callback) => {
    if (item.isFile) {
      item.file(file => {
        filesArr.push(file);
        if (callback) callback();
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries(entries => {
        if (entries.length === 0 && callback) callback();
        let pending = entries.length;
        entries.forEach(entry => {
          traverseFileTree(entry, filesArr, () => {
            pending--;
            if (pending === 0 && callback) callback();
          });
        });
      });
    }
  };

  // Fake scanning
  const uploadAndScan = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one OMR sheet before scanning.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    const formData = new FormData();
    uploadedFiles.forEach(file => formData.append("file", file));

    try {
      const response = await fetch("http://localhost:8000/process-omr-batch", {
        method: "POST",
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to process OMR batch");

      const data = await response.json();

      console.log("Batch scan result:", data);
      // You can redirect to result page and pass data
      navigate("/result", { state: { batchResult: data } });

    } catch (error) {
      console.error(error);
      alert("Error scanning OMR sheets. See console for details.");
    } finally {
      setIsScanning(false);
    }
  };

  // File controls
  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  const clearAllFiles = () => setUploadedFiles([]);

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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E97B58]">Scan OMR Sheets</h1>
          <p className="text-gray-600 mt-2">Upload images of OMR sheets for evaluation</p>
        </div>

        {/* Upload Section */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#E97B58] transition-colors mb-4"
            onClick={triggerFileInput}
          >
            <p>Click or drag files/folder here</p>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <button onClick={clearAllFiles} className="text-sm text-red-600">
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                      {file.type.startsWith('image') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p className="text-xs text-gray-600 truncate">{file.name}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-1">{file.name}</p>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scan Button */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={uploadAndScan}
            disabled={isScanning || uploadedFiles.length === 0}
            className="w-full py-3 bg-[#E97B58] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? 'Scanning...' : 'Start Scanning'}
          </button>

          {isScanning && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#E97B58] h-2 rounded-full transition-all"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
