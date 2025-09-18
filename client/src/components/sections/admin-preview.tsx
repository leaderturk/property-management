import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, DollarSign, Users, BarChart3, Plus, FileText, UserPlus } from "lucide-react";

export default function AdminPreview() {
  const stats = [
    {
      icon: Building,
      label: "Toplam Daire",
      value: "485",
      color: "blue"
    },
    {
      icon: DollarSign,
      label: "Ödenen Aidat",
      value: "%87",
      color: "green"
    },
    {
      icon: Users,
      label: "Bekleyen",
      value: "63",
      color: "orange"
    },
    {
      icon: BarChart3,
      label: "Bakım Talepleri",
      value: "12",
      color: "red"
    }
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Yeni Daire",
      subtitle: "Ekle",
      color: "primary"
    },
    {
      icon: FileText,
      title: "Aidat Faturası",
      subtitle: "Oluştur",
      color: "blue"
    },
    {
      icon: BarChart3,
      title: "Rapor",
      subtitle: "Görüntüle",
      color: "green"
    },
    {
      icon: UserPlus,
      title: "Sakinler",
      subtitle: "Yönet",
      color: "purple"
    }
  ];

  const activities = [
    {
      type: "payment",
      message: "Aidat ödemesi alındı",
      detail: "Blok A Daire 12 - 2 dakika önce",
      color: "green"
    },
    {
      type: "maintenance",
      message: "Bakım talebi oluşturuldu",
      detail: "Blok B Daire 8 - 15 dakika önce",
      color: "blue"
    },
    {
      type: "resident",
      message: "Yeni sakin kaydı",
      detail: "Blok C Daire 15 - 1 saat önce",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "green":
        return "bg-green-100 text-green-600";
      case "orange":
        return "bg-orange-100 text-orange-600";
      case "red":
        return "bg-red-100 text-red-600";
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "primary":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Yönetici <span className="text-primary">Paneli</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bina yönetimi, aidat takibi ve sakin yönetimi için gelişmiş panel sistemi
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-background border border-border rounded-xl p-8 shadow-lg">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-1">Dashboard</h3>
              <p className="text-muted-foreground">Genel bakış ve hızlı erişim</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <span className="text-primary font-medium">Aktif Binalar: 24</span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-700 font-medium">Bu Ay: ₺156,750</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="stat-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold ${
                        stat.color === "green" ? "text-green-600" : 
                        stat.color === "orange" ? "text-orange-600" :
                        stat.color === "red" ? "text-red-600" :
                        "text-foreground"
                      }`}>
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

          {/* Quick Actions & Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Hızlı İşlemler</h4>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    className={`p-4 h-auto text-left justify-start ${getButtonClasses(action.color)}`}
                    data-testid={`button-preview-action-${index}`}
                  >
                    <div className="flex flex-col items-start">
                      <action.icon className="h-5 w-5 mb-2" />
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm opacity-90">{action.subtitle}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Son Aktiviteler</h4>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(activity.color)}`}>
                      {activity.type === "payment" && <DollarSign className="h-4 w-4" />}
                      {activity.type === "maintenance" && <BarChart3 className="h-4 w-4" />}
                      {activity.type === "resident" && <UserPlus className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Management Modules */}
          <div className="mt-12">
            <h4 className="text-lg font-semibold text-foreground mb-6">Yönetim Modülleri</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-lift border-border">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <h5 className="font-semibold text-foreground mb-2">Bina Yönetimi</h5>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bina ve daire bilgileri, bakım takibi, güvenlik
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80 text-sm p-0 h-auto"
                    data-testid="button-preview-buildings"
                  >
                    Modüle Git →
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover-lift border-border">
                <CardContent className="p-6">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h5 className="font-semibold text-foreground mb-2">Aidat Takibi</h5>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ödeme takibi, fatura oluşturma, borç yönetimi
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80 text-sm p-0 h-auto"
                    data-testid="button-preview-fees"
                  >
                    Modüle Git →
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover-lift border-border">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h5 className="font-semibold text-foreground mb-2">Sakin Yönetimi</h5>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sakin bilgileri, iletişim, duyurular
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80 text-sm p-0 h-auto"
                    data-testid="button-preview-residents"
                  >
                    Modüle Git →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/admin">
              <Button size="lg" data-testid="button-goto-admin">
                Yönetici Paneline Git
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
