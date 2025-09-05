export interface Profile {
  id: string
  name: string
  profilePicture: string
}

export const profiles: Record<string, Profile> = {
  Hadil: {
    id: "user1",
    name: "had",
    profilePicture: "hadi.jpg",
  },
  Hadi: {
    id: "user2",
    name: "Hadil",
    profilePicture: "hadil.jpg",
  },
}

export function login(password: string): Profile | null {
  const profile = profiles[password]
  if (profile) {
    localStorage.setItem("hornhub-auth", JSON.stringify(profile))
    return profile
  }
  return null
}

export function logout(): void {
  localStorage.removeItem("hornhub-auth")
}

export function getCurrentUser(): Profile | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("hornhub-auth")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
