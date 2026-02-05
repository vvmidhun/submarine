import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { SoundProvider } from "@/contexts/SoundContext";
import IntroPage from "./pages/IntroPage";
import Level1Page from "./pages/Level1Page";
import Level2Page from "./pages/Level2Page";
import FinalPage from "./pages/FinalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <SoundProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/user/gamified/DeepSea-Sub/">
            <Routes>
              <Route path="/" element={<IntroPage />} />
              <Route path="/level1" element={<Level1Page />} />
              <Route path="/level2" element={<Level2Page />} />
              <Route path="/final" element={<FinalPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SoundProvider>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
