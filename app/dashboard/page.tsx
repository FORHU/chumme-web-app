import { Navbar } from "@/modules/shared/components/Navbar";
import { RouteGuard } from "@/modules/shared/components/RouteGuard";
import { Tabs } from "@/modules/shared/components/Tabs";
import { ProfileForm } from "@/modules/profile/components/ProfileForm";
import { FlexBox } from "@/modules/shared/components/FlexBox";
import { Box } from "@/modules/shared/components/Box";

export default function DashboardPage() {
  const dashboardTabs = [
    {
      id: "profile",
      label: "My Profile",
      content: <ProfileForm />,
    },
    {
      id: "account",
      label: "Account Settings",
      content: (
        <Box className="p-8 text-center text-text-secondary">
          Account security and preference settings coming soon.
        </Box>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <Box className="p-8 text-center text-text-secondary">
          Notification preferences coming soon.
        </Box>
      ),
    },
  ];

  return (
    <RouteGuard>
      <Box className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
          <FlexBox direction="col" gap={8}>
            <header className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-text-secondary">
                Manage your account settings and profile preferences.
              </p>
            </header>

            <Tabs items={dashboardTabs} />
          </FlexBox>
        </main>
      </Box>
    </RouteGuard>
  );
}
