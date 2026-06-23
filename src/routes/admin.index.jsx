/* eslint-disable react-refresh/only-export-components */
import { Link, createFileRoute } from '@tanstack/react-router'
import { FolderTree, Newspaper } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/')({
    component: AdminDashboard,
})

function AdminDashboard() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Category və News idarəetməsi</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FolderTree />
                            Category
                        </CardTitle>
                        <CardDescription>Kateqoriyaları yarat, redaktə et və sil.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link to="/admin/categories">Category CRUD</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Newspaper />
                            News
                        </CardTitle>
                        <CardDescription>Xəbərləri table görünüşündə idarə et.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link to="/admin/news">News CRUD</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
