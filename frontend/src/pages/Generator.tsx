import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUpload, HiDocumentText, HiArrowLeft, HiSparkles, HiUserCircle, HiLogout } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export const Generator: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Drag and Drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError('');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid format. Please upload a valid PDF or Image (PNG/JPG).');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB Limit
      setError('File size exceeds the 10MB safety limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a document first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
  
      const res = await API.post('/v1/itinerary/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.itinerary?._id) {
        navigate(`/share/${res.data.itinerary._id}`);
      } else {
        setError('Generation completed but failed to route reference index.');
      }
    } catch (err: any) {
      console.error('Extraction flow error:', err);
      setError(err.response?.data?.message || 'Failed to extract text tokens. Please ensure image is clear.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--layout-bg)' }}>

      {/* PREMIUM STICKY NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" style={{ borderColor: 'var(--layout-border)' }}>
        <div className="flex items-center gap-3">
          <span
            className="text-xl font-black tracking-tighter cursor-pointer transition-transform duration-200 active:scale-95 text-stone-900 select-none"
            onClick={() => navigate('/dashboard')}
          >
            <span className="text-teal-600">Trrip</span>
          </span>
        </div>


        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-stone-700 bg-stone-50/80 pl-2 pr-3 py-1.5 rounded-xl border border-stone-100  sm:flex">
            <HiUserCircle className="text-lg text-teal-600 shrink-0" />
            <span className="text-xs font-semibold">Hi, {user?.name}</span>
          </div>
          <button
            onClick={() => logoutUser()}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2 border rounded-xl hover:border-red-200 hover:text-red-500 hover:bg-red-50/40 transition-all active:scale-95 cursor-pointer shadow-3xs text-stone-500"
            style={{ borderColor: 'var(--layout-border)' }}
          >
            <HiLogout className="text-sm shrink-0" /> Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 flex flex-col justify-center">

        {/* Back navigation control */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl border bg-white shadow-3xs hover:text-teal-600 transition-all active:scale-95 cursor-pointer"
            style={{ borderColor: 'var(--layout-border)' }}
          >
            <HiArrowLeft className="text-xs" /> Back to Dashboard
          </button>
        </div>

        {/* Form Body layout */}
        <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-xs" style={{ borderColor: 'var(--layout-border)' }}>
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-2">
              <HiSparkles className="text-teal-600" /> Compile Travel Tokens
            </h2>
            <p className="text-xs font-medium text-stone-500 mt-1">
              Upload or drag-and-drop flight tickets, hotel vouchers, or booking snapshots. Our multimodal AI engine will compile a rich structured route matrix instantly.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-xs font-bold text-center mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">

            {/* INTERACTIVE DRAG & DROP ZONE */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all relative flex flex-col items-center justify-center min-h-55 ${dragActive ? 'border-teal-500 bg-teal-50/30' : 'border-stone-300 bg-stone-50/40 hover:bg-stone-50/80'
                }`}
            >
              <input
                type="file"
                id="file-upload-input"
                onChange={handleFileChange}
                accept=".pdf, .png, .jpg, .jpeg"
                className="hidden"
              />

              <label
                htmlFor="file-upload-input"
                className="absolute inset-0 w-full h-full cursor-pointer z-10"
              />

              <div className="z-20 pointer-events-none flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border text-xl text-stone-400 mb-4 shadow-3xs">
                  <HiUpload />
                </div>
                <p className="text-sm font-bold text-stone-800">
                  {file ? 'Document selected successfully' : 'Drag & drop booking file here'}
                </p>
                <p className="text-xs font-medium text-stone-400 mt-1">
                  Supports PDF, PNG, JPG formats up to 10MB
                </p>
              </div>
            </div>

            {/* VISUAL FILE STATUS DISPLAY SLAB */}
            {file && (
              <div className="bg-stone-50 border rounded-xl p-3 flex items-center justify-between border-stone-200/60 animate-fadeIn">
                <div className="flex items-center gap-2.5 min-w-0">
                  <HiDocumentText className="text-teal-600 text-lg shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-stone-900 truncate">{file.name}</p>
                    <p className="text-[10px] font-bold text-stone-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-[10px] font-black uppercase tracking-wider text-stone-400 hover:text-red-500 cursor-pointer p-1 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            {/* PIPELINE DISPATCH BUTTON */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all flex items-center justify-center gap-2 select-none ${loading || !file ? 'bg-stone-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.99] cursor-pointer'
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>AI Engine extracting details...</span>
                </>
              ) : (
                <span>Generate Rich Itinerary</span>
              )}
            </button>

          </form>
        </div>
      </main>

      {/* FOOTER CANVAS */}
      <footer className="text-center py-6 mt-auto">
        <p className="text-[10px] tracking-wide font-medium text-stone-400 uppercase">
          Powered by HR Trrip Flow Console Engine
        </p>
      </footer>

    </div>
  );
};