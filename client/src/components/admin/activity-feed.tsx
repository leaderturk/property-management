import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Wrench, UserPlus, AlertCircle } from "lucide-react";
import type { MaintenanceRequest, FeePayment } from "@shared/schema";

export default function ActivityFeed() {
  const { data: maintenanceRequests } = useQuery<MaintenanceRequest[]>({
    queryKey: ["/api/maintenance-requests"],
  });

  const { data: feePayments } = useQuery<FeePayment[]>({
    queryKey: ["/api/fee-payments"],
  });

  // Create mock recent activities since we don't have a real activity log
  const recentActivities = [
    {
      id: 1,
      type: "payment",
      message: "Aidat ödemesi alındı",
      detail: "Blok A Daire 12 - 2 dakika önce",
      icon: CheckCircle,
      color: "green"
    },
    {
      id: 2,
      type: "maintenance",
      message: "Bakım talebi oluşturuldu",
      detail: "Blok B Daire 8 - 15 dakika önce",
      icon: Wrench,
      color: "blue"
    },
    {
      id: 3,
      type: "resident",
      message: "Yeni sakin kaydı",
      detail: "Blok C Daire 15 - 1 saat önce",
      icon: UserPlus,
      color: "orange"
    },
    {
      id: 4,
      type: "alert",
      message: "Ödeme hatırlatması gönderildi",
      detail: "25 daire için - 2 saat önce",
      icon: AlertCircle,
      color: "red"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-600";
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "orange":
        return "bg-orange-100 text-orange-600";
      case "red":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Son Aktiviteler</h2>
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <Card key={activity.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(activity.color)}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
