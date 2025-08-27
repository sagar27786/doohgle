import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  X,
  Image,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { s3ImageService } from "../../services/s3ImageService";

interface S3ImageUploaderProps {
  screenId: number;
  onUploadSuccess?: (urls: string[]) => void;
  onClose: () => void;
}

const S3ImageUploader: React.FC<S3ImageUploaderProps> = ({
  screenId,
  onUploadSuccess,
  onClose,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      const validation = s3ImageService.validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        setError(validation.error || "Invalid file");
        return;
      }
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Compress images before upload
      const compressedFiles = await Promise.all(
        selectedFiles.map((file) => s3ImageService.compressImage(file))
      );

      const result = await s3ImageService.uploadScreenImages(
        screenId,
        compressedFiles
      );

      if (result.success && result.uploadedUrls) {
        setUploadResults(result.uploadedUrls);
        if (onUploadSuccess) {
          onUploadSuccess(result.uploadedUrls);
        }
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <Upload className="mr-3" size={24} />
              Upload Screen Images to AWS S3
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {uploadResults.length === 0 ? (
            <>
              {/* File Selection */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <Image size={48} className="text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Choose images to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      Support: JPEG, PNG, WebP (Max 5MB each)
                    </p>
                  </div>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Image size={20} className="text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle size={20} className="text-red-600" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="mr-2" />
                      Upload to AWS S3
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Upload Success */
            <div className="text-center space-y-6">
              <CheckCircle size={64} className="mx-auto text-green-600" />
              <h3 className="text-xl font-semibold text-green-600">
                Images Uploaded Successfully!
              </h3>
              <p className="text-gray-600">
                {uploadResults.length} image
                {uploadResults.length > 1 ? "s" : ""} uploaded to AWS S3
              </p>

              {/* Preview uploaded images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                {uploadResults.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default S3ImageUploader;
