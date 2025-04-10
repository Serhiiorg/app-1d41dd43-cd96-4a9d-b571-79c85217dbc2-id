"use client";
import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { PlantCard } from "@/components/plantcard";
import { Search, Leaf, Filter } from "lucide-react";
import { Plant } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [plantsPerPage] = useState(9);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("/api/plants");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load plants");
        }

        setPlants(data.data);
        setFilteredPlants(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  useEffect(() => {
    const results = plants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientificName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        plant.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredPlants(results);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchQuery, plants]);

  // Get current plants for pagination
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(
    indexOfFirstPlant,
    indexOfLastPlant,
  );
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" data-component="PlantsPage">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Leaf className="h-12 w-12 text-primary animate-pulse" />
            <h2 className="mt-4 text-xl font-medium">
              Loading plant library...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" data-component="PlantsPage">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-destructive/10 rounded-lg">
            <h2 className="text-xl font-medium text-destructive mb-2">
              Error Loading Plants
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <Button
              className="mt-4 bg-primary text-primary-foreground"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-component="PlantsPage">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 font-sans">Plant Library</h1>
          <p className="text-muted-foreground max-w-3xl">
            Browse our collection of plants to learn about their
            characteristics, care requirements, and common diseases. Select a
            plant to view detailed information.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search plants by name or characteristics..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-shrink-0">
            <Button className="bg-muted hover:bg-muted/80 text-foreground w-full sm:w-auto flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 ml-1">
                Coming soon
              </span>
            </Button>
          </div>
        </div>

        {filteredPlants.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2">No plants found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters.
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              className="bg-primary text-primary-foreground"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-muted-foreground">
              Showing {indexOfFirstPlant + 1}-
              {Math.min(indexOfLastPlant, filteredPlants.length)} of{" "}
              {filteredPlants.length} plants
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-muted hover:bg-muted/80 text-foreground"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <Button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={
                        currentPage === index + 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }
                    >
                      {index + 1}
                    </Button>
                  ))}

                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-muted hover:bg-muted/80 text-foreground"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
