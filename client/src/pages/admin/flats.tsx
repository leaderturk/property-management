import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertFlatSchema, type Flat, type InsertFlat, type Building } from "@shared/schema";
import { Plus, Home, Building2, Users, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

export default function Flats() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null);

  const { data: flats, isLoading: flatsLoading } = useQuery<Flat[]>({
    queryKey: ["/api/flats"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const form = useForm<InsertFlat>({
    resolver: zodResolver(insertFlatSchema),
    defaultValues: {
      buildingId: "",
      flatNumber: "",
      block: "",
      size: 0,
      residentId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFlat) => {
      const response = await apiRequest("POST", "/api/flats", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Daire başarıyla eklendi.",
      });
      setDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/flats"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Daire eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertFlat> }) => {
      const response = await apiRequest("PUT", `/api/flats/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Daire başarıyla güncellendi.",
      });
      setDialogOpen(false);
      setEditingFlat(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/flats"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Daire güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/flats/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Daire başarıyla silindi.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/flats"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Daire silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFlat) => {
    if (editingFlat) {
      updateMutation.mutate({ id: editingFlat.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (flat: Flat) => {
    setEditingFlat(flat);
    form.reset({
      buildingId: flat.buildingId,
      flatNumber: flat.flatNumber,
      block: flat.block || "",
      size: flat.size || 0,
      residentId: flat.residentId || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu daireyi silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const getBuildingName = (buildingId: string) => {
    const building = buildings?.find(b => b.id === buildingId);
    return building?.name || "Bina Bulunamadı";
  };

  return (
    <AdminLayout 
      title="Daire Yönetimi" 
      description="Daireleri yönetin, yeni daireler ekleyin ve mevcut daireleri düzenleyin"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-flat">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Daire Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingFlat ? "Daire Düzenle" : "Yeni Daire Ekle"}
              </DialogTitle>
              <DialogDescription>
                {editingFlat ? "Daire bilgilerini güncelleyin." : "Yeni bir daire eklemek için gerekli bilgileri doldurun."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="buildingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bina</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-building">
                            <SelectValue placeholder="Bina seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {buildings?.map((building) => (
                            <SelectItem key={building.id} value={building.id}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daire Numarası</FormLabel>
                      <FormControl>
                        <Input placeholder="Daire numarasını girin" {...field} data-testid="input-flat-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="block"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blok (Opsiyonel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Blok adını girin" {...field} data-testid="input-flat-block" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boyut (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Daire boyutunu girin" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-flat-size"
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
                      setEditingFlat(null);
                      form.reset();
                    }}
                    data-testid="button-cancel"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-flat"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Daire</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flats?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dolu Daire</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {flats?.filter(f => f.residentId).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Boş Daire</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {flats?.filter(f => !f.residentId).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Bina</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildings?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Flats List */}
      {flatsLoading ? (
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
      ) : flats?.length === 0 ? (
        <div className="text-center py-16">
          <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Henüz daire bulunmuyor
          </h3>
          <p className="text-muted-foreground mb-6">
            İlk dairenizi ekleyerek başlayın
          </p>
          <Button onClick={() => setDialogOpen(true)} data-testid="button-add-first-flat">
            <Plus className="mr-2 h-4 w-4" />
            İlk Dairenizi Ekleyin
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flats?.map((flat) => (
            <Card key={flat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {flat.block ? `${flat.block} Blok ` : ""}Daire {flat.flatNumber}
                  </CardTitle>
                  <Badge variant={flat.residentId ? "default" : "secondary"}>
                    {flat.residentId ? "Dolu" : "Boş"}
                  </Badge>
                </div>
                <CardDescription>
                  {getBuildingName(flat.buildingId)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {flat.size && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Boyut:</strong> {flat.size} m²
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    <strong>Durum:</strong> {flat.residentId ? "Kiracı mevcut" : "Boş daire"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(flat)}
                    data-testid={`button-edit-flat-${flat.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(flat.id)}
                    data-testid={`button-delete-flat-${flat.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}