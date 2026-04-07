"use client";

import { Download } from "lucide-react";
import React from "react";

import { LandingStats } from "@/modules/landing/api/landing-api";
import { Button } from "@/modules/shared/components/Button";
import { useApiQuery } from "@/modules/shared/hooks/useApiQuery";
import { cn } from "@/modules/shared/utils";

export const Hero = () => {
  const { data, isLoading } = useApiQuery<LandingStats>(
    ["landing-stats"],
    "/landing/stats",
  );

  const stats: LandingStats = data || {
    activeMembers: "100K+",
    circles: "500+",
    liveEvents: "24/7",
    satisfaction: "99%",
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-48 pb-32 px-6 text-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-vibrant/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-brand-core/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl space-y-8">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight">
          Everything <br />
          <span className="text-gradient-pink">Happens Here.</span>
        </h1>

        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto font-light">
          Join the most vibrant community on the web. A premium space designed
          for meaningful connection and deep conversation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" className="w-full sm:w-auto">
            Start Journey
          </Button>

          <a
            href="/chumme.apk"
            download="chumme.apk"
            className="w-full sm:w-auto"
          >
            <Button
              variant="ghost"
              size="lg"
              className={`w-full flex items-center justify-center gap-2 border border-dashed 
                border-brand-vibrant/50 hover:border-brand-vibrant hover:bg-brand-vibrant/10 
                transition-all duration-300 group`}
            >
              <Download className="w-4 h-4 text-brand-vibrant group-hover:animate-bounce" />
              <span>Download APK</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full bg-brand-vibrant/20 
                text-brand-vibrant font-mono"
              >
                Android
              </span>
            </Button>
          </a>
        </div>

        <div
          className={cn(
            "pt-24 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700",
            isLoading
              ? "opacity-20 animate-pulse pointer-events-none"
              : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100",
          )}
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.activeMembers}</span>
            <span className="text-xs uppercase tracking-widest">
              Active Members
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.circles}</span>
            <span className="text-xs uppercase tracking-widest">Circles</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.liveEvents}</span>
            <span className="text-xs uppercase tracking-widest">
              Live Events
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.satisfaction}</span>
            <span className="text-xs uppercase tracking-widest">
              Satisfaction
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
