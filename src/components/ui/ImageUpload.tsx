import React, { useState, useRef } from 'react';
import { Upload, X, User, Users, Camera, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

const DEFAULT_AVATARS = {
  male: '/images/manager.png',
  female: '/images/woman.png'
};

export default function ImageUpload({ currentImage, onImageChange, className = '' }: ImageUploadProps) {
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.onerror = () => {
      setUploadError('Failed to read the selected file');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadConfirm = async () => {
    if (!previewImage || !selectedFile) {
      setUploadError('No file selected');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload via Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-testimonial-avatar`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed (${response.status})`);
      }

      const result = await response.json();

      if (!result.success || !result.url) {
        throw new Error('Upload successful but no URL returned');
      }

      onImageChange(result.url);
      setPreviewImage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(errorMessage);
      console.error('Image upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadCancel = () => {
    setPreviewImage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDefaultSelect = (avatarKey: 'male' | 'female') => {
    onImageChange(DEFAULT_AVATARS[avatarKey]);
    setPreviewImage('');
    setUploadError('');
  };

  const handleRemoveImage = () => {
    onImageChange(DEFAULT_AVATARS.female);
    setPreviewImage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture
      </label>

      {/* Current/Preview Image Display */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={previewImage || currentImage}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATARS.female;
            }}
          />
          {(currentImage !== DEFAULT_AVATARS.male && currentImage !== DEFAULT_AVATARS.female) && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove custom image"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {previewImage && (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleUploadConfirm}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Use This Image
            </button>
            <button
              type="button"
              onClick={handleUploadCancel}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        <div className="text-center">
          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload Custom Image</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          
          <label
            htmlFor="image-upload"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Processing...' : 'Choose File'}</span>
          </label>
          
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, GIF up to 5MB
          </p>
        </div>
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{uploadError}</span>
        </div>
      )}

      {/* Default Avatar Options */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Or choose a default avatar:</p>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleDefaultSelect('male')}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
              currentImage === DEFAULT_AVATARS.male
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={DEFAULT_AVATARS.male}
              alt="Male avatar"
              className="w-12 h-12 rounded-full object-cover mb-2"
            />
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600">Male</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDefaultSelect('female')}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
              currentImage === DEFAULT_AVATARS.female
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={DEFAULT_AVATARS.female}
              alt="Female avatar"
              className="w-12 h-12 rounded-full object-cover mb-2"
            />
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600">Female</span>
            </div>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> For best results, use square images (1:1 ratio) that will be displayed as circular avatars.
        </p>
      </div>
    </div>
  );
}