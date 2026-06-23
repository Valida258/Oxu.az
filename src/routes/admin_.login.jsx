/* eslint-disable react-refresh/only-export-components */
import { loginAdmin, saveToken } from '@/api/auth';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/admin_/login')({
    component: AdminLoginPage,
})

function AdminLoginPage() {
    const navigate = useNavigate()

    const { mutate: login, isPending, isError } = useMutation({
        mutationFn: ({ login, password }) => loginAdmin({ login, password }),

        onSuccess: (data) => {
         
            if (!data?.token) {
                toast.error("Login və ya şifrə yanlışdır")
                return
            }

            saveToken(data?.token)
            navigate({ to: "/admin" })

        },

        onError: () => {
            toast.error("Login və ya şifrə yanlışdır")
        },
    })

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        login({
            login: formData.get("login"),
            password: formData.get("password")
        })
    }

    return (
        <main className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Admin Panel</CardTitle>
                    <CardDescription>Daxil olmaq üçün məlumatlarınızı daxil edin</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {isError && (toast.error("login parol sef"))}

                        <div className="space-y-2">
                            <Label htmlFor="login">İstifadəçi adı</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="login"
                                    name="login"
                                    type="text"
                                    placeholder="admin"
                                    className="pl-9"
                                    required
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Şifrə</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    required
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? "Giriş edilir..." : "Daxil ol"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
