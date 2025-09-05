"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { uploadMedia, uploadProfilePicture } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { Upload, Video, ImageIcon, X, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface UploadState {
  file: File | null
  title: string
  isUploading: boolean
  progress: number
  error: string
  success: boolean
}

function UploadContent() {
  const [videoUpload, setVideoUpload] = useState<UploadState>({
    file: null,
    title: "",
    isUploading: false,
    progress: 0,
    error: "",
    success: false,
  })

  const [imageUpload, setImageUpload] = useState<UploadState>({
    file: null,
    title: "",
    isUploading: false,
    progress: 0,
    error: "",
    success: false,
  })

  const [profileUpload, setProfileUpload] = useState<UploadState>({
    file: null,
    title: "",
    isUploading: false,
    progress: 0,
    error: "",
    success: false,
  })

  const router = useRouter()
  const user = getCurrentUser()

  const handleFileSelect = (file: File, type: "video" | "image" | "profile") => {
    const setState = type === "video" ? setVideoUpload : type === "image" ? setImageUpload : setProfileUpload

    // Validate file type
    const isValidVideo = type === "video" && file.type.startsWith("video/")
    const isValidImage = type === "image" || (type === "profile" && file.type.startsWith("image/"))

    if (!isValidVideo && !isValidImage) {
      setState((prev) => ({
        ...prev,
        error: `Please select a valid ${type === "profile" ? "image" : type} file`,
        file: null,
      }))
      return
    }

    // Validate file size (50MB for videos, 10MB for images)
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      setState((prev) => ({
        ...prev,
        error: `File size must be less than ${type === "video" ? "50MB" : "10MB"}`,
        file: null,
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      file,
      error: "",
      success: false,
    }))
  }

  const handleDrop = (e: React.DragEvent, type: "video" | "image" | "profile") => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0], type)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleUpload = async (type: "video" | "image" | "profile") => {
    const state = type === "video" ? videoUpload : type === "image" ? imageUpload : profileUpload
    const setState = type === "video" ? setVideoUpload : type === "image" ? setImageUpload : setProfileUpload

    if (!state.file || !user) return

    if (type === "video" && !state.title.trim()) {
      setState((prev) => ({ ...prev, error: "Please enter a title for your video" }))
      return
    }

    setState((prev) => ({ ...prev, isUploading: true, error: "", progress: 0 }))

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 30, 90),
        }))
      }, 500)

      if (type === "profile") {
        await uploadProfilePicture(state.file, user.id)
      } else {
        await uploadMedia(state.file, type, state.title, user.id)
      }

      clearInterval(progressInterval)
      setState((prev) => ({ ...prev, progress: 100, isUploading: false, success: true }))

      // Reset form after success
      setTimeout(() => {
        setState({
          file: null,
          title: "",
          isUploading: false,
          progress: 0,
          error: "",
          success: false,
        })
      }, 2000)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: "Upload failed. Please try again.",
        progress: 0,
      }))
    }
  }

  const removeFile = (type: "video" | "image" | "profile") => {
    const setState = type === "video" ? setVideoUpload : type === "image" ? setImageUpload : setProfileUpload
    setState((prev) => ({
      ...prev,
      file: null,
      title: "",
      error: "",
      success: false,
    }))
  }

  const FileUploadArea = ({
    type,
    state,
    setState,
  }: {
    type: "video" | "image" | "profile"
    state: UploadState
    setState: React.Dispatch<React.SetStateAction<UploadState>>
  }) => (
    <div className="space-y-4">
      {/* File Drop Area */}
      <div
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${state.file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
        `}
        onClick={() => {
          const input = document.createElement("input")
          input.type = "file"
          input.accept = type === "video" ? "video/*" : "image/*"
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) handleFileSelect(file, type === "profile" ? "image" : type)
          }
          input.click()
        }}
      >
        {state.file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              {type === "video" ? (
                <Video className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-primary" />
              )}
              <span className="font-medium text-foreground">{state.file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(type)
                }}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{(state.file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium text-foreground">
                Drop your {type === "profile" ? "profile picture" : type} here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                {type === "video" ? "MP4, WebM, OGG up to 50MB" : "JPG, PNG, GIF up to 10MB"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Title Input (for videos only) */}
      {type === "video" && state.file && (
        <div className="space-y-2">
          <Label htmlFor={`${type}-title`} className="text-foreground">
            Video Title
          </Label>
          <Input
            id={`${type}-title`}
            value={state.title}
            onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter a title for your video"
            className="bg-input border-border text-foreground"
          />
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{state.error}</span>
        </div>
      )}

      {/* Success Message */}
      {state.success && (
        <div className="flex items-center space-x-2 text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">
            {type === "video" ? "Video" : type === "profile" ? "Profile Picture" : "Image"} uploaded successfully!
          </span>
        </div>
      )}

      {/* Progress Bar */}
      {state.isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Uploading...</span>
            <span className="text-muted-foreground">{Math.round(state.progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={() => handleUpload(type)}
        disabled={!state.file || state.isUploading || (type === "video" && !state.title.trim())}
        className="w-full bg-primary hover:bg-accent text-primary-foreground"
      >
        {state.isUploading
          ? "Uploading..."
          : `Upload ${type === "video" ? "Video" : type === "profile" ? "Profile Picture" : "Image"}`}
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="upload" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Media</h1>
            <p className="text-muted-foreground">Share your videos and pictures</p>
          </div>

          {/* Upload Tabs */}
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card">
              <TabsTrigger value="video" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Picture</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="mt-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Video className="h-5 w-5" />
                    <span>Upload Video</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadArea type="video" state={videoUpload} setState={setVideoUpload} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image" className="mt-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <ImageIcon className="h-5 w-5" />
                    <span>Upload Picture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadArea type="image" state={imageUpload} setState={setImageUpload} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <ImageIcon className="h-5 w-5" />
                    <span>Upload Profile Picture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadArea type="profile" state={profileUpload} setState={setProfileUpload} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/feed")}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Video className="mr-2 h-4 w-4" />
              View Videos
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/pictures")}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              View Pictures
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function UploadPage() {
  return (
    <AuthGuard>
      <UploadContent />
    </AuthGuard>
  )
}
