import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BarChart3, UserPlus } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      title: "Yeni Daire",
      subtitle: "Ekle",
      href: "/admin/binalar",
      color: "primary"
    },
    {
      icon: FileText,
      title: "Aidat Faturası",
      subtitle: "Oluştur",
      href: "/admin/aidatlar",
      color: "blue"
    },
    {
      icon: BarChart3,
      title: "Rapor",
      subtitle: "Görüntüle",
      href: "/admin",
      color: "green"
    },
    {
      icon: UserPlus,
      title: "Sakinler",
      subtitle: "Yönet",
      href: "/admin/sakinler",
      color: "purple"
    }
  ];

  const getButtonClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "green":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700 text-white";
      case "primary":
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Hızlı İşlemler</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Button
              className={`p-4 h-auto text-left justify-start w-full ${getButtonClasses(action.color)}`}
              data-testid={`button-quick-action-${index}`}
            >
              <div className="flex flex-col items-start">
                <action.icon className="h-5 w-5 mb-2" />
                <div className="font-medium">{action.title}</div>
                <div className="text-sm opacity-90">{action.subtitle}</div>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
