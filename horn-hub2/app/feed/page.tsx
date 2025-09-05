"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getVideos, type MediaItem } from "@/lib/storage"
import { profiles } from "@/lib/auth"
import { ImageIcon, Play, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

function VideoFeedContent() {
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    // Load videos from localStorage
    const loadVideos = () => {
      const videoList = getVideos()
      setVideos(videoList.sort((a, b) => b.uploadedAt - a.uploadedAt))
      setIsLoading(false)
    }

    loadVideos()
  }, [])

  const handleVideoLoad = (videoId: string) => {
    setLoadingVideos((prev) => {
      const newSet = new Set(prev)
      newSet.delete(videoId)
      return newSet
    })
  }

  const handleVideoLoadStart = (videoId: string) => {
    setLoadingVideos((prev) => new Set(prev).add(videoId))
  }

  const getUserProfile = (userId: string) => {
    return Object.values(profiles).find((profile) => profile.id === userId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="feed" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Video Feed</h1>
            <p className="text-muted-foreground">Your private video collection</p>
          </div>

          {/* Videos */}
          {videos.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg animate-fade-in">
              <CardContent className="p-12 text-center">
                <div className="animate-bounce mb-6">
                  <Play className="h-20 w-20 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">No videos yet</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                  Start building your collection by uploading your first video and sharing your moments
                </p>
                <Button
                  onClick={() => router.push("/upload")}
                  className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Upload Your First Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {videos.map((video, index) => {
                const userProfile = getUserProfile(video.uploadedBy)
                const isVideoLoading = loadingVideos.has(video.id)

                return (
                  <Card
                    key={video.id}
                    className="bg-card/80 backdrop-blur-sm border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={userProfile?.profilePicture || "/placeholder.svg"}
                              alt={userProfile?.name || "User"}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {userProfile?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{userProfile?.name || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(video.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {video.title && <h3 className="mt-3 text-lg font-semibold text-foreground">{video.title}</h3>}
                      </div>

                      {/* Video Player */}
                      <div className="relative bg-black">
                        {isVideoLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                        <video
                          controls
                          className="w-full aspect-video"
                          onLoadStart={() => handleVideoLoadStart(video.id)}
                          onCanPlay={() => handleVideoLoad(video.id)}
                          preload="metadata"
                        >
                          <source src={video.url} type="video/mp4" />
                          <source src={video.url} type="video/webm" />
                          <source src={video.url} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pictures Link */}
          <div className="text-center pt-8">
            <Button
              onClick={() => router.push("/pictures")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              View Pictures Gallery
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VideoFeedPage() {
  return (
    <AuthGuard>
      <VideoFeedContent />
    </AuthGuard>
  )
}
