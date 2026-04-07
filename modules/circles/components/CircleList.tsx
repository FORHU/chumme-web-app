"use client";

import React from "react";

import { Alert } from "@/modules/shared/components/Alert";
import { ChummeLoader } from "@/modules/shared/components/ChummeLoader";

import { CircleCard } from "./CircleCard";
import { Circle } from "../hooks/useCircles";

interface CircleListProps {
  circles: Circle[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const CircleList = ({
  circles,
  isLoading,
  isError,
}: CircleListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 w-full">
        <ChummeLoader />
        <p className="mt-4 text-text-tertiary animate-pulse font-medium">
          Finding vibrant communities...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        variant="error"
        title="Well, this is awkward."
        message="We couldn't load the circles right now. Our cosmic connectors are working on it!"
        className="my-12"
      />
    );
  }

  if (!circles || circles.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <h3 className="text-2xl font-bold text-text-secondary">
          No circles found
        </h3>
        <p className="text-text-tertiary">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {circles.map((circle) => (
        <CircleCard key={circle.id} circle={circle} />
      ))}
    </div>
  );
};
