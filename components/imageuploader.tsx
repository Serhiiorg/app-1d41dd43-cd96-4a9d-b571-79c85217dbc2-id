"use client";
import React, { useState, useRef } from "react";
import { Upload, ImageIcon, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadImageResponse } from "@/app/types";

interface ImageUploaderProps {
  onUploadComplete: (response: UploadImageResponse) => void;
  userId?: string;
  plantId?: string;
}

export function ImageUploader({
  onUploadComplete = () => {},
  userId = "default-user",
  plantId = undefined,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        `File type not allowed. Please use: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}`,
      );
      return false;
    }

    if (file.size > MAX_SIZE) {
      setError(`File too large. Maximum size is ${MAX_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    setError(null);
    setSelectedImage(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 150);

    return interval;
  };

  const handleUpload = async () => {
    if (!selectedImage || !userId) {
      setError("Please select an image and ensure user ID is provided");
      return;
    }

    setUploading(true);
    setError(null);

    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("userId", userId);

      if (plantId) {
        formData.append("plantId", plantId);
      }

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      // Ensure progress shows 100% before completing
      setProgress(100);
      setTimeout(() => {
        clearInterval(progressInterval);
        onUploadComplete(data);
        setUploading(false);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" data-component="ImageUploader">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card
        className={`relative overflow-hidden ${
          isDragging
            ? "border-primary border-2"
            : selectedImage
              ? "border-solid border-secondary"
              : "border-dashed border-2 border-muted"
        } rounded-lg p-6 transition-all duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedImage ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-primary-50 p-3">
              <ImageIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Upload Plant Image</h3>
            <p className="mb-6 text-sm text-muted-foreground max-w-xs">
              Drag and drop your plant image, or click to select a file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              onClick={handleSelectClick}
              className="flex items-center"
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, WebP up to 10MB
            </p>
          </div>
        ) : (
          <div className="relative">
            {!uploading && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              {preview && (
                <img
                  src={preview}
                  alt="Plant preview"
                  className="h-full w-full object-cover"
                />
              )}

              {uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                  <p className="mb-4 font-medium">Uploading image...</p>
                  <div className="w-3/4">
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              )}
            </div>

            {!uploading && (
              <div className="mt-4 flex justify-center">
                <Button onClick={handleUpload} className="w-full sm:w-auto">
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze Plant Image
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
