import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Calculator, Gavel, Clock, Building, Shield, Star, CheckCircle } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: UserCog,
      title: "Yönetim Danışmanlığı",
      description: "Mülklerinizi en iyi şekilde yönetmek ve kiracı ilişkilerini sürdürmek için buradayız.",
      features: [
        "Profesyonel mülk yönetimi",
        "Kiracı ilişkileri yönetimi",
        "Yıllık bakım planlaması",
        "Acil durum müdahale",
        "Düzenli raporlama"
      ]
    },
    {
      icon: Calculator,
      title: "Muhasebe İşlerinin Tabiki",
      description: "Bütçenizi oluşturur, faturalarınızı takip eder ve finansal konularda size rehberlik ederiz.",
      features: [
        "Aidat toplama ve takibi",
        "Gelir-gider raporları",
        "Vergi danışmanlığı",
        "Bütçe planlaması",
        "Finansal analiz"
      ]
    },
    {
      icon: Gavel,
      title: "Hukuki Danışmanlık",
      description: "Yasal ve yerel düzenlemelere uyum sağlayarak hukuki süreçleri ve sorunları ele alırız.",
      features: [
        "Kat mülkiyeti hukuku",
        "Sözleşme hazırlama",
        "Tahsilat takibi",
        "Yasal uyumluluk",
        "Dava süreçleri"
      ]
    },
    {
      icon: Clock,
      title: "7/24 Ödeme Kolaylığı",
      description: "Ödeme yapmak artık daha işlevsel ve daha kolay. İşlemlerinizi istediğiniz şekilde yapmanızı sağlıyoruz.",
      features: [
        "Online ödeme sistemi",
        "Mobil uygulama",
        "Kredi kartı ile ödeme",
        "Otomatik tahsilat",
        "SMS bilgilendirme"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Hizmetlerimiz
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bina ve site yönetimi konusunda uzman ekibimiz, mülkiyetinizin ve işyerinizin 
              sorunsuz ve güvende olmasını sağlamak için burada.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift border-border">
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" data-testid={`button-service-${index}`}>
                    Detaylı Bilgi Al
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Neden ALQ'yu Tercih Etmelisiniz?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deneyimli ekibimiz ve modern yaklaşımımızla fark yaratıyoruz
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">100+ Bina Yönetimi</h3>
              <p className="text-muted-foreground">
                Kayseri'de 100'den fazla bina ve site yönetimi deneyimi
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">%90 Başarı Oranı</h3>
              <p className="text-muted-foreground">
                Müşteri memnuniyeti ve proje başarısında yüksek performans
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Güvenilir Hizmet</h3>
              <p className="text-muted-foreground">
                Mülklerinizi güvende tutmak için 7/24 hizmet anlayışı
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-alq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Hizmetlerimiz Hakkında Daha Fazla Bilgi Almak İster misiniz?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Uzman ekibimiz size özel çözümler sunmak için hazır
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              data-testid="button-get-quote"
            >
              Ücretsiz Teklif Al
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              data-testid="button-contact"
            >
              İletişime Geç
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
