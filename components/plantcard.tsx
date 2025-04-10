"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Leaf, Info } from "lucide-react";
import { Plant } from "@/app/types";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      className="overflow-hidden h-full flex flex-col"
      data-component="PlantCard"
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted">
          {plant.imageUrl ? (
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-primary-100">
              <Leaf className="w-16 h-16 text-primary-500" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold font-sans text-foreground">
            {plant.name}
          </h3>
          <p className="text-sm italic text-muted-foreground">
            {plant.scientificName}
          </p>

          <motion.div
            animate={{ height: expanded ? "auto" : "4rem" }}
            className="overflow-hidden relative"
          >
            <p className="text-sm text-foreground">{plant.description}</p>
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
            )}
          </motion.div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDescription}
            className="flex items-center justify-center mt-1 text-primary"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show more</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Link href={`/plants/${plant.id}`} className="w-full">
          <Button variant="outline" className="w-full flex items-center">
            <Info className="mr-2 h-4 w-4" />
            <span>View Details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
