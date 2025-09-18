import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertResidentSchema, type Resident, type InsertResident, type Flat, type Building } from "@shared/schema";
import { Plus, Users, Mail, Phone, Edit, Trash2, MapPin } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function Residents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  const { data: residents, isLoading } = useQuery<Resident[]>({
    queryKey: ["/api/residents"],
  });

  const { data: flats } = useQuery<Flat[]>({
    queryKey: ["/api/flats"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const form = useForm<InsertResident>({
    resolver: zodResolver(insertResidentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertResident) => {
      const response = await apiRequest("POST", "/api/residents", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Sakin başarıyla eklendi.",
      });
      setDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/residents"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Sakin eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertResident> }) => {
      const response = await apiRequest("PUT", `/api/residents/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Sakin başarıyla güncellendi.",
      });
      setDialogOpen(false);
      setEditingResident(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/residents"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Sakin güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/residents/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Sakin başarıyla silindi.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/residents"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Sakin silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertResident) => {
    if (editingResident) {
      updateMutation.mutate({ id: editingResident.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    form.reset({
      name: resident.name,
      email: resident.email || "",
      phone: resident.phone || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu sakini silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const getResidentFlat = (residentId: string) => {
    const flat = flats?.find(f => f.residentId === residentId);
    if (!flat) return null;
    
    const building = buildings?.find(b => b.id === flat.buildingId);
    return {
      flat,
      building,
      display: `${building?.name || "Bina"} - ${flat.block ? flat.block + " Blok " : ""}Daire ${flat.flatNumber}`
    };
  };

  const stats = {
    total: residents?.length || 0,
    withEmail: residents?.filter(r => r.email).length || 0,
    withPhone: residents?.filter(r => r.phone).length || 0,
    withFlat: residents?.filter(r => flats?.some(f => f.residentId === r.id)).length || 0
  };

  return (
    <AdminLayout 
      title="Sakin Yönetimi" 
      description="Tüm sakinleri görüntüleyin ve yönetin"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-resident">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Sakin Ekle
            </Button>
          </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingResident ? "Sakin Düzenle" : "Yeni Sakin Ekle"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingResident ? "Sakin bilgilerini güncelleyin." : "Yeni bir sakin eklemek için gerekli bilgileri doldurun."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad Soyad</FormLabel>
                          <FormControl>
                            <Input placeholder="Ad soyad girin" {...field} data-testid="input-resident-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="E-posta adresi girin" 
                              {...field} 
                              value={field.value || ""}
                              data-testid="input-resident-email"
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
                              placeholder="Telefon numarası girin" 
                              {...field} 
                              value={field.value || ""}
                              data-testid="input-resident-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDialogOpen(false);
                          setEditingResident(null);
                          form.reset();
                        }}
                        data-testid="button-cancel"
                      >
                        İptal
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-save-resident"
                      >
                        {createMutation.isPending || updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Toplam Sakin</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-residents">{stats.total}</p>
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">E-posta Var</p>
                  <p className="text-2xl font-bold text-green-600" data-testid="stat-with-email">{stats.withEmail}</p>
                </div>
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Telefon Var</p>
                  <p className="text-2xl font-bold text-orange-600" data-testid="stat-with-phone">{stats.withPhone}</p>
                </div>
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Dairesi Var</p>
                  <p className="text-2xl font-bold text-primary" data-testid="stat-with-flat">{stats.withFlat}</p>
                </div>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : residents?.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Henüz sakin bulunmuyor
            </h3>
            <p className="text-muted-foreground mb-6">
              İlk sakininizi ekleyerek başlayın
            </p>
            <Button onClick={() => setDialogOpen(true)} data-testid="button-add-first-resident">
              <Plus className="mr-2 h-4 w-4" />
              İlk Sakininizi Ekleyin
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residents?.map((resident) => {
              const flatInfo = getResidentFlat(resident.id);
              return (
                <Card key={resident.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resident.name}</CardTitle>
                        {flatInfo && (
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {flatInfo.display}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(resident)}
                          data-testid={`button-edit-${resident.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(resident.id)}
                          data-testid={`button-delete-${resident.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resident.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">
                            {resident.email}
                          </span>
                        </div>
                      )}
                      {resident.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {resident.phone}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {formatDate(resident.createdAt!)}
                        </Badge>
                        <span className="text-xs text-muted-foreground" data-testid={`resident-id-${resident.id}`}>
                          ID: {resident.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
    </AdminLayout>
  );
}
