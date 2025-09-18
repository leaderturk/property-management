import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function ContactForm() {
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
      content: "+90 501 042 18 64"
    },
    {
      icon: Mail,
      title: "E-posta",
      content: "info@matbinayonetimi.com.tr"
    },
    {
      icon: MapPin,
      title: "Adres",
      content: "Özkar İş Merkezi Melikgazi / KAYSERİ"
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      content: "Pazartesi-Cuma 08:30 - 17:00"
    }
  ];

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
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
                    <div className="text-muted-foreground">{info.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-2xl">Ücretsiz Teklif Formu</CardTitle>
              <CardDescription>
                Sorularınız veya yardım ihtiyacınız varsa, lütfen bize ulaşın. 
                Size hizmet etmekten memnuniyet duyarız.
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
                              data-testid="input-home-contact-name"
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
                              data-testid="input-home-contact-phone"
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
                            data-testid="input-home-contact-email"
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
                            <SelectTrigger data-testid="select-home-contact-service">
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
                            data-testid="textarea-home-contact-message"
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
                    data-testid="button-submit-home-contact"
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
  );
}
