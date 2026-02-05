import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`
          relative overflow-hidden rounded-2xl border-4 border-dashed transition-all duration-300
          flex flex-col items-center justify-center text-center p-10 min-h-[400px]
          ${dragActive ? 'border-green-500 bg-green-50 scale-105' : 'border-gray-300 bg-white hover:border-green-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4 z-10">
            <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
            <p className="text-lg font-semibold text-gray-700 animate-pulse">Examining plant leaves...</p>
            <p className="text-sm text-gray-500">Analyzing patterns and colors</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 z-10">
            <div className="bg-green-100 p-6 rounded-full">
              <SproutIcon className="w-12 h-12 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">Check Your Plant</h3>
              <p className="text-gray-500">Take a photo or upload an image to detect diseases and get care tips.</p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95"
              >
                <Camera className="w-5 h-5" />
                Take Photo / Upload
              </button>
              
              <p className="text-xs text-gray-400 mt-2">
                Supports JPG, PNG, WEBP (Max 5MB)
              </p>
            </div>
          </div>
        )}
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
};

const SproutIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);

export default ImageUploader;