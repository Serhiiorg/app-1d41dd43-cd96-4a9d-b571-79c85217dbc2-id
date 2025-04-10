// types.ts

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  careInstructions: string;
  imageUrl?: string;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  causes: string;
  severity: "low" | "medium" | "high";
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
}

export interface Diagnosis {
  id: string;
  plantId: string;
  diseaseId: string;
  userId: string;
  confidence: number;
  diagnosedAt: Date;
  notes?: string;
  status: "pending" | "confirmed" | "treated" | "resolved";
}

export interface Treatment {
  id: string;
  diseaseId: string;
  name: string;
  description: string;
  instructions: string;
  duration?: string;
  effectiveness: "low" | "medium" | "high";
}

export interface UserPlant {
  id: string;
  userId: string;
  plantId: string;
  nickname?: string;
  location?: string;
  acquiredAt: Date;
  notes?: string;
  healthStatus: "healthy" | "concerning" | "sick";
}

export interface Image {
  id: string;
  url: string;
  userId: string;
  plantId?: string;
  diagnosisId?: string;
  uploadedAt: Date;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export interface PlantDisease {
  id: string;
  plantId: string;
  diseaseId: string;
  commonness: "rare" | "occasional" | "common";
}

export interface DiagnosisResult {
  diagnosisId: string;
  disease: Disease;
  confidence: number;
  symptoms: Symptom[];
  possibleTreatments: Treatment[];
}

export interface UploadImageResponse {
  success: boolean;
  imageId?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
