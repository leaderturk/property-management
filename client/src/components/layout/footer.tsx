import { Link } from "wouter";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import logoPath from "@assets/logo_1757939348101.png";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/hizmetler", label: "Hizmetler" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/blog", label: "Blog" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const services = [
    "Bina Yönetimi",
    "Site Yönetimi",
    "Muhasebe Hizmetleri",
    "Hukuki Danışmanlık",
    "7/24 Ödeme",
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logoPath} 
                alt="ALQ Logo" 
                className="h-12 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Kayseri'de profesyonel bina ve site yönetimi hizmetleri. 
              Mülklerinizi güvende tutmak için buradayız.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61551116466008" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-primary transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/matbinayonetimi/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-primary transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/matbinayonetimi/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-primary transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-background/80 hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold text-background mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-2 text-sm">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-background/80">{service}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">İletişim</h4>
            <div className="space-y-3 text-sm">
              <div className="text-background/80">
                Özkar İş Merkezi Melikgazi / KAYSERİ
              </div>
              <a 
                href="tel:+905010421864"
                className="text-background/80 hover:text-primary transition-colors block"
                data-testid="link-phone"
              >
                +90 501 042 18 64
              </a>
              <a 
                href="mailto:info@matbinayonetimi.com.tr"
                className="text-background/80 hover:text-primary transition-colors block"
                data-testid="link-email"
              >
                info@matbinayonetimi.com.tr
              </a>
              <div className="text-background/80">
                Pazartesi-Cuma 08:30-17:00
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2024 ALQ Bina ve Mülk Yönetimi. Tüm hakları saklıdır.
            </p>
            <a 
              href="https://erzurumweb.com.tr" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/60 hover:text-primary transition-colors text-sm flex items-center space-x-2"
              data-testid="link-erzurum-web"
            >
              <span>Web Tasarım:</span>
              <span className="font-medium">Erzurum Web</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
