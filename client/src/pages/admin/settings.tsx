import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Shield, Database, Users, FileText, Wrench, Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

// User types
type User = {
  id: string;
  username: string;
  role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
};

type CreateUserData = z.infer<typeof insertUserSchema> & {
  id?: never;
};

type UpdatePasswordData = {
  password: string;
};

// Form schemas
const createUserFormSchema = insertUserSchema.omit({ id: true }).extend({
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır")
});

const updatePasswordFormSchema = z.object({
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string().min(6, "Şifre onayı gereklidir")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"]
});

export default function Settings() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserData) => {
      return apiRequest("POST", "/api/admin/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla oluşturuldu.",
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message || "Kullanıcı oluşturulamadı.",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      return apiRequest("PUT", `/api/admin/users/${userId}/password`, { password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Başarılı",
        description: "Şifre başarıyla güncellendi.",
      });
      setIsPasswordDialogOpen(false);
      setSelectedUserId("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message || "Şifre güncellenemedi.",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message || "Kullanıcı silinemedi.",
      });
    },
  });

  // Create user form
  const createForm = useForm<z.infer<typeof createUserFormSchema>>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "user",
    },
  });

  // Update password form
  const passwordForm = useForm<z.infer<typeof updatePasswordFormSchema>>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onCreateUser = (data: z.infer<typeof createUserFormSchema>) => {
    createUserMutation.mutate(data);
  };

  const onUpdatePassword = (data: z.infer<typeof updatePasswordFormSchema>) => {
    if (selectedUserId) {
      updatePasswordMutation.mutate({
        userId: selectedUserId,
        password: data.password,
      });
    }
  };

  const onDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const systemInfo = {
    version: "1.0.0",
    lastUpdate: "17 Eylül 2025",
    database: "PostgreSQL (Neon)",
    environment: "Production",
  };

  const permissions = [
    { name: "Bina Yönetimi", status: "Aktif", icon: Shield },
    { name: "Kullanıcı Yönetimi", status: "Aktif", icon: Users },  
    { name: "İçerik Yönetimi", status: "Aktif", icon: FileText },
    { name: "Sistem Ayarları", status: "Aktif", icon: SettingsIcon },
  ];

  const maintenanceTasks = [
    { name: "Veritabanı Optimizasyonu", lastRun: "16 Eylül 2025", status: "Tamamlandı" },
    { name: "Log Temizliği", lastRun: "15 Eylül 2025", status: "Tamamlandı" },
    { name: "Yedekleme", lastRun: "17 Eylül 2025", status: "Tamamlandı" },
    { name: "Güvenlik Taraması", lastRun: "14 Eylül 2025", status: "Beklemede" },
  ];

  return (
    <AdminLayout 
      title="Sistem Ayarları" 
      description="Sistem konfigürasyonu ve bakım seçenekleri"
    >
      {/* System Information */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Versiyonu</CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemInfo.version}</div>
            <p className="text-xs text-muted-foreground">ALQ Yönetim Sistemi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son Güncelleme</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemInfo.lastUpdate}</div>
            <p className="text-xs text-muted-foreground">Sistem güncel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veritabanı</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemInfo.database}</div>
            <p className="text-xs text-muted-foreground">Bağlantı aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortam</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemInfo.environment}</div>
            <p className="text-xs text-muted-foreground">Güvenli bağlantı</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Kullanıcı Yönetimi
              </CardTitle>
              <CardDescription>Sistem kullanıcılarını yönetin</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-user">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Kullanıcı Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateUser)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kullanıcı Adı</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şifre</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} data-testid="input-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-firstName" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soyad</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-lastName" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rol</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-role">
                                <SelectValue placeholder="Rol seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="user">Kullanıcı</SelectItem>
                              <SelectItem value="admin">Yönetici</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        data-testid="button-cancel-create"
                      >
                        İptal
                      </Button>
                      <Button
                        type="submit"
                        disabled={createUserMutation.isPending}
                        data-testid="button-submit-create"
                      >
                        {createUserMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Kullanıcılar yükleniyor...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Henüz kullanıcı bulunmuyor</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`user-row-${user.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium" data-testid={`text-username-${user.id}`}>
                          {user.username}
                        </span>
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          data-testid={`badge-role-${user.id}`}
                        >
                          {user.role === "admin" ? "Yönetici" : "Kullanıcı"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ""}
                        {user.email && (
                          <span className="ml-2" data-testid={`text-email-${user.id}`}>
                            ({user.email})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsPasswordDialogOpen(true);
                      }}
                      data-testid={`button-edit-password-${user.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-delete-${user.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{user.username}" kullanıcısını silmek istediğinizden emin misiniz?
                            Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-testid="button-cancel-delete">
                            İptal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteUser(user.id)}
                            data-testid="button-confirm-delete"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Update Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Şifre Güncelle</DialogTitle>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yeni Şifre</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} data-testid="input-new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre Onayı</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} data-testid="input-confirm-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    setSelectedUserId("");
                  }}
                  data-testid="button-cancel-password"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  data-testid="button-submit-password"
                >
                  {updatePasswordMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Modül Yetkileri</CardTitle>
            <CardDescription>Sistem modüllerinin erişim durumu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <permission.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{permission.name}</span>
                </div>
                <Badge variant="default">
                  {permission.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Maintenance Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Bakım Görevleri</CardTitle>
            <CardDescription>Sistem bakım operasyonları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceTasks.map((task) => (
              <div key={task.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{task.name}</span>
                  <Badge variant={task.status === "Tamamlandı" ? "default" : "secondary"}>
                    {task.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Son Çalışma: {task.lastRun}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sistem İşlemleri</CardTitle>
          <CardDescription>Sistem bakımı ve konfigürasyon seçenekleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" data-testid="button-clear-cache">
              <Database className="mr-2 h-4 w-4" />
              Önbellek Temizle
            </Button>
            <Button variant="outline" data-testid="button-optimize-db">
              <Wrench className="mr-2 h-4 w-4" />
              Veritabanı Optimizasyonu
            </Button>
            <Button variant="outline" data-testid="button-backup-system">
              <Shield className="mr-2 h-4 w-4" />
              Sistem Yedeği Al
            </Button>
            <Button variant="outline" data-testid="button-generate-report">
              <FileText className="mr-2 h-4 w-4" />
              Sistem Raporu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="mt-8 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">Önemli Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-orange-700 space-y-2">
            <p>• Sistem ayarları değişiklikleri tüm kullanıcıları etkileyebilir.</p>
            <p>• Bakım işlemleri sırasında sistem geçici olarak kullanılamayabilir.</p>
            <p>• Kritik işlemler öncesinde mutlaka yedek alın.</p>
            <p>• Güvenlik ayarları için sistem yöneticisi ile iletişime geçin.</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}