import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from '@vercel/analytics/react';
import Index from "./pages/Index";
import CollectionArticlePage from "./pages/CollectionArticlePage";
import CategoryPage from "./pages/CategoryPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collections/:collection/:subcategory/:color" element={<CollectionArticlePage />} />
          <Route path="/collection/:slug" element={<Navigate to="/" replace />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
