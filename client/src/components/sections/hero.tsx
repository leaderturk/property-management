import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Building, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-hero py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Sizin için bina yönetimini 
                <span className="text-primary block">yeniden tanımlıyoruz</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Yenilikçi çözümlerimizle sıkıntısız bir yaşam alanı oluşturmak için buradayız. 
                Size daha fazla zaman, konfor ve güvence sağlamak için çalışıyoruz.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/iletisim">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                  data-testid="button-get-quote"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Ücretsiz Teklif Al
                </Button>
              </Link>
              <a 
                href="https://superapp.aidatim.com/auth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-border text-foreground hover:bg-accent w-full sm:w-auto"
                  data-testid="button-online-payment"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Online Ödeme
                </Button>
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <span>100+ Bina Yönetimi</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>%90 Başarı Oranı</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-in-right">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=800" 
              alt="Modern building complex representing professional property management" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
