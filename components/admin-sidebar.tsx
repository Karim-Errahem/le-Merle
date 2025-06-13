"use client"

import {
  BarChart3,
  MessageSquare,
  Calendar,
  Users,
  Package,
  FileText,
  Star,
  UserPlus,
  Layers,
  Handshake,
  ChevronRight,
  DollarSign,
  LogOut,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const isActive = (path: string) => {
    return pathname === path
  }

  const menuItems = [
    { href: "/dashboard", icon: BarChart3, label: "Tableau de bord", badge: null },
    { href: "/services", icon: Layers, label: "Services", badge: null },
    { href: "/equipment", icon: Package, label: "Équipements", badge: null },
    { href: "/partners", icon: Handshake, label: "Partenaires", badge: null },
    { href: "/pricing", icon: DollarSign, label: "Plans tarifaires", badge: null },
    { href: "/blog", icon: FileText, label: "Blog", badge: null },
    { href: "/testimonials", icon: Star, label: "Témoignages", badge: null },
    { href: "/team", icon: Users, label: "Équipe", badge: null },
    { href: "/messages", icon: MessageSquare, label: "Messages", badge: null },
    { href: "/appointments", icon: Calendar, label: "Rendez-vous", badge: null },
    { href: "/admins", icon: UserPlus, label: "Administrateurs", badge: null },
  ]

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion")
      }

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      })

      router.push("/login")
    } catch (err) {
      console.error("Erreur:", err)
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="gradient-sidebar border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-modern">
              <span className="font-bold text-white text-lg">LM</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Le Merle
              </span>
              <p className="text-xs text-muted-foreground">Administration</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gradient-sidebar px-3 py-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                className={cn(
                  "group relative h-12 rounded-xl transition-all duration-200 hover:shadow-modern",
                  isActive(item.href)
                    ? "gradient-primary text-white shadow-modern-lg"
                    : "hover:bg-white/50 dark:hover:bg-white/5",
                )}
              >
                <Link href={item.href} className="flex items-center gap-3 px-4">
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive(item.href) ? "text-white" : "text-gray-600 dark:text-gray-400",
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      isActive(item.href) ? "text-white" : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-xs font-medium",
                        isActive(item.href) ? "bg-white/20 text-white" : "bg-[#ffc000]/10 text-[#ffc000]",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4 text-white" />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
<SidebarFooter className="gradient-sidebar border-t border-border/50 p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full gradient-primary shadow-modern flex items-center justify-center">
        <span className="text-white font-medium text-sm">AD</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
        <p className="text-xs text-muted-foreground">admin@lemerle.com</p>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <ModeToggle />
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600 hover:bg-red-500/10 rounded-full p-2 h-9 w-9"
        onClick={handleLogout}
        title="Déconnexion"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  </div>
</SidebarFooter>

    </Sidebar>
  )
}