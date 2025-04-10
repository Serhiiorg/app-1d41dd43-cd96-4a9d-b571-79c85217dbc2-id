"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import {
  ArrowLeft,
  Info,
  AlertCircle,
  CheckCircle,
  Clock,
  Leaf,
  Pill,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Treatment, Disease } from "@/app/types";

export default function TreatmentPage() {
  const params = useParams();
  const router = useRouter();
  const [disease, setDisease] = useState<Disease | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiseaseAndTreatments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch disease data (this would be a real endpoint in production)
        const diseaseResponse = await fetch(
          `/api/diseases/${params.diseaseId}`,
        );
        if (!diseaseResponse.ok) {
          throw new Error("Failed to fetch disease information");
        }

        const diseaseData = await diseaseResponse.json();
        setDisease(diseaseData.data);

        // Fetch treatments for this disease
        const treatmentsResponse = await fetch(
          `/api/treatments?diseaseId=${params.diseaseId}`,
        );
        if (!treatmentsResponse.ok) {
          throw new Error("Failed to fetch treatments");
        }

        const treatmentsData = await treatmentsResponse.json();
        setTreatments(treatmentsData.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params.diseaseId) {
      fetchDiseaseAndTreatments();
    }
  }, [params.diseaseId]);

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

  // Temporary mock data for example (would be removed in production)
  const mockDisease: Disease = {
    id: params.diseaseId as string,
    name: "Powdery Mildew",
    description:
      "A fungal disease that appears as a white or gray powdery growth on leaf surfaces, stems, and sometimes flowers and fruit. It can eventually cause leaf yellowing, distortion, and premature leaf drop.",
    causes:
      "Caused by various species of fungi in the Erysiphaceae family. Thrives in high humidity environments with moderate temperatures, and is often worsened by poor air circulation.",
    severity: "medium",
  };

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        data-component="TreatmentPage"
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Pill className="h-12 w-12 text-primary animate-pulse" />
            <h2 className="mt-4 text-xl font-medium">Loading treatments...</h2>
          </div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col"
        data-component="TreatmentPage"
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                Error Loading Treatments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise use mock data (for development)
  const displayDisease = disease || mockDisease;

  return (
    <div className="min-h-screen flex flex-col" data-component="TreatmentPage">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Diagnosis
          </Button>

          <h1 className="text-3xl font-bold mb-3 font-sans">
            Treatments for {displayDisease.name}
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Browse recommended treatments and solutions for{" "}
            {displayDisease.name}. Select the best option based on effectiveness
            and your available resources.
          </p>
        </div>

        {/* Disease Information Card */}
        <Card className="mb-10 bg-primary/5 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle>About This Disease</CardTitle>
              </div>
              <Badge className={getSeverityColor(displayDisease.severity)}>
                {displayDisease.severity.charAt(0).toUpperCase() +
                  displayDisease.severity.slice(1)}{" "}
                Severity
              </Badge>
            </div>
            <CardDescription>
              Understanding {displayDisease.name} will help you treat it more
              effectively
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Description</h3>
              <p>{displayDisease.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Causes</h3>
              <p>{displayDisease.causes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Treatments Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6 font-sans">
            Recommended Treatments
          </h2>

          {/* Tabs for treatment categories */}
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Treatments</TabsTrigger>
              <TabsTrigger value="organic">Organic</TabsTrigger>
              <TabsTrigger value="chemical">Chemical</TabsTrigger>
              <TabsTrigger value="preventive">Preventive</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {treatments.length > 0 ? (
                treatments.map((treatment) => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock treatments for display purposes */}
                  <TreatmentCard
                    treatment={{
                      id: "1",
                      diseaseId: displayDisease.id,
                      name: "Neem Oil Spray",
                      description:
                        "A natural fungicide and insecticide that can help control powdery mildew while being safe for most plants.",
                      instructions:
                        "Mix 2 teaspoons of neem oil with 1 teaspoon of mild liquid soap in 1 quart of water. Spray on affected areas, thoroughly coating both sides of leaves. Apply early in the morning or evening, avoiding hot midday sun. Repeat every 7 days or after rain.",
                      duration: "2-3 weeks of consistent application",
                      effectiveness: "medium",
                    }}
                  />
                  <TreatmentCard
                    treatment={{
                      id: "2",
                      diseaseId: displayDisease.id,
                      name: "Baking Soda Solution",
                      description:
                        "A homemade fungicide that can help neutralize powdery mildew spores.",
                      instructions:
                        "Mix 1 tablespoon of baking soda with 1 teaspoon of liquid soap and 1 gallon of water. Spray thoroughly on affected plants, making sure to coat both sides of leaves. Apply in the morning so leaves can dry during the day. Avoid application during hot weather.",
                      duration:
                        "Weekly application until signs of mildew disappear",
                      effectiveness: "medium",
                    }}
                  />
                  <TreatmentCard
                    treatment={{
                      id: "3",
                      diseaseId: displayDisease.id,
                      name: "Commercial Fungicide",
                      description:
                        "Specialized chemical treatment designed to eliminate powdery mildew quickly and effectively.",
                      instructions:
                        "Select a fungicide labeled for powdery mildew control. Follow package instructions precisely for mixing and application rates. Apply to all affected plant parts, ensuring thorough coverage. Wear protective gear as directed on the product label.",
                      duration:
                        "As directed on product, typically 7-14 days between applications",
                      effectiveness: "high",
                    }}
                  />
                  <TreatmentCard
                    treatment={{
                      id: "4",
                      diseaseId: displayDisease.id,
                      name: "Improved Air Circulation",
                      description:
                        "Preventive measure that reduces humidity around plants, making conditions less favorable for powdery mildew.",
                      instructions:
                        "Prune overcrowded plants to improve air flow. Space plants properly when planting. For indoor plants, use fans to increase air movement. Avoid overhead watering that can increase humidity.",
                      duration: "Ongoing preventive measure",
                      effectiveness: "low",
                    }}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="organic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TreatmentCard
                  treatment={{
                    id: "1",
                    diseaseId: displayDisease.id,
                    name: "Neem Oil Spray",
                    description:
                      "A natural fungicide and insecticide that can help control powdery mildew while being safe for most plants.",
                    instructions:
                      "Mix 2 teaspoons of neem oil with 1 teaspoon of mild liquid soap in 1 quart of water. Spray on affected areas, thoroughly coating both sides of leaves. Apply early in the morning or evening, avoiding hot midday sun. Repeat every 7 days or after rain.",
                    duration: "2-3 weeks of consistent application",
                    effectiveness: "medium",
                  }}
                />
                <TreatmentCard
                  treatment={{
                    id: "2",
                    diseaseId: displayDisease.id,
                    name: "Baking Soda Solution",
                    description:
                      "A homemade fungicide that can help neutralize powdery mildew spores.",
                    instructions:
                      "Mix 1 tablespoon of baking soda with 1 teaspoon of liquid soap and 1 gallon of water. Spray thoroughly on affected plants, making sure to coat both sides of leaves. Apply in the morning so leaves can dry during the day. Avoid application during hot weather.",
                    duration:
                      "Weekly application until signs of mildew disappear",
                    effectiveness: "medium",
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="chemical" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TreatmentCard
                  treatment={{
                    id: "3",
                    diseaseId: displayDisease.id,
                    name: "Commercial Fungicide",
                    description:
                      "Specialized chemical treatment designed to eliminate powdery mildew quickly and effectively.",
                    instructions:
                      "Select a fungicide labeled for powdery mildew control. Follow package instructions precisely for mixing and application rates. Apply to all affected plant parts, ensuring thorough coverage. Wear protective gear as directed on the product label.",
                    duration:
                      "As directed on product, typically 7-14 days between applications",
                    effectiveness: "high",
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="preventive" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TreatmentCard
                  treatment={{
                    id: "4",
                    diseaseId: displayDisease.id,
                    name: "Improved Air Circulation",
                    description:
                      "Preventive measure that reduces humidity around plants, making conditions less favorable for powdery mildew.",
                    instructions:
                      "Prune overcrowded plants to improve air flow. Space plants properly when planting. For indoor plants, use fans to increase air movement. Avoid overhead watering that can increase humidity.",
                    duration: "Ongoing preventive measure",
                    effectiveness: "low",
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Additional Advice Section */}
        <Card className="mt-10 bg-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-secondary" />
              Additional Care Advice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Monitor Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Check your plants regularly after treatment to assess
                  effectiveness and make adjustments as needed.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Isolate Affected Plants</h3>
                <p className="text-sm text-muted-foreground">
                  Keep infected plants separate from healthy ones to prevent
                  disease spread.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Adjust Environmental Factors</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure optimal light, temperature, and humidity conditions to
                  strengthen plant resistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Treatment Card Component
interface TreatmentCardProps {
  treatment: Treatment;
}

function TreatmentCard({ treatment }: TreatmentCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getEffectivenessColor = (effectiveness: "low" | "medium" | "high") => {
    switch (effectiveness) {
      case "low":
        return "text-muted-foreground";
      case "medium":
        return "text-warning";
      case "high":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      className="border rounded-lg overflow-hidden bg-card shadow-sm"
    >
      <div className="p-4 border-b bg-muted/30">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold font-sans">{treatment.name}</h3>
          <div className="flex items-center">
            <ThumbsUp
              className={`h-4 w-4 mr-1 ${getEffectivenessColor(treatment.effectiveness)}`}
            />
            <span
              className={`text-sm ${getEffectivenessColor(treatment.effectiveness)}`}
            >
              {treatment.effectiveness.charAt(0).toUpperCase() +
                treatment.effectiveness.slice(1)}{" "}
              Effectiveness
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {treatment.description}
        </p>
      </div>

      <div className="p-4">
        <motion.div
          animate={{ height: expanded ? "auto" : "120px" }}
          className={`relative overflow-hidden ${!expanded ? "mask-bottom" : ""}`}
        >
          <h4 className="font-medium mb-2 flex items-center">
            <Pill className="h-4 w-4 mr-2 text-primary" />
            Application Instructions
          </h4>
          <p className="text-sm mb-4">{treatment.instructions}</p>

          {treatment.duration && (
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>Duration: {treatment.duration}</span>
            </div>
          )}

          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent"></div>
          )}
        </motion.div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-primary w-full"
        >
          {expanded ? "Show Less" : "Show More"}
        </Button>
      </div>
    </motion.div>
  );
}
