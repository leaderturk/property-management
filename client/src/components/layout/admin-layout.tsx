import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/auth-context";
import { useEffect } from "react";
import logoPath from "@assets/logo_1757939348101.png";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  DollarSign, 
  Wrench, 
  FileText, 
  Settings,
  Home,
  LogOut
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "Bina Yönetimi",
    items: [
      {
        title: "Binalar",
        href: "/admin/binalar", 
        icon: Building2
      },
      {
        title: "Daireler",
        href: "/admin/daireler",
        icon: Home
      }
    ]
  },
  {
    title: "İnsan Kaynakları",
    items: [
      {
        title: "Sakinler",
        href: "/admin/sakinler",
        icon: Users
      }
    ]
  },
  {
    title: "Finansal Yönetim",
    items: [
      {
        title: "Aidatlar",
        href: "/admin/aidatlar",
        icon: DollarSign
      }
    ]
  },
  {
    title: "Sistem Yönetimi",
    items: [
      {
        title: "Bakım Talepleri", 
        href: "/admin/bakim-talepleri",
        icon: Wrench
      },
      {
        title: "Sayfa Yönetimi",
        href: "/admin/sayfa-yonetimi", 
        icon: FileText
      },
      {
        title: "Ayarlar",
        href: "/admin/ayarlar",
        icon: Settings
      }
    ]
  }
];

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated, logoutMutation } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/auth");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Show access denied if authenticated but not admin
  if (isAuthenticated && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Settings className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Erişim Reddedildi</h1>
            <p className="text-muted-foreground mb-4">
              Bu sayfaya erişim için yönetici yetkisi gereklidir.
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-go-home">
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Return null if not authenticated (will redirect)
  if (!isAuthenticated || authLoading) {
    return null;
  }

  const isActiveLink = (href: string, exact = false) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={logoPath} alt="ALQ Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Hoşgeldin, {user?.firstName} {user?.lastName}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {logoutMutation.isPending ? "Çıkış yapılıyor..." : "Çıkış"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-4 space-y-6">
            {navigationItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.href ? (
                  // Single navigation item
                  <Link href={section.href}>
                    <Button
                      variant={isActiveLink(section.href, section.exact) ? "default" : "ghost"}
                      className="w-full justify-start"
                      data-testid={`nav-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <section.icon className="h-4 w-4 mr-3" />
                      {section.title}
                    </Button>
                  </Link>
                ) : (
                  // Section with sub-items
                  <>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items?.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActiveLink(item.href) ? "default" : "ghost"}
                            className="w-full justify-start pl-4"
                            size="sm"
                            data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                    {sectionIndex < navigationItems.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}