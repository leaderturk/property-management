import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "Bina ve Site Yönetimi Nedir?",
      answer: "Bina ve site yönetimi, çok katlı yapıların ve site alanlarının profesyonel olarak yönetilmesi hizmetidir. Bu hizmet kapsamında aidat toplama, bakım-onarım, güvenlik, temizlik ve genel alan yönetimi yer alır."
    },
    {
      question: "Şirketiniz Hangi Tür Mülkleri Yönetiyor?",
      answer: "Konut siteleri, işyeri kompleksleri, karma kullanımlı binalar, ofis binaları ve ticari merkezler dahil olmak üzere her türlü çok katlı yapının yönetimini gerçekleştiriyoruz."
    },
    {
      question: "Mülk Yönetimi Neden Önemlidir?",
      answer: "Profesyonel mülk yönetimi, binanızın değerini korur, yasal uyumu sağlar, sakinlerin yaşam kalitesini artırır ve mülk sahiplerinin yükünü hafifletir. Ayrıca düzenli bakım ile uzun vadeli maliyetleri düşürür."
    },
    {
      question: "Bina ve Site Yönetimi Hizmetleriniz Neleri Kapsar?",
      answer: "Hizmetlerimiz; aidat toplama, muhasebe, hukuki danışmanlık, bakım-onarım koordinasyonu, güvenlik, temizlik, sigorta işlemleri, toplantı organizasyonu ve 7/24 acil durum müdahalesini kapsar."
    },
    {
      question: "Nasıl Hizmet Alabilirim?",
      answer: "İletişim sayfamızdaki formu doldurarak veya doğrudan telefon ile bize ulaşabilirsiniz. Uzman ekibimiz sizinle görüşerek ihtiyaçlarınızı değerlendirecek ve özel bir teklif sunacaktır."
    },
    {
      question: "Müşteri Memnuniyeti Garantiniz Var mı?",
      answer: "Evet, %90 başarı oranımız ve referanslarımızla desteklenen hizmet kalitemizden eminiz. Düzenli raporlama ve şeffaf iletişim ile müşteri memnuniyetini her zaman önceliğimiz olarak görüyoruz."
    },
    {
      question: "Ücretlendirme Nasıl Yapılır?",
      answer: "Ücretlendirmemiz bina büyüklüğü, daire sayısı ve talep edilen hizmet kapsamına göre belirlenir. Şeffaf fiyatlandırma politikamız ile gizli maliyet olmadan hizmet veriyoruz."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xl text-muted-foreground">Merak ettiklerinizin cevapları burada</p>
        </div>
        
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <Card key={index} className="border border-border">
              <Button
                variant="ghost"
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent transition-colors h-auto"
                onClick={() => toggleFAQ(index)}
                data-testid={`button-faq-${index}`}
              >
                <span className="font-semibold text-foreground text-left flex-1">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
                )}
              </Button>
              {openIndex === index && (
                <CardContent className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
