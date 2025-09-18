import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactRequestSchema, type InsertContactRequest } from "@shared/schema";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const formSchema = insertContactRequestSchema.extend({
  serviceType: insertContactRequestSchema.shape.serviceType.optional(),
});

type FormData = {
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  message: string;
};

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactRequest) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    contactMutation.mutate(data as InsertContactRequest);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      content: "+90 501 042 18 64",
      href: "tel:+905010421864"
    },
    {
      icon: Mail,
      title: "E-posta",
      content: "info@matbinayonetimi.com.tr",
      href: "mailto:info@matbinayonetimi.com.tr"
    },
    {
      icon: MapPin,
      title: "Adres",
      content: "Özkar İş Merkezi Melikgazi / KAYSERİ",
      href: "https://maps.app.goo.gl/zJFx6yEYQ5xv8Epu6"
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      content: "Pazartesi-Cuma 08:30 - 17:00",
      href: null
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
              İletişim
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Sorularınız veya yardım ihtiyacınız varsa, lütfen bize ulaşın. 
              Size hizmet etmekten memnuniyet duyarız.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Hızlı ve Özelleştirilmiş 
                  <span className="text-primary block">Teklif Alın!</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Mülk yönetimi ve hizmetlerimiz hakkında daha fazla bilgi almak veya 
                  özel bir teklif talep etmek isterseniz, lütfen formu doldurun.
                </p>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{info.title}</div>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          target={info.href.startsWith('http') ? '_blank' : undefined}
                          rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          data-testid={`link-contact-${info.title.toLowerCase()}`}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <div className="text-muted-foreground">{info.content}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.7751234567!2d35.4786!3d38.7312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQzJzUyLjMiTiAzNcKwMjgnNDMuMCJF!5e0!3m2!1str!2str!4v1234567890"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ALQ Bina ve Mülk Yönetimi Lokasyonu"
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl">Ücretsiz Teklif Formu</CardTitle>
                <CardDescription>
                  Formu doldurduktan sonra, uzman ekibimiz talebinizi inceleyecek ve 
                  size en uygun çözümü sunmak için iletişime geçecektir.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad Soyad *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Adınız ve soyadınız" 
                                {...field}
                                data-testid="input-contact-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Telefon numaranız" 
                                {...field}
                                data-testid="input-contact-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="E-posta adresiniz" 
                              {...field}
                              data-testid="input-contact-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hizmet Türü</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-contact-service">
                                <SelectValue placeholder="Hizmet türünü seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Bina Yönetimi">Bina Yönetimi</SelectItem>
                              <SelectItem value="Site Yönetimi">Site Yönetimi</SelectItem>
                              <SelectItem value="Muhasebe Hizmetleri">Muhasebe Hizmetleri</SelectItem>
                              <SelectItem value="Hukuki Danışmanlık">Hukuki Danışmanlık</SelectItem>
                              <SelectItem value="Diğer">Diğer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mesajınız *</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={4}
                              placeholder="Lütfen ihtiyaçlarınızı detaylı olarak açıklayın..."
                              {...field}
                              data-testid="textarea-contact-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                      data-testid="button-submit-contact"
                    >
                      {isSubmitting ? (
                        "Gönderiliyor..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Teklif Talebini Gönder
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-alq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Acil Durumlar İçin 7/24 Hizmet
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Acil bakım ve onarım ihtiyaçlarınız için her zaman ulaşabilirsiniz
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
            data-testid="button-emergency-contact"
          >
            <Phone className="mr-2 h-5 w-5" />
            Acil Durum Hattı: +90 501 042 18 64
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
