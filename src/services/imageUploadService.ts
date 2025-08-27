// Image upload service for handling screen images
export class ImageUploadService {
  private static baseUrl = "http://localhost:4000/api";

  /**
   * Upload multiple images to the server
   * @param images - Array of File objects to upload
   * @param screenId - Optional screen ID to associate images with
   * @returns Promise with upload results
   */
  static async uploadImages(
    images: File[],
    screenId?: string
  ): Promise<{
    success: boolean;
    data?: {
      imageUrls: string[];
      count: number;
      files: Array<{
        originalName: string;
        filename: string;
        size: number;
        url: string;
      }>;
    };
    error?: string;
  }> {
    try {
      const formData = new FormData();

      // Add all images to form data
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Determine endpoint URL
      const endpoint = screenId
        ? `${this.baseUrl}/upload-images/${screenId}`
        : `${this.baseUrl}/upload-images/temp`;

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error uploading images:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      };
    }
  }

  /**
   * Get the full URL for an uploaded image
   * @param imagePath - The relative image path from the server
   * @returns Full URL to access the image
   */
  static getImageUrl(imagePath: string): string {
    if (imagePath.startsWith("http")) {
      return imagePath; // Already a full URL
    }
    return `${this.baseUrl}${imagePath}`;
  }

  /**
   * Validate image files before upload
   * @param files - Array of File objects to validate
   * @returns Object with validation results
   */
  static validateImages(files: File[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (files.length === 0) {
      errors.push("No files selected");
    }

    if (files.length > 10) {
      errors.push("Maximum 10 files allowed");
    }

    files.forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(
          `File ${index + 1} (${
            file.name
          }): Invalid file type. Only images are allowed.`
        );
      }

      if (file.size > maxSize) {
        errors.push(
          `File ${index + 1} (${
            file.name
          }): File size too large. Maximum 10MB allowed.`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create image preview URLs for display
   * @param files - Array of File objects
   * @returns Array of object URLs for preview
   */
  static createPreviewUrls(files: File[]): string[] {
    return files.map((file) => URL.createObjectURL(file));
  }

  /**
   * Clean up object URLs to prevent memory leaks
   * @param urls - Array of object URLs to revoke
   */
  static revokePreviewUrls(urls: string[]): void {
    urls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  }
}
