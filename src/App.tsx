import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Matches from "./pages/Matches";
import DailyReflection from "./pages/DailyReflection";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Plans from "./pages/Plans";
import Verification from "./pages/Verification";
import About from "./pages/About";
import PauseAccount from "./pages/PauseAccount";
import SettingsLocation from "./pages/SettingsLocation";
import SettingsNotifications from "./pages/SettingsNotifications";
import SettingsPrivacy from "./pages/SettingsPrivacy";
import SettingsSecurity from "./pages/SettingsSecurity";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="elo-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/onboarding" element={
                <ProtectedRoute><Onboarding /></ProtectedRoute>
              } />
              
              {/* Protected App Routes with Bottom Nav */}
              <Route path="/app" element={
                <ProtectedRoute><AppLayout /></ProtectedRoute>
              }>
                <Route index element={<Discover />} />
                <Route path="matches" element={<Matches />} />
                <Route path="messages" element={<Messages />} />
                <Route path="reflection" element={<DailyReflection />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/notifications" element={<SettingsNotifications />} />
                <Route path="settings/privacy" element={<SettingsPrivacy />} />
                <Route path="settings/location" element={<SettingsLocation />} />
                <Route path="settings/security" element={<SettingsSecurity />} />
                <Route path="settings/terms" element={<TermsOfUse />} />
                <Route path="settings/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="settings/community" element={<CommunityGuidelines />} />
                <Route path="settings/pause" element={<PauseAccount />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="plans" element={<Plans />} />
                <Route path="verification" element={<Verification />} />
                <Route path="about" element={<About />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
