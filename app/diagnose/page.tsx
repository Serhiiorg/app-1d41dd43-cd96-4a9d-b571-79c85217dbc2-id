"use client";
import React, { useState } from "react";
import { Header } from "@/components/header";
import { ImageUploader } from "@/components/imageuploader";
import { DiagnosisResult } from "@/components/diagnosisresult";
import {
  UploadImageResponse,
  DiagnosisResult as DiagnosisResultType,
} from "@/app/types";
import { ArrowLeft, Check, Loader2, Upload, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function DiagnosePage() {
  const [step, setStep] = useState<"upload" | "diagnosing" | "result">(
    "upload",
  );
  const [uploadResponse, setUploadResponse] =
    useState<UploadImageResponse | null>(null);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (response: UploadImageResponse) => {
    setUploadResponse(response);

    if (!response.success || !response.imageId) {
      setError("Image upload failed. Please try again.");
      return;
    }

    setStep("diagnosing");

    try {
      const diagnosisResponse = await fetch("/api/diagnoses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId: response.imageId }),
      });

      const data = await diagnosisResponse.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to diagnose plant");
      }

      setDiagnosisResult(data.data);
      setStep("result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setStep("upload");
    }
  };

  const startNewDiagnosis = () => {
    setStep("upload");
    setUploadResponse(null);
    setDiagnosisResult(null);
    setError(null);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center w-full max-w-md">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${step === "upload" || step === "diagnosing" || step === "result" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <Upload className="w-5 h-5" />
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${step === "diagnosing" || step === "result" ? "bg-primary" : "bg-muted"}`}
          />
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${step === "diagnosing" || step === "result" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <Loader2
              className={`w-5 h-5 ${step === "diagnosing" ? "animate-spin" : ""}`}
            />
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${step === "result" ? "bg-primary" : "bg-muted"}`}
          />
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${step === "result" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <Check className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" data-component="DiagnosePage">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 font-sans">
            Plant Disease Diagnosis
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your plant to identify potential diseases and get
            treatment recommendations to help your plant recover.
          </p>
        </div>

        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-3xl mx-auto">
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md text-center">
                    <p>{error}</p>
                  </div>
                )}
                <ImageUploader
                  onUploadComplete={handleUploadComplete}
                  userId="test-user-id"
                />

                <div className="mt-12 text-center">
                  <h3 className="text-xl font-medium mb-6">How It Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-background p-6 rounded-xl border border-border">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">1. Upload a Photo</h4>
                      <p className="text-sm text-muted-foreground">
                        Take a clear photo of your plant's affected areas and
                        upload it.
                      </p>
                    </div>

                    <div className="bg-background p-6 rounded-xl border border-border">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Loader2 className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">2. AI Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI will analyze the image to identify potential
                        diseases.
                      </p>
                    </div>

                    <div className="bg-background p-6 rounded-xl border border-border">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Leaf className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">3. Get Treatment</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive detailed diagnosis and treatment
                        recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "diagnosing" && (
            <motion.div
              key="diagnosing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative w-24 h-24">
                <svg
                  className="animate-spin -ml-1 mr-3 h-24 w-24 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <h2 className="mt-8 text-2xl font-semibold text-center">
                Analyzing Your Plant
              </h2>
              <p className="mt-2 text-muted-foreground text-center max-w-md">
                Our AI is examining the image to identify diseases and determine
                the best treatment options...
              </p>
            </motion.div>
          )}

          {step === "result" && diagnosisResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DiagnosisResult result={diagnosisResult} />

              <div className="mt-8 text-center">
                <Button
                  onClick={startNewDiagnosis}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Start New Diagnosis
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
