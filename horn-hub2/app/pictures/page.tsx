"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getImages, type MediaItem } from "@/lib/storage"
import { profiles } from "@/lib/auth"
import { ImageIcon, Loader2, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

function PicturesGalleryContent() {
  const [images, setImages] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    // Load images from localStorage
    const loadImages = () => {
      const imageList = getImages()
      setImages(imageList.sort((a, b) => b.uploadedAt - a.uploadedAt))
      setIsLoading(false)
    }

    loadImages()
  }, [])

  const handleImageLoad = (imageId: string) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(imageId)
      return newSet
    })
  }

  const handleImageLoadStart = (imageId: string) => {
    setLoadingImages((prev) => new Set(prev).add(imageId))
  }

  const getUserProfile = (userId: string) => {
    return Object.values(profiles).find((profile) => profile.id === userId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading pictures...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="pictures" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Pictures Gallery</h1>
            <p className="text-muted-foreground">Your private photo collection</p>
          </div>

          {/* Images */}
          {images.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No pictures yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your collection by uploading your first picture
                </p>
                <Button
                  onClick={() => router.push("/upload")}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  Upload Picture
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => {
                const userProfile = getUserProfile(image.uploadedBy)
                const isImageLoading = loadingImages.has(image.id)

                return (
                  <Card
                    key={image.id}
                    className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative aspect-square bg-muted">
                        {isImageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt="Uploaded image"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onLoadStart={() => handleImageLoadStart(image.id)}
                          onLoad={() => handleImageLoad(image.id)}
                        />
                      </div>

                      {/* User Info Footer */}
                      <div className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={userProfile?.profilePicture || "/placeholder.svg"}
                              alt={userProfile?.name || "User"}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {userProfile?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {userProfile?.name || "Unknown User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(image.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Videos Link */}
          <div className="text-center pt-8">
            <Button
              onClick={() => router.push("/feed")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Video className="mr-2 h-4 w-4" />
              View Video Feed
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PicturesPage() {
  return (
    <AuthGuard>
      <PicturesGalleryContent />
    </AuthGuard>
  )
}
