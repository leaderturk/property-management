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
import { insertBuildingSchema, type Building, type InsertBuilding } from "@shared/schema";
import { Plus, Building2, Users, DollarSign, Edit, Trash2, ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Link } from "wouter";
import logoPath from "@assets/logo_1757939348101.png";

export default function Buildings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

  const { data: buildings, isLoading } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const form = useForm<InsertBuilding>({
    resolver: zodResolver(insertBuildingSchema),
    defaultValues: {
      name: "",
      address: "",
      totalFlats: 0,
      monthlyFee: "0",
      managerId: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBuilding) => {
      const response = await apiRequest("POST", "/api/buildings", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Bina başarıyla eklendi.",
      });
      setDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Bina eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBuilding> }) => {
      const response = await apiRequest("PUT", `/api/buildings/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Bina başarıyla güncellendi.",
      });
      setDialogOpen(false);
      setEditingBuilding(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Bina güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/buildings/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Bina başarıyla silindi.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Bina silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBuilding) => {
    if (editingBuilding) {
      updateMutation.mutate({ id: editingBuilding.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    form.reset({
      name: building.name,
      address: building.address,
      totalFlats: building.totalFlats,
      monthlyFee: building.monthlyFee,
      managerId: building.managerId,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu binayı silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('tr-TR');
  };

  return (
    <AdminLayout 
      title="Bina Yönetimi" 
      description="Binalarınızı yönetin, yeni binalar ekleyin ve mevcut binaları düzenleyin"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-building">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Bina Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingBuilding ? "Bina Düzenle" : "Yeni Bina Ekle"}
              </DialogTitle>
              <DialogDescription>
                {editingBuilding ? "Bina bilgilerini güncelleyin." : "Yeni bir bina eklemek için gerekli bilgileri doldurun."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bina Adı</FormLabel>
                      <FormControl>
                        <Input placeholder="Bina adını girin" {...field} data-testid="input-building-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input placeholder="Bina adresini girin" {...field} data-testid="input-building-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalFlats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Toplam Daire Sayısı</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Daire sayısını girin" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-building-flats"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aylık Aidat (₺)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Aylık aidat miktarını girin" 
                          {...field}
                          data-testid="input-building-fee"
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
                      setEditingBuilding(null);
                      form.reset();
                    }}
                    data-testid="button-cancel"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-building"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
        ) : buildings?.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Henüz bina bulunmuyor
            </h3>
            <p className="text-muted-foreground mb-6">
              İlk binanızı ekleyerek başlayın
            </p>
            <Button onClick={() => setDialogOpen(true)} data-testid="button-add-first-building">
              <Plus className="mr-2 h-4 w-4" />
              İlk Binanızı Ekleyin
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings?.map((building) => (
              <Card key={building.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{building.name}</CardTitle>
                      <CardDescription>{building.address}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(building)}
                        data-testid={`button-edit-${building.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(building.id)}
                        data-testid={`button-delete-${building.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {building.totalFlats} Daire
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        ₺{parseFloat(building.monthlyFee).toLocaleString('tr-TR')} / Ay
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {formatDate(building.createdAt!)}
                      </Badge>
                      <span className="text-xs text-muted-foreground" data-testid={`building-id-${building.id}`}>
                        ID: {building.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </AdminLayout>
  );
}
