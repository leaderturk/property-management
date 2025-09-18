import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertMaintenanceRequestSchema, type MaintenanceRequest, type Flat, type Building } from "@shared/schema";
import { Plus, Wrench, AlertCircle, CheckCircle, Clock, Filter, Edit } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

type CreateMaintenanceRequestData = {
  flatId: string;
  description: string;
  status: string;
  priority: string;
};

const statusOptions = [
  { value: "pending", label: "Bekliyor", color: "bg-yellow-100 text-yellow-800" },
  { value: "in-progress", label: "İşlemde", color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "Tamamlandı", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "İptal Edildi", color: "bg-red-100 text-red-800" }
];

const priorityOptions = [
  { value: "low", label: "Düşük", color: "bg-gray-100 text-gray-800" },
  { value: "medium", label: "Orta", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "Yüksek", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Acil", color: "bg-red-100 text-red-800" }
];

export default function MaintenanceRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const { data: maintenanceRequests, isLoading } = useQuery<MaintenanceRequest[]>({
    queryKey: ["/api/maintenance-requests"],
  });

  const { data: flats } = useQuery<Flat[]>({
    queryKey: ["/api/flats"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const form = useForm<CreateMaintenanceRequestData>({
    resolver: zodResolver(insertMaintenanceRequestSchema),
    defaultValues: {
      flatId: "",
      description: "",
      status: "pending",
      priority: "medium",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateMaintenanceRequestData) => {
      const response = await apiRequest("POST", "/api/maintenance-requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Bakım talebi başarıyla oluşturuldu.",
      });
      setDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Bakım talebi oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateMaintenanceRequestData> }) => {
      const response = await apiRequest("PUT", `/api/maintenance-requests/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Bakım talebi başarıyla güncellendi.",
      });
      setDialogOpen(false);
      setEditingRequest(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Bakım talebi güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateMaintenanceRequestData) => {
    if (editingRequest) {
      updateMutation.mutate({ id: editingRequest.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (request: MaintenanceRequest) => {
    setEditingRequest(request);
    form.reset({
      flatId: request.flatId,
      description: request.description,
      status: request.status,
      priority: request.priority,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRequest(null);
    form.reset();
  };

  const getFlatInfo = (flatId: string) => {
    const flat = flats?.find(f => f.id === flatId);
    if (!flat) return "Daire Bulunamadı";
    
    const building = buildings?.find(b => b.id === flat.buildingId);
    return `${building?.name || "Bina"} - ${flat.block ? flat.block + " Blok " : ""}Daire ${flat.flatNumber}`;
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find(s => s.value === status)?.label || status;
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityLabel = (priority: string) => {
    return priorityOptions.find(p => p.value === priority)?.label || priority;
  };

  const getPriorityColor = (priority: string) => {
    return priorityOptions.find(p => p.value === priority)?.color || "bg-gray-100 text-gray-800";
  };

  const filteredRequests = maintenanceRequests?.filter(request => {
    const statusMatch = filterStatus === "all" || request.status === filterStatus;
    const priorityMatch = filterPriority === "all" || request.priority === filterPriority;
    return statusMatch && priorityMatch;
  }) || [];

  const stats = {
    total: maintenanceRequests?.length || 0,
    pending: maintenanceRequests?.filter(r => r.status === "pending").length || 0,
    inProgress: maintenanceRequests?.filter(r => r.status === "in-progress").length || 0,
    completed: maintenanceRequests?.filter(r => r.status === "completed").length || 0
  };

  return (
    <AdminLayout 
      title="Bakım Talepleri" 
      description="Bakım taleplerini yönetin ve takip edin"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-maintenance-request">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Bakım Talebi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingRequest ? "Bakım Talebini Düzenle" : "Yeni Bakım Talebi"}
              </DialogTitle>
              <DialogDescription>
                {editingRequest ? "Bakım talebi bilgilerini güncelleyin." : "Yeni bir bakım talebi oluşturun."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="flatId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daire</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-flat">
                            <SelectValue placeholder="Daire seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {flats?.map((flat) => (
                            <SelectItem key={flat.id} value={flat.id}>
                              {getFlatInfo(flat.id)}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bakım talebinin detaylarını açıklayın..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Öncelik</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-priority">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durum</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-status">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    data-testid="button-cancel"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-request"
                  >
                    {(createMutation.isPending || updateMutation.isPending) 
                      ? (editingRequest ? "Güncelleniyor..." : "Oluşturuluyor...") 
                      : (editingRequest ? "Güncelle" : "Oluştur")
                    }
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
                <p className="text-muted-foreground text-sm">Toplam Talep</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">İşlemde</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex gap-4 flex-1">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Durum</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Öncelik</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-[80px]" />
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Bakım talebi bulunamadı
              </h3>
              <p className="text-muted-foreground">
                Henüz herhangi bir bakım talebi bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">{getFlatInfo(request.flatId)}</h3>
                      <Badge className={getPriorityColor(request.priority)} data-testid={`priority-${request.id}`}>
                        {getPriorityLabel(request.priority)}
                      </Badge>
                      <Badge className={getStatusColor(request.status)} data-testid={`status-${request.id}`}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3" data-testid={`description-${request.id}`}>
                      {request.description}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Oluşturulma: {new Date(request.createdAt!).toLocaleDateString('tr-TR')}
                      {request.resolvedAt && (
                        <span className="ml-4">
                          Çözüldü: {new Date(request.resolvedAt).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(request)}
                    data-testid={`button-edit-${request.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}