"use client";

import React from "react";
import { Circle, useJoinCircleMutation } from "../hooks/useCircles";
import { Card } from "@/modules/shared/components/Card";
import { Button } from "@/modules/shared/components/Button";
import { FlexBox } from "@/modules/shared/components/FlexBox";
import { cn } from "@/modules/shared/utils";

interface CircleCardProps {
  circle: Circle;
  className?: string;
}

export const CircleCard = ({ circle, className }: CircleCardProps) => {
  const joinMutation = useJoinCircleMutation();

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    joinMutation.mutate({
      endpoint: `/api/v1/circles/${circle.id}/join`,
      method: "POST",
      data: { circleId: circle.id },
    });
  };

  return (
    <Card
      variant="glass"
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
        className,
      )}
    >
      <div className="relative h-32 w-full overflow-hidden bg-background-tertiary">
        {circle.bannerUrl ? (
          <img
            src={circle.bannerUrl}
            alt={circle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-core/20 to-brand-vibrant/20" />
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-background-primary/60 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white">
          {circle.category}
        </div>
      </div>

      <div className="p-5 pt-10 relative">
        {/* Icon/Avatar Overlay */}
        <div className="absolute -top-10 left-5 w-16 h-16 rounded-2xl border-4 border-background-elevated overflow-hidden bg-background-secondary shadow-lg">
          {circle.iconUrl ? (
            <img
              src={circle.iconUrl}
              alt={circle.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-brand-vibrant text-white text-2xl font-bold">
              {circle.name[0]}
            </div>
          )}
        </div>

        <FlexBox direction="col" gap={1}>
          <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-brand-vibrant transition-colors">
            {circle.name}
          </h3>
          <p className="text-sm text-text-tertiary font-medium">
            {circle.memberCount.toLocaleString()} members
          </p>
        </FlexBox>

        <p className="mt-3 text-sm text-text-secondary line-clamp-2 h-10 font-light">
          {circle.description}
        </p>

        <div className="mt-6">
          <Button
            variant={circle.isJoined ? "ghost" : "primary"}
            size="sm"
            className="w-full justify-center"
            onClick={handleJoin}
            disabled={joinMutation.isPending}
          >
            {circle.isJoined ? "Member" : "Join Circle"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
