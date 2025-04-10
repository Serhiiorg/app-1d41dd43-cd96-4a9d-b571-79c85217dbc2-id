"use client";
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Sprout,
  FileSearch,
  Gift,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { PlantCard } from "@/components/plantcard";
import { Plant } from "@/app/types";

export default function Home() {
  // Mock featured plants data
  const featuredPlants: Plant[] = [
    {
      id: "1",
      name: "Monstera Deliciosa",
      scientificName: "Monstera deliciosa",
      description:
        "The Swiss Cheese Plant is known for its distinctive leaves with natural holes, called fenestrations. Native to the tropical forests of southern Mexico and Panama, it is a popular houseplant that can improve indoor air quality.",
      careInstructions:
        "Moderate indirect light, water when top 2-3 inches of soil is dry, enjoys high humidity.",
      imageUrl:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "2",
      name: "Peace Lily",
      scientificName: "Spathiphyllum wallisii",
      description:
        'The Peace Lily is a popular indoor plant known for its dark green leaves and white "spathes" that rise above the foliage. It is valued for its air-purifying qualities and ability to thrive in low light conditions.',
      careInstructions:
        "Low to moderate indirect light, keep soil consistently moist but not soggy, mist occasionally.",
      imageUrl:
        "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "3",
      name: "Snake Plant",
      scientificName: "Dracaena trifasciata",
      description:
        "The Snake Plant, also known as Mother-in-law is Tongue, is a hardy succulent with stiff, upright leaves. It is one of the most tolerant houseplants you can grow, making it perfect for beginners or those who travel frequently.",
      careInstructions:
        "Tolerates low light but prefers bright indirect light, water sparingly, allowing soil to dry completely between waterings.",
      imageUrl:
        "https://images.unsplash.com/photo-1599009944997-3544f22f9183?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-component="HomePage">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 opacity-20 bg-[url('https://images.unsplash.com/photo-1558693168-c370615b54e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Leaf className="h-4 w-4 mr-2" />
                <span>Plant Disease Recognition</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold font-sans leading-tight">
                Keep Your Plants <span className="text-primary">Healthy</span>{" "}
                and <span className="text-primary">Thriving</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Upload a photo of your plant and get instant diagnosis of
                diseases, plus treatment recommendations to restore your plant
                is health.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/diagnose">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-medium text-lg flex items-center justify-center">
                    Diagnose My Plant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/plants">
                  <Button className="w-full sm:w-auto bg-white border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-md font-medium text-lg flex items-center justify-center">
                    Explore Plants
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-secondary/30 rounded-full blur-xl"></div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
              <img
                src="https://images.unsplash.com/photo-1558693168-c370615b54e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Healthy plant leaves"
                className="rounded-lg shadow-xl relative z-10 max-h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center font-sans">
            Why Use PlantHealth?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileSearch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-sans">
                Instant Diagnosis
              </h3>
              <p className="text-muted-foreground">
                Upload a photo and get instant identification of plant diseases
                with precise accuracy.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-sans">
                Treatment Plans
              </h3>
              <p className="text-muted-foreground">
                Receive detailed treatment recommendations tailored to your
                plant's specific condition.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-sans">
                Plant Library
              </h3>
              <p className="text-muted-foreground">
                Access our comprehensive library of plants with detailed care
                instructions and disease information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-sans">
              Featured Plants
            </h2>
            <Link
              href="/plants"
              className="text-primary font-medium flex items-center hover:underline"
            >
              View all plants
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
            <Gift className="h-8 w-8" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 font-sans">
            Ready to diagnose your plant?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get started for free and give your plants the care they deserve.
          </p>
          <Link href="/diagnose">
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-md font-medium text-lg">
              Start Diagnosis Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center md:justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-primary">
              <Leaf className="h-6 w-6" />
              <span className="text-lg font-semibold font-sans">
                PlantHealth
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PlantHealth. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
