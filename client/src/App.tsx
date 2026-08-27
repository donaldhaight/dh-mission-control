import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout, { type MissionControlNavItem } from "@/components/DashboardLayout";
import NotFound from "@/pages/NotFound";
import MissionControl from "@/pages/MissionControl";
import { BookOpenText, ClipboardList, LayoutDashboard, Network, ShieldCheck } from "lucide-react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  const navigationItems: MissionControlNavItem[] = [
    { icon: LayoutDashboard, label: "Mission Control", path: "/" },
    { icon: ClipboardList, label: "Requirements", path: "/requirements" },
    { icon: Network, label: "Missions & work", path: "/missions" },
    { icon: BookOpenText, label: "Context & evidence", path: "/context" },
    { icon: ShieldCheck, label: "Governance", path: "/governance" },
  ];
  return (
    <DashboardLayout navigationItems={navigationItems} productName="DH Mission Control">
      <Switch>
        <Route path={"/"}>{() => <MissionControl view="overview" />}</Route>
        <Route path={"/requirements"}>{() => <MissionControl view="requirements" />}</Route>
        <Route path={"/missions"}>{() => <MissionControl view="missions" />}</Route>
        <Route path={"/context"}>{() => <MissionControl view="context" />}</Route>
        <Route path={"/governance"}>{() => <MissionControl view="governance" />}</Route>
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
