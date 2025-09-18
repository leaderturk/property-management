import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsGrid from "@/components/admin/stats-grid";
import ActivityFeed from "@/components/admin/activity-feed";
import QuickActions from "@/components/admin/quick-actions";
import AdminLayout from "@/components/layout/admin-layout";
import { Building, Users, DollarSign } from "lucide-react";

interface DashboardStats {
  totalBuildings: number;
  totalFlats: number;
  paymentRate: number;
  pendingMaintenance: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <AdminLayout 
      title="Dashboard" 
      description="Genel bakış ve hızlı erişim"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          {!statsLoading && stats && (
            <>
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <span className="text-primary font-medium">
                  Aktif Binalar: {stats.totalBuildings}
                </span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-700 font-medium">
                  Bu Ay: ₺{stats.totalRevenue.toLocaleString('tr-TR')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} isLoading={statsLoading} />

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <QuickActions />
        <ActivityFeed />
      </div>

      {/* Management Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Yönetim Modülleri</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Building Management Module */}
          <Card className="hover-lift border-border">
            <CardContent className="p-6">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg mb-2">Bina Yönetimi</CardTitle>
              <CardDescription className="mb-4">
                Bina ve daire bilgileri, bakım takibi, güvenlik
              </CardDescription>
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-primary hover:text-primary/80"
                data-testid="button-goto-buildings"
                onClick={() => setLocation("/admin/binalar")}
              >
                Modüle Git →
              </Button>
            </CardContent>
          </Card>
          
          {/* Fee Tracking Module */}
          <Card className="hover-lift border-border">
            <CardContent className="p-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg mb-2">Aidat Takibi</CardTitle>
              <CardDescription className="mb-4">
                Ödeme takibi, fatura oluşturma, borç yönetimi
              </CardDescription>
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-primary hover:text-primary/80"
                data-testid="button-goto-fees"
                onClick={() => setLocation("/admin/aidatlar")}
              >
                Modüle Git →
              </Button>
            </CardContent>
          </Card>
          
          {/* Resident Management Module */}
          <Card className="hover-lift border-border">
            <CardContent className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg mb-2">Sakin Yönetimi</CardTitle>
              <CardDescription className="mb-4">
                Sakin bilgileri, iletişim, duyurular
              </CardDescription>
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-primary hover:text-primary/80"
                data-testid="button-goto-residents"
                onClick={() => setLocation("/admin/sakinler")}
              >
                Modüle Git →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
