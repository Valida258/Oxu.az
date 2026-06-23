import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/api/auth"
import { FolderTree, LayoutDashboard, Newspaper } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { NavMain } from "./navMain"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Category",
      url: "/admin/categories",
      icon: FolderTree,
    },
    {
      title: "News",
      url: "/admin/news",
      icon: Newspaper,
    },
  ],
}

export function AppSidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    logoutAdmin()
    navigate({ to: "/admin/login" })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Newspaper />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Oxu.az</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Çıxış
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
