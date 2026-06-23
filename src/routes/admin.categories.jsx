/* eslint-disable react-refresh/only-export-components */
import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { createCategory, deleteCategory, getCategories, updateCategory } from '@/api/categories/categories'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/admin/categories')({
    component: AdminCategoriesPage,
})

function AdminCategoriesPage() {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: getCategories,
    })

    const categories = useMemo(() => normalizeList(data), [data])

    const saveMutation = useMutation({
        mutationFn: ({ id, payload }) => id ? updateCategory(id, payload) : createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            setDialogOpen(false)
            setEditingCategory(null)
            toast.success('Category saxlanıldı')
        },
        onError: () => toast.error('Category saxlanılmadı'),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success('Category silindi')
        },
        onError: () => toast.error('Category silinmədi'),
    })

    function openCreateDialog() {
        setEditingCategory(null)
        setDialogOpen(true)
    }

    function openEditDialog(category) {
        setEditingCategory(category)
        setDialogOpen(true)
    }

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const name = String(formData.get('name') || '').trim()

        if (!name) {
            toast.error('Category adı boş ola bilməz')
            return
        }

        saveMutation.mutate({
            id: editingCategory?._id,
            payload: { name },
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Category</h1>
                    <p className="text-sm text-muted-foreground">Kateqoriya CRUD table görünüşü.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus data-icon="inline-start" />
                    Yeni category
                </Button>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ad</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Əməliyyat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Yüklənir...
                                </TableCell>
                            </TableRow>
                        ) : categories.length ? (
                            categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="max-w-[220px] truncate text-muted-foreground">{category._id}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Aktiv</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                    <span className="sr-only">Menyu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                        Redaktə et
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(event) => event.preventDefault()}
                                                        >
                                                            Sil
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Category silinsin?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu əməliyyat geri qaytarılmır.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => deleteMutation.mutate(category._id)}
                                                            >
                                                                Sil
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Category yoxdur.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Category redaktə et' : 'Yeni category'}</DialogTitle>
                        <DialogDescription>Category məlumatlarını daxil edin.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="category-name">Ad</FieldLabel>
                                <Input
                                    id="category-name"
                                    name="name"
                                    defaultValue={editingCategory?.name || ''}
                                    disabled={saveMutation.isPending}
                                    required
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                disabled={saveMutation.isPending}
                            >
                                Ləğv et
                            </Button>
                            <Button type="submit" disabled={saveMutation.isPending}>
                                {saveMutation.isPending ? 'Saxlanılır...' : 'Saxla'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function normalizeList(data) {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    return []
}
