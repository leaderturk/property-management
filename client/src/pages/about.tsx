import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Star, Award, Users, Building, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Huzurlu Yaşam 
                  <span className="text-primary block">Profesyonel Yönetim</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Şirketimiz, Kayseri'de bina ve site yönetimi alanında liderdir. %90 başarı oranı 
                  ve mükemmel kalite, işlerimizin temelini oluşturur.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100+</div>
                  <div className="text-muted-foreground">Bina Yönetimi</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">%90</div>
                  <div className="text-muted-foreground">Başarı Oranı</div>
                </div>
              </div>
              
              <Button size="lg" data-testid="button-contact-us">
                Bizimle İletişime Geçin
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=800" 
                alt="Modern building complex representing professional property management" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Şirket Hikayemiz
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  ALQ Bina ve Mülk Yönetimi, Kayseri'de bina yönetimi sektöründe köklü bir deneyime sahiptir. 
                  Kurulduğumuz günden bu yana, mülk sahipleri ve sakinlerine en kaliteli hizmeti sunma 
                  misyonuyla çalışmaktayız.
                </p>
                <p>
                  Deneyimli ekibimiz ve modern yönetim anlayışımızla, her projede mükemmeliyeti hedefliyoruz. 
                  Güvenilirlik, şeffaflık ve müşteri memnuniyeti temel değerlerimizdir.
                </p>
                <p>
                  Bugün 100'den fazla bina ve site yönetimi ile Kayseri'nin en güvenilen bina yönetim 
                  şirketlerinden biri haline gelmiş bulunmaktayız.
                </p>
              </div>
            </div>
            
            {/* Team Member Card */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="Professional portrait of Mert Bilgi, founder and partner" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-foreground mb-1">Mert Bilgi</h4>
                    <p className="text-primary font-medium mb-3">Kurucu Ortak</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Güzel Sanatlar Fakültesi'nde Resim mezunu ve iş dünyasının içinde yer alan biriyim. 
                      Gıda, otelcilik, mobilya ve otomotiv sektörlerinde deneyim sahibiyim. Şu an kendi 
                      şirketim ALQ Profesyonel Bina ve Site Yönetimi'nin kurucu ortağı olarak çalışıyorum.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              İş yapış şeklimizi ve müşteri ilişkilerimizi yönlendiren temel değerlerimiz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift text-center">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Güvenilirlik</h3>
                <p className="text-muted-foreground">
                  Mülklerinizi güvende tutmak ve sözümüzde durmak en önemli önceliğimizdir.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift text-center">
              <CardContent className="p-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Kalite</h3>
                <p className="text-muted-foreground">
                  Her projede mükemmel hizmet standardını yakalamak için titizlikle çalışırız.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift text-center">
              <CardContent className="p-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Profesyonellik</h3>
                <p className="text-muted-foreground">
                  Uzman ekibimiz ve modern yönetim anlayışımızla profesyonel hizmet sunuyoruz.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift text-center">
              <CardContent className="p-8">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Müşteri Odaklılık</h3>
                <p className="text-muted-foreground">
                  Müşteri memnuniyeti her kararımızın merkezinde yer alır.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift text-center">
              <CardContent className="p-8">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Deneyim</h3>
                <p className="text-muted-foreground">
                  Yılların verdiği deneyimle her zorluğun üstesinden geliyoruz.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift text-center">
              <CardContent className="p-8">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Sürekli İyileşme</h3>
                <p className="text-muted-foreground">
                  Hizmet kalitemizi sürekli geliştirmek için çalışmaya devam ediyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <Card className="hover-lift">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Misyonumuz</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kayseri'de yaşayan insanların daha huzurlu ve güvenli yaşam alanlarına sahip olmalarını 
                  sağlamak, mülk sahiplerine değer katacak profesyonel yönetim hizmetleri sunmak ve 
                  sektörde örnek teşkil edecek kalitede hizmet vermektir.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Vizyonumuz</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Türkiye'nin en güvenilen bina yönetim şirketlerinden biri olmak, teknoloji ve 
                  insani değerleri harmanlayarak sektörde standartları belirleyen öncü bir kurum 
                  haline gelmektir.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
