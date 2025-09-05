import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

export interface MediaItem {
  id: string
  url: string
  title?: string
  uploadedBy: string
  uploadedAt: number
  type: "video" | "image"
}

export async function uploadMedia(file: File, type: "video" | "image", title: string, userId: string): Promise<string> {
  const timestamp = Date.now()
  const fileName = `${type}s/${userId}/${timestamp}-${file.name}`
  const storageRef = ref(storage, fileName)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  // Store metadata in localStorage
  const mediaItem: MediaItem = {
    id: `${userId}-${timestamp}`,
    url: downloadURL,
    title: type === "video" ? title : undefined,
    uploadedBy: userId,
    uploadedAt: timestamp,
    type,
  }

  const existingMedia = getStoredMedia()
  existingMedia.push(mediaItem)
  localStorage.setItem("hornhub-media", JSON.stringify(existingMedia))

  return downloadURL
}

export function getStoredMedia(): MediaItem[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("hornhub-media")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export function getVideos(): MediaItem[] {
  return getStoredMedia().filter((item) => item.type === "video")
}

export function getImages(): MediaItem[] {
  return getStoredMedia().filter((item) => item.type === "image")
}

export async function uploadProfilePicture(file: File, userId: string): Promise<string> {
  // Store profile pictures with specific naming: hadi.jpg or hadil.jpg
  const fileName = `profiles/${userId}.jpg`
  const storageRef = ref(storage, fileName)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  // Update user profile in localStorage
  const currentUser = JSON.parse(localStorage.getItem("hornhub-user") || "{}")
  currentUser.profilePicture = downloadURL
  localStorage.setItem("hornhub-user", JSON.stringify(currentUser))

  return downloadURL
}
