// ============================================================
// FILE: src/App.tsx
// Combined version (Public + Admin routes)
//
// EXISTING FIXES (unchanged):
//   BUG 1 — Navbar was rendering on /admin/* routes.
//   BUG 2 — Footer was rendering on /admin/* routes.
//   ROOT CAUSE — useLocation() cannot be called outside <BrowserRouter>.
//   SOLUTION — Extract layout into <AppLayout> component placed
//              inside <BrowserRouter> so useLocation() works correctly.
//
// NEW ADDITION:
//   SECRET KEYBOARD SHORTCUT — Type "admin" anywhere on any public
//   page to instantly navigate to /admin/login.
//   Works only on public pages (disabled on /admin/* routes so it
//   doesn't interfere with admin form inputs).
//   Keypress buffer resets after 2 seconds of inactivity.
// ============================================================

import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Lazy Loaded Pages (Public) for Performance ──────────────
const Home         = lazy(() => import("./pages/Home"));
const Zones        = lazy(() => import("./pages/Zones"));
const Animals      = lazy(() => import("./pages/Animals"));
const Plants       = lazy(() => import("./pages/Plants"));
const Ecosystems   = lazy(() => import("./pages/Ecosystems"));
const Conservation = lazy(() => import("./pages/Conservation"));
const Map          = lazy(() => import("./pages/Map"));
const Value        = lazy(() => import("./pages/Value"));
const Quiz         = lazy(() => import("./pages/Quiz"));
const About        = lazy(() => import("./pages/About"));
const NotFound     = lazy(() => import("./pages/NotFound"));
const Biodiversity = lazy(() => import("./pages/Biodiversity"));
const AnimalDetail = lazy(() => import("./pages/AnimalDetail"));
const PlantDetail  = lazy(() => import("./pages/PlantDetail"));

const AdminLogin     = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Climate        = lazy(() => import("./pages/Climate"));
const Compare        = lazy(() => import("./pages/Compare"));

import ChatbotWidget  from "./components/ChatbotWidget";

// ─── Loader Fallback ──────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

// ──────────────────────────────────────────────────────────────
// AppLayout — lives INSIDE <BrowserRouter> so useLocation() works.
// Conditionally hides Navbar/Footer for all /admin/* paths.
// AdminLogin and AdminDashboard render their own full-page layouts.
// ──────────────────────────────────────────────────────────────
function AppLayout() {
  const location = useLocation();
  const navigate  = useNavigate();

  // Any path under /admin gets a clean full-page layout
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ── Secret Keyboard Shortcut ──────────────────────────────
  // Type the word "admin" (a → d → m → i → n) anywhere on a
  // public page to jump straight to /admin/login.
  //
  // Disabled on /admin/* routes so it doesn't interfere while
  // you are already typing inside admin form inputs.
  //
  // Buffer resets automatically after 2 seconds of no keypress,
  // so partial sequences don't linger.
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isAdminRoute) return; // don't listen on admin pages

    let buffer = "";
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts while user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      buffer += e.key.toLowerCase();

      // Keep only the last 5 characters (length of "admin")
      if (buffer.length > 5) {
        buffer = buffer.slice(-5);
      }

      // Clear any existing reset timer and start a new one
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        buffer = "";
      }, 2000);

      // Check if the sequence ends with "admin"
      if (buffer.endsWith("admin")) {
        buffer = "";
        navigate("/admin/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener when route changes or component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isAdminRoute, navigate]);

  return (
    <div className="flex flex-col min-h-screen">

      {/* Site Navbar — hidden on all /admin/* routes */}
      {!isAdminRoute && <Navbar />}

      {/* Main content */}
      <main className={isAdminRoute ? "" : "flex-1"}>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ─── Public Routes ────────────────────────────── */}
            <Route path="/"             element={<Home />}         />
            <Route path="/zones"        element={<Zones />}        />
            <Route path="/animals"      element={<Animals />}      />
            <Route path="/animals/:id"  element={<AnimalDetail />} />
            <Route path="/plants"       element={<Plants />}       />
            <Route path="/plants/:id"   element={<PlantDetail />}  />
            <Route path="/ecosystems"   element={<Ecosystems />}   />
            <Route path="/conservation" element={<Conservation />} />
            <Route path="/map"          element={<Map />}          />
            <Route path="/value"        element={<Value />}        />
            <Route path="/quiz"         element={<Quiz />}         />
            <Route path="/about"        element={<About />}        />
            <Route path="/biodiversity" element={<Biodiversity />} />

            <Route path="/climate"     element={<Climate />}      />
            <Route path="/compare"     element={<Compare />}      />

            {/* ─── Admin Routes (no Navbar / no Footer) ─────── */}
            <Route path="/admin"            element={<AdminLogin />}     />
            <Route path="/admin/login"      element={<AdminLogin />}     />
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />

            {/* ─── 404 ─────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </main>

      {/* Site Footer — hidden on all /admin/* routes */}
      {!isAdminRoute && <Footer />}

      {/* ── Floating AI Chatbot (on all public pages) ── */}
      {!isAdminRoute && <ChatbotWidget />}

    </div>
  );
}

import { ErrorBoundary } from "./components/ErrorBoundary";
import { FavoritesProvider } from "./context/FavoritesContext";

// ─── Root App Component ────────────────────────────────────────
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <FavoritesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* BrowserRouter wraps AppLayout so useLocation() is available */}
          <BrowserRouter>
            <ErrorBoundary>
              <AppLayout />
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;