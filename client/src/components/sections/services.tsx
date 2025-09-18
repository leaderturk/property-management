import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserCog, Calculator, Gavel, Clock, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: UserCog,
      title: "Yönetim Danışmanlığı",
      description: "Mülklerinizi en iyi şekilde yönetmek ve kiracı ilişkilerini sürdürmek için buradayız."
    },
    {
      icon: Calculator,
      title: "Muhasebe İşlerinin Tabiki",
      description: "Bütçenizi oluşturur, faturalarınızı takip eder ve finansal konularda size rehberlik ederiz."
    },
    {
      icon: Gavel,
      title: "Hukuki Danışmanlık",
      description: "Yasal ve yerel düzenlemelere uyum sağlayarak hukuki süreçleri ve sorunları ele alırız."
    },
    {
      icon: Clock,
      title: "7/24 Ödeme Kolaylığı",
      description: "Ödeme yapmak artık daha işlevsel ve daha kolay. İşlemlerinizi istediğiniz şekilde yapmanızı sağlıyoruz."
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Çeşitli üst düzey hizmetler sunuyoruz
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bina ve site yönetimi konusunda uzman ekibimiz, mülkiyetinizin ve işyerinizin 
            sorunsuz ve güvende olmasını sağlamak için burada.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-background rounded-xl p-8 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover-lift"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <Button 
                variant="ghost" 
                className="text-primary font-medium hover:text-primary/80 transition-colors p-0 h-auto group-hover:translate-x-1"
                data-testid={`button-service-${index}`}
              >
                Daha Fazla Bilgi 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/hizmetler">
            <Button size="lg" data-testid="button-all-services">
              Tüm Hizmetlerimiz
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
