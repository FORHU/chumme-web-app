"use client";

import React, { useState } from "react";

import { CircleList } from "@/modules/circles/components/CircleList";
import { useCirclesQuery } from "@/modules/circles/hooks/useCircles";
import { Navbar } from "@/modules/landing/components/Navbar";
import { Box } from "@/modules/shared/components/Box";
import { FlexBox } from "@/modules/shared/components/FlexBox";
import { SearchBar } from "@/modules/shared/components/SearchBar";

export default function CirclesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    "All",
    "Tech",
    "Art",
    "Music",
    "Gaming",
    "Wellness",
    "Science",
  ];

  const {
    data: circles,
    isLoading,
    isError,
  } = useCirclesQuery(
    activeCategory === "All" ? undefined : activeCategory,
    search || undefined,
  );

  return (
    <Box className="min-h-screen bg-background-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <FlexBox direction="col" gap={12}>
          {/* Header Section */}
          <FlexBox direction="col" gap={4} className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary">
              Discover your <br />
              <span className="text-gradient-pink">Creative Circle.</span>
            </h1>
            <p className="text-xl text-text-secondary font-light">
              Explore spaces where deep conversation and meaningful connections
              happen naturally.
            </p>
          </FlexBox>

          {/* Filters & Search */}
          <FlexBox
            direction="col"
            gap={6}
            className="w-full md:flex-row md:items-center md:justify-between border-b border-border-default pb-8"
          >
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-brand-vibrant text-white shadow-lg shadow-brand-vibrant/20"
                      : "bg-background-tertiary text-text-secondary hover:bg-background-elevated hover:text-text-primary border border-border-default"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full md:w-80">
              <SearchBar
                placeholder="Find a community..."
                value={search}
                onSearch={(val) => setSearch(val)}
                onClear={() => setSearch("")}
                className="w-full"
              />
            </div>
          </FlexBox>

          {/* Circles Grid */}
          <CircleList
            circles={circles}
            isLoading={isLoading}
            isError={isError}
          />
        </FlexBox>
      </main>
    </Box>
  );
}
