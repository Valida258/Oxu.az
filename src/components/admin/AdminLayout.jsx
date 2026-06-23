import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { useTheme } from "@/components/ThemeContext"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"

export default function AdminLayout({ children }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
                    <SidebarTrigger />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Admin Panel</p>
                        <p className="text-xs text-muted-foreground">Oxu.az idarəetmə</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        {theme === 'dark'
                            ? <SunIcon className="size-5 text-yellow-400" />
                            : <MoonIcon className="size-5 text-gray-600" />
                        }
                    </button>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}