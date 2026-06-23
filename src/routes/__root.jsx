import * as React from 'react'
import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import Header from '../components/header'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    const isAdmin = pathname.startsWith('/admin')

    return (
        <>
            {!isAdmin && <Header />}
            <Outlet />
        </>
    )
}