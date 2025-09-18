import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star } from "lucide-react";

export default function About() {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                Huzurlu Yaşam 
                <span className="text-primary block">Profesyonel Yönetim</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Şirketimiz, Kayseri'de bina ve site yönetimi alanında liderdir. %90 başarı oranı 
                ve mükemmel kalite, işlerimizin temelini oluşturur. Deneyimli ekibimiz, 
                mülklerinizi en iyi şekilde yönetmek için uzmanlığa sahiptir.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Dürüstlük ve müşteri memnuniyeti, şirketimizin temel değerleridir. 
                Projelerimiz titizlikle yönetilir ve mülklerinizin değerini korumaya odaklanırız.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-buildings">100+</div>
                <div className="text-muted-foreground">Bina Yönetimi</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-success">%90</div>
                <div className="text-muted-foreground">Başarı Oranı</div>
              </div>
            </div>
            
            <Link href="/hakkimizda">
              <Button size="lg" data-testid="button-learn-more">
                Bizimle Tanışın
              </Button>
            </Link>
          </div>
          
          <div className="space-y-8">
            {/* Team Member Card */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200" 
                    alt="Professional portrait of Mert Bilgi, founder and partner" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-foreground mb-1">Mert Bilgi</h4>
                    <p className="text-primary font-medium mb-3">Kurucu Ortak</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Güzel Sanatlar Fakültesi'nde Resim mezunu ve iş dünyasının içinde yer alan biriyim. 
                      Gıda, otelcilik, mobilya ve otomotiv sektörlerinde deneyim sahibiyim.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Company Values */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 bg-card/50 rounded-lg p-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground">Güvenilirlik</h5>
                  <p className="text-sm text-muted-foreground">Mülklerinizi güvende tutuyoruz</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-card/50 rounded-lg p-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground">Kalite</h5>
                  <p className="text-sm text-muted-foreground">Mükemmel hizmet standardı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
