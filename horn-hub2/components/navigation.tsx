"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser, logout } from "@/lib/auth"
import { LogOut, Upload, ImageIcon, Video } from "lucide-react"

interface NavigationProps {
  currentPage?: "feed" | "pictures" | "upload"
}

export function Navigation({ currentPage }: NavigationProps) {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1
              className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => router.push("/feed")}
            >
              Horn <span className="text-primary">Hub</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={currentPage === "feed" ? "default" : "ghost"}
              onClick={() => router.push("/feed")}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <Video size={16} />
              Videos
            </Button>
            <Button
              variant={currentPage === "pictures" ? "default" : "ghost"}
              onClick={() => router.push("/pictures")}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <ImageIcon size={16} />
              Pictures
            </Button>
            <Button
              variant={currentPage === "upload" ? "default" : "ghost"}
              onClick={() => router.push("/upload")}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <Upload size={16} />
              Upload
            </Button>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/50 transition-all duration-200">
                <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-foreground">{user.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1">
            <Button
              variant={currentPage === "feed" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/feed")}
              className="flex-1 transition-all duration-200 hover:scale-105"
            >
              <Video size={14} />
            </Button>
            <Button
              variant={currentPage === "pictures" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/pictures")}
              className="flex-1 transition-all duration-200 hover:scale-105"
            >
              <ImageIcon size={14} />
            </Button>
            <Button
              variant={currentPage === "upload" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/upload")}
              className="flex-1 transition-all duration-200 hover:scale-105"
            >
              <Upload size={14} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
