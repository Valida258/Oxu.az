/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getToken, verifyAdmin } from '/src/api/auth'
import AdminLayout from '../components/admin/AdminLayout'

export const Route = createFileRoute('/admin')({
    beforeLoad: async ({ location }) => {
        const token = getToken()

        if (!token) {
            throw redirect({
                to: "/admin/login",
                search: {
                    redirect: location.href
                }
            })

        }

        try {
            await verifyAdmin()
        } catch {
            localStorage.removeItem("token");
            throw redirect({
                to: "/admin/login",
                search: {
                    redirect: location.href
                }
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    )
}
