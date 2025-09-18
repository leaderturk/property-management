import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Home, CheckCircle, Clock } from "lucide-react";

interface DashboardStats {
  totalBuildings: number;
  totalFlats: number;
  paymentRate: number;
  pendingMaintenance: number;
  totalRevenue: number;
}

interface StatsGridProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const statItems = [
    {
      icon: Home,
      label: "Toplam Daire",
      value: stats?.totalFlats || 0,
      color: "blue"
    },
    {
      icon: CheckCircle,
      label: "Ödenen Aidat",
      value: `${stats?.paymentRate || 0}%`,
      color: "green"
    },
    {
      icon: Building,
      label: "Toplam Bina",
      value: stats?.totalBuildings || 0,
      color: "purple"
    },
    {
      icon: Clock,
      label: "Bakım Talepleri",
      value: stats?.pendingMaintenance || 0,
      color: "red"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "green":
        return "bg-green-100 text-green-600";
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "red":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getValueColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "red":
        return "text-red-600";
      default:
        return "text-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <Card key={index} className="stat-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${getValueColor(stat.color)}`} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
