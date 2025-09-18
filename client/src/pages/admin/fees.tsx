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
import { insertFeePaymentSchema, type FeePayment, type Flat, type Building } from "@shared/schema";
import { Plus, DollarSign, Calendar, CheckCircle, Clock, Filter } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

type CreateFeePaymentData = {
  flatId: string;
  amount: string;
  month: number;
  year: number;
  isPaid: boolean;
};

export default function Fees() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: feePayments, isLoading: paymentsLoading } = useQuery<FeePayment[]>({
    queryKey: ["/api/fee-payments"],
  });

  const { data: flats } = useQuery<Flat[]>({
    queryKey: ["/api/flats"],
  });

  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["/api/buildings"],
  });

  const form = useForm<CreateFeePaymentData>({
    resolver: zodResolver(insertFeePaymentSchema.omit({ paidAt: true })),
    defaultValues: {
      flatId: "",
      amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      isPaid: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateFeePaymentData) => {
      const response = await apiRequest("POST", "/api/fee-payments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Aidat kaydı başarıyla oluşturuldu.",
      });
      setDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/fee-payments"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Aidat kaydı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { isPaid: boolean; paidAt?: string | null } }) => {
      const response = await apiRequest("PUT", `/api/fee-payments/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Ödeme durumu güncellendi.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/fee-payments"] });
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Ödeme durumu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateFeePaymentData) => {
    createMutation.mutate(data);
  };

  const markAsPaid = (payment: FeePayment) => {
    updatePaymentMutation.mutate({
      id: payment.id,
      data: { isPaid: true, paidAt: new Date().toISOString() }
    });
  };

  const markAsUnpaid = (payment: FeePayment) => {
    updatePaymentMutation.mutate({
      id: payment.id,
      data: { isPaid: false, paidAt: null }
    });
  };

  const getMonthName = (month: number) => {
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return months[month - 1];
  };

  const filteredPayments = feePayments?.filter(payment => {
    if (filterStatus === "paid") return payment.isPaid;
    if (filterStatus === "unpaid") return !payment.isPaid;
    return true;
  }) || [];

  const getFlatInfo = (flatId: string) => {
    const flat = flats?.find(f => f.id === flatId);
    if (!flat) return "Daire Bulunamadı";
    
    const building = buildings?.find(b => b.id === flat.buildingId);
    return `${building?.name || "Bina"} - ${flat.block ? flat.block + " Blok " : ""}Daire ${flat.flatNumber}`;
  };

  const stats = {
    total: feePayments?.length || 0,
    paid: feePayments?.filter(p => p.isPaid).length || 0,
    unpaid: feePayments?.filter(p => !p.isPaid).length || 0,
    totalRevenue: feePayments?.filter(p => p.isPaid).reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0
  };

  return (
    <AdminLayout 
      title="Aidat Yönetimi" 
      description="Aidat ödemelerini takip edin ve yönetin"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-fee">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Aidat Kaydı
            </Button>
          </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Yeni Aidat Kaydı Oluştur</DialogTitle>
                  <DialogDescription>
                    Daire için yeni bir aidat kaydı oluşturun.
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
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tutar (₺)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Aidat tutarını girin"
                              {...field}
                              data-testid="input-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ay</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                              <FormControl>
                                <SelectTrigger data-testid="select-month">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {getMonthName(i + 1)}
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
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yıl</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Yıl"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-year"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        İptal
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending}
                        data-testid="button-save-fee"
                      >
                        {createMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
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
                  <p className="text-muted-foreground text-sm">Toplam Kayıt</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Ödenen</p>
                  <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Bekleyen</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.unpaid}</p>
                </div>
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-primary">₺{stats.totalRevenue.toLocaleString('tr-TR')}</p>
                </div>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48" data-testid="select-filter-status">
              <SelectValue placeholder="Durum filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="paid">Ödenen</SelectItem>
              <SelectItem value="unpaid">Ödenmemiş</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fee Payments List */}
        {paymentsLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {filterStatus === "all" ? "Henüz aidat kaydı bulunmuyor" : "Bu filtre için kayıt bulunamadı"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filterStatus === "all" ? "İlk aidat kaydınızı oluşturun" : "Farklı bir filtre seçmeyi deneyin"}
            </p>
            {filterStatus === "all" && (
              <Button onClick={() => setDialogOpen(true)} data-testid="button-add-first-fee">
                <Plus className="mr-2 h-4 w-4" />
                İlk Aidat Kaydını Oluşturun
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {getFlatInfo(payment.flatId)}
                        </h3>
                        <Badge variant={payment.isPaid ? "default" : "secondary"}>
                          {payment.isPaid ? "Ödendi" : "Bekliyor"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {getMonthName(payment.month)} {payment.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ₺{parseFloat(payment.amount).toLocaleString('tr-TR')}
                        </div>
                        {payment.paidAt && (
                          <span>Ödeme: {new Date(payment.paidAt).toLocaleDateString('tr-TR')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      {payment.isPaid ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsUnpaid(payment)}
                          disabled={updatePaymentMutation.isPending}
                          data-testid={`button-mark-unpaid-${payment.id}`}
                        >
                          Ödenmedi İşaretle
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => markAsPaid(payment)}
                          disabled={updatePaymentMutation.isPending}
                          data-testid={`button-mark-paid-${payment.id}`}
                        >
                          Ödendi İşaretle
                        </Button>
                      )}
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
