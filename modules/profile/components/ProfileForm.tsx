"use client";

import React, { useState, useEffect } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "../hooks/useProfile";
import { Button } from "@/modules/shared/components/Button";
import { Card } from "@/modules/shared/components/Card";
import { FlexBox } from "@/modules/shared/components/FlexBox";
import { Alert } from "@/modules/shared/components/Alert";

export const ProfileForm = () => {
  const { data: profile, isLoading, isError } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
      });
    }
  }, [profile, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    try {
      await updateProfileMutation.mutateAsync({
        endpoint: "/api/v1/profiles/me", // Required by useApiMutation but handled internally in hook
        method: "PATCH",
        data: formData,
      });
      setSuccessMessage("Profile updated successfully!");
    } catch {
      // Error handled by mutation state
    }
  };

  if (isLoading) {
    return (
      <Card
        variant="glass"
        className="w-full max-w-2xl mx-auto p-8 animate-pulse"
      >
        <div className="h-8 bg-background-tertiary rounded w-1/3 mb-6" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-background-tertiary rounded w-1/4" />
              <div className="h-10 bg-background-tertiary rounded w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert
        variant="error"
        title="Error"
        message="Failed to load profile. Please try again later."
        className="max-w-2xl mx-auto"
      />
    );
  }

  return (
    <Card variant="glass" className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FlexBox direction="col" gap={6}>
          <h2 className="text-2xl font-bold text-text-primary">
            Profile Settings
          </h2>

          {successMessage && (
            <Alert variant="success" message={successMessage} />
          )}

          {updateProfileMutation.isError && (
            <Alert
              variant="error"
              message={
                updateProfileMutation.error?.message ||
                "Failed to update profile."
              }
            />
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-tertiary uppercase tracking-widest">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              placeholder="Your display name"
              className="w-full bg-background-secondary border border-border-default rounded-xl px-4 py-3 outline-none focus:border-brand-vibrant transition-colors text-text-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-tertiary uppercase tracking-widest">
              Bio
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell the world about yourself..."
              className="w-full bg-background-secondary border border-border-default rounded-xl px-4 py-3 outline-none focus:border-brand-vibrant transition-colors text-text-primary resize-none"
            />
          </div>

          <FlexBox gap={4} direction="col" className="md:flex-row">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-tertiary uppercase tracking-widest">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                className="w-full bg-background-secondary border border-border-default rounded-xl px-4 py-3 outline-none focus:border-brand-vibrant transition-colors text-text-primary"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-tertiary uppercase tracking-widest">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://yourwebsite.com"
                className="w-full bg-background-secondary border border-border-default rounded-xl px-4 py-3 outline-none focus:border-brand-vibrant transition-colors text-text-primary"
              />
            </div>
          </FlexBox>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Updating..." : "Save Changes"}
          </Button>
        </FlexBox>
      </form>
    </Card>
  );
};
