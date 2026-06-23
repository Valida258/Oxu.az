/* eslint-disable react-refresh/only-export-components */
import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { getCategories } from '@/api/categories/categories'
import { createNews, deleteNews, getNews, updateNews } from '@/api/news/news'
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/admin/news')({
    component: AdminNewsPage,
})

function AdminNewsPage() {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingNews, setEditingNews] = useState(null)
    const [categoryId, setCategoryId] = useState('')

    const { data: newsData, isLoading: newsLoading } = useQuery({
        queryKey: ['admin', 'news'],
        queryFn: () => getNews({ page: 1, limit: 100, sort: 'newest' }),
    })

    const { data: categoryData } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: getCategories,
    })

    const news = useMemo(() => normalizeList(newsData), [newsData])
    const categories = useMemo(() => normalizeList(categoryData), [categoryData])

    const saveMutation = useMutation({
        mutationFn: ({ id, payload }) => id ? updateNews(id, payload) : createNews(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'news'] })
            queryClient.invalidateQueries({ queryKey: ['news'] })
            setDialogOpen(false)
            setEditingNews(null)
            setCategoryId('')
            toast.success('News saxlanıldı')
        },
        onError: () => toast.error('News saxlanılmadı'),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteNews,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'news'] })
            queryClient.invalidateQueries({ queryKey: ['news'] })
            toast.success('News silindi')
        },
        onError: () => toast.error('News silinmədi'),
    })

    function openCreateDialog() {
        setEditingNews(null)
        setCategoryId('')
        setDialogOpen(true)
    }

    function openEditDialog(item) {
        setEditingNews(item)
        setCategoryId(resolveCategoryId(item.category_id))
        setDialogOpen(true)
    }

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const payload = {
            title: String(formData.get('title') || '').trim(),
            img: String(formData.get('img') || '').trim(),
            description: String(formData.get('description') || '').trim(),
            category_id: categoryId,
        }

        if (!payload.title || !payload.img || !payload.description || !payload.category_id) {
            toast.error('Bütün xanaları doldurun')
            return
        }

        saveMutation.mutate({
            id: editingNews?._id,
            payload,
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">News</h1>
                    <p className="text-sm text-muted-foreground">Xəbər CRUD table görünüşü.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus data-icon="inline-start" />
                    Yeni news
                </Button>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Xəbər</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Statistika</TableHead>
                            <TableHead>Tarix</TableHead>
                            <TableHead className="text-right">Əməliyyat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {newsLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Yüklənir...
                                </TableCell>
                            </TableRow>
                        ) : news.length ? (
                            news.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <div className="flex min-w-[260px] items-center gap-3">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="size-12 rounded-md object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">{item.title}</p>
                                                <p className="max-w-[420px] truncate text-sm text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{item.category_id?.name || 'Kateqoriya yoxdur'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.view || 0} baxış / {item.like || 0} like / {item.dislike || 0} dislike
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{formatDate(item.createdAt)}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => openEditDialog(item)}>
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
                                                            <AlertDialogTitle>News silinsin?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bu əməliyyat geri qaytarılmır.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => deleteMutation.mutate(item._id)}
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
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    News yoxdur.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingNews ? 'News redaktə et' : 'Yeni news'}</DialogTitle>
                        <DialogDescription>News məlumatlarını daxil edin.</DialogDescription>
                    </DialogHeader>
                    <form key={editingNews?._id || 'create-news'} onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="news-title">Başlıq</FieldLabel>
                                <Input
                                    id="news-title"
                                    name="title"
                                    defaultValue={editingNews?.title || ''}
                                    disabled={saveMutation.isPending}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="news-img">Şəkil URL</FieldLabel>
                                <Input
                                    id="news-img"
                                    name="img"
                                    defaultValue={editingNews?.img || ''}
                                    disabled={saveMutation.isPending}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="news-category">Category</FieldLabel>
                                <Select value={categoryId} onValueChange={setCategoryId} disabled={saveMutation.isPending}>
                                    <SelectTrigger id="news-category" className="w-full">
                                        <SelectValue placeholder="Category seç" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="news-description">Mətn</FieldLabel>
                                <Textarea
                                    id="news-description"
                                    name="description"
                                    defaultValue={editingNews?.description || ''}
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

function resolveCategoryId(category) {
    if (!category) return ''
    if (typeof category === 'string') return category
    return category._id || ''
}

function formatDate(value) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('az-AZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(value))
}
