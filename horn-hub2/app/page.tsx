"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { login, isAuthenticated } from "@/lib/auth"
import { Eye, EyeOff } from "lucide-react"

export default function LandingPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Redirect if already authenticated
    if (isAuthenticated()) {
      router.push("/feed")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    const profile = login(password)
    if (profile) {
      router.push("/feed")
    } else {
      setError("Invalid password")
      setPassword("")
    }
    setIsLoading(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4 animate-fade-in">
            Horn <span className="text-primary">Hub</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full animate-fade-in delay-200"></div>
          <p className="text-muted-foreground mt-4 animate-fade-in delay-300">Private access only</p>
        </div>

        {/* Login Form */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl animate-fade-in delay-400">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Access Code
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your access code"
                    className="bg-input/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground pr-10 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-destructive text-sm text-center animate-shake bg-destructive/10 p-3 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-medium py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Accessing...</span>
                  </div>
                ) : (
                  "Enter Hub"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
