import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";


const Scanner = () => {
  const [uploadMethod, setUploadMethod] = useState('folder');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [webcamActive, setWebcamActive] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Change method
  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);
    if (method !== 'webcam' && webcamActive) {
      stopWebcam();
    }
  };

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

  // Webcam controls
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setWebcamActive(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], `webcam-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        setUploadedFiles(prev => [...prev, file]);
      }, 'image/jpeg', 0.8);
    }
  };

  // Fake scanning
  const handleStartScan = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one OMR sheet before scanning.');
      return;
    }
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          navigate('/result', { state: { scannedFiles: uploadedFiles } }); // 👉 redirect to Result
          return 100;
        }
        return prev + 5;
      });
    }, 200);
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
          <p className="text-gray-600 mt-2">Upload or capture images of OMR sheets for evaluation</p>
        </div>

        {/* Upload Method */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Upload Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleUploadMethodChange('folder')}
              className={`p-4 rounded-lg border-2 transition-all ${
                uploadMethod === 'folder'
                  ? 'border-[#E97B58] bg-orange-50 text-[#E97B58]'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              Upload Files/Folder
            </button>
            <button
              onClick={() => handleUploadMethodChange('webcam')}
              className={`p-4 rounded-lg border-2 transition-all ${
                uploadMethod === 'webcam'
                  ? 'border-[#E97B58] bg-orange-50 text-[#E97B58]'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              Webcam Capture
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
          onDrop={uploadMethod === 'folder' ? handleDrop : undefined}
          onDragOver={uploadMethod === 'folder' ? (e) => e.preventDefault() : undefined}
          onDragEnter={uploadMethod === 'folder' ? (e) => e.preventDefault() : undefined}
        >
          {uploadMethod === 'folder' ? (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                webkitdirectory=""
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#E97B58] transition-colors mb-4"
                onClick={triggerFileInput}
              >
                <p>Click or drag files/folder here</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative">
                <div className="bg-gray-200 rounded-lg overflow-hidden aspect-video mb-4 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${webcamActive ? 'block' : 'hidden'}`}
                  />
                  {!webcamActive && <p className="text-gray-600">Webcam not active</p>}
                </div>
                <div className="flex justify-center space-x-4">
                  {!webcamActive ? (
                    <button
                      onClick={startWebcam}
                      className="px-4 py-2 bg-[#E97B58] text-white rounded-md"
                    >
                      Start Camera
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={captureImage}
                        className="px-4 py-2 bg-[#E97B58] text-white rounded-md"
                      >
                        Capture Image
                      </button>
                      <button
                        onClick={stopWebcam}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                      >
                        Stop Camera
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

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
            onClick={handleStartScan}
            disabled={isScanning || uploadedFiles.length === 0}
            className="w-full py-3 bg-[#E97B58] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? `Scanning... (${scanProgress}%)` : 'Start Scanning'}
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
