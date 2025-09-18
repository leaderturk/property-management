import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import Auth from "@/pages/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/admin/dashboard";
import Buildings from "@/pages/admin/buildings";
import Fees from "@/pages/admin/fees";
import Residents from "@/pages/admin/residents";
import Flats from "@/pages/admin/flats";
import PageManagement from "@/pages/admin/page-management";
import Settings from "@/pages/admin/settings";
import MaintenanceRequests from "@/pages/admin/maintenance-requests";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hizmetler" component={Services} />
      <Route path="/hakkimizda" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/iletisim" component={Contact} />
      <Route path="/auth" component={Auth} />
      <Route path="/admin" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/binalar" component={() => <ProtectedRoute><Buildings /></ProtectedRoute>} />
      <Route path="/admin/daireler" component={() => <ProtectedRoute><Flats /></ProtectedRoute>} />
      <Route path="/admin/sakinler" component={() => <ProtectedRoute><Residents /></ProtectedRoute>} />
      <Route path="/admin/aidatlar" component={() => <ProtectedRoute><Fees /></ProtectedRoute>} />
      <Route path="/admin/bakim-talepleri" component={() => <ProtectedRoute><MaintenanceRequests /></ProtectedRoute>} />
      <Route path="/admin/sayfa-yonetimi" component={() => <ProtectedRoute><PageManagement /></ProtectedRoute>} />
      <Route path="/admin/ayarlar" component={() => <ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
