"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Activity,
  Pill,
  BarChart3,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DiagnosisResult as DiagnosisResultType } from "@/app/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface DiagnosisResultProps {
  result: DiagnosisResultType;
}

export function DiagnosisResult({ result }: DiagnosisResultProps) {
  const [expandedSections, setExpandedSections] = useState({
    symptoms: false,
    treatments: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return "bg-success text-success-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-success";
    if (confidence >= 0.5) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="w-full max-w-3xl mx-auto" data-component="DiagnosisResult">
      <Card className="shadow-md">
        <CardHeader className="bg-primary/10 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-sans">
                {result.disease.name}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Diagnosis ID: {result.diagnosisId}
              </CardDescription>
            </div>
            <Badge
              className={`${getSeverityColor(result.disease.severity)} px-3 py-1`}
            >
              {result.disease.severity.charAt(0).toUpperCase() +
                result.disease.severity.slice(1)}{" "}
              Severity
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Diagnosis Confidence</h3>
              <span
                className={`font-bold text-lg ${getConfidenceColor(result.confidence)}`}
              >
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
            <Progress value={result.confidence * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("symptoms")}
            >
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">Symptoms</h3>
              </div>
              <Button variant="ghost" size="sm">
                {expandedSections.symptoms ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Button>
            </div>

            <AnimatePresence>
              {expandedSections.symptoms && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {result.symptoms.length > 0 ? (
                    <ul className="mt-2 space-y-2 pl-8 list-disc text-foreground">
                      {result.symptoms.map((symptom) => (
                        <li key={symptom.id} className="pl-1">
                          <span className="font-medium">{symptom.name}:</span>{" "}
                          {symptom.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground italic pl-7 mt-2">
                      No symptoms recorded for this disease.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-md bg-muted/50 p-4 border border-border">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-md font-medium mb-1">About This Disease</h4>
                <p className="text-sm text-foreground">
                  {result.disease.description}
                </p>

                <div className="mt-3">
                  <h5 className="text-sm font-medium mb-1">Common Causes:</h5>
                  <p className="text-sm text-foreground">
                    {result.disease.causes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("treatments")}
            >
              <div className="flex items-center">
                <Pill className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">
                  Recommended Treatments
                </h3>
              </div>
              <Button variant="ghost" size="sm">
                {expandedSections.treatments ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Button>
            </div>

            <AnimatePresence>
              {expandedSections.treatments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {result.possibleTreatments.length > 0 ? (
                    <div className="space-y-3 mt-2">
                      {result.possibleTreatments.map((treatment) => (
                        <Card key={treatment.id} className="overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
                            <div className="flex items-center">
                              <h4 className="font-medium">{treatment.name}</h4>
                            </div>
                            <Badge
                              className={`${getSeverityColor(treatment.effectiveness)} px-2 py-0.5 text-xs`}
                            >
                              {treatment.effectiveness.charAt(0).toUpperCase() +
                                treatment.effectiveness.slice(1)}{" "}
                              Effectiveness
                            </Badge>
                          </div>
                          <div className="p-3 text-sm">
                            <p className="mb-2">{treatment.description}</p>
                            <h5 className="font-medium mb-1">Instructions:</h5>
                            <p className="text-foreground">
                              {treatment.instructions}
                            </p>
                            {treatment.duration && (
                              <p className="mt-2 text-muted-foreground">
                                <span className="font-medium">Duration:</span>{" "}
                                {treatment.duration}
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic pl-7 mt-2">
                      No treatments available for this disease.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-4 border-t">
          <Link
            href={`/treatments/${result.disease.id}`}
            className="w-full sm:w-auto"
          >
            <Button className="w-full" variant="default">
              <BarChart3 className="w-4 h-4 mr-2" />
              View All Treatments
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            Ask a Specialist
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
