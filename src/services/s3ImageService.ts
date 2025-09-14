class S3ImageService {
  private baseUrl = `${import.meta.env.VITE_API_URL || 'https://doohgle-backend.onrender.com/api'}/aws-bookings`;

  // Upload images for a screen
  async uploadScreenImages(
    screenId: number,
    files: File[]
  ): Promise<{
    success: boolean;
    uploadedUrls?: string[];
    error?: string;
  }> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(
        `${this.baseUrl}/upload-images/${screenId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error uploading images:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  // Get S3 image URL with fallback only to uploaded images
  getImageUrl(imageUrl?: string | null): string | null {
    if (!imageUrl) {
      return null; // No placeholder, return null to show "No Image" state
    }

    // If already a full URL, return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it's just a key, construct the full S3 URL
    return `https://doohgle.s3.ap-southeast-2.amazonaws.com/${imageUrl}`;
  }

  // Parse image URLs from JSON string or array
  parseImageUrls(imageUrls?: string | string[] | null): string[] {
    if (!imageUrls) return [];

    try {
      if (Array.isArray(imageUrls)) {
        return imageUrls
          .map((url) => this.getImageUrl(url))
          .filter((url) => url !== null) as string[];
      }

      const parsed = JSON.parse(imageUrls);
      if (Array.isArray(parsed)) {
        return parsed
          .map((url) => this.getImageUrl(url))
          .filter((url) => url !== null) as string[];
      } else if (parsed) {
        const result = this.getImageUrl(parsed);
        return result ? [result] : [];
      }
    } catch (error) {
      if (typeof imageUrls === "string") {
        const result = this.getImageUrl(imageUrls);
        return result ? [result] : [];
      }
    }

    return [];
  }

  // Get primary image from URLs
  getPrimaryImage(
    imageUrls?: string | string[] | null,
    fallbackUrl?: string
  ): string | null {
    const urls = this.parseImageUrls(imageUrls);
    if (urls.length > 0) {
      return urls[0];
    }

    if (fallbackUrl) {
      return this.getImageUrl(fallbackUrl);
    }

    return null;
  }

  // Validate image file
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Only JPEG, PNG, and WebP images are allowed",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size must be less than 5MB",
      };
    }

    return { valid: true };
  }

  // Compress image before upload (optional)
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const s3ImageService = new S3ImageService();
