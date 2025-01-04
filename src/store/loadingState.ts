import { create } from 'zustand'

type LoadingStore = {
  isSigningOut: boolean
  startSignOut: () => void
  resetSignOut: () => void
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isSigningOut: false,
  startSignOut: () => set({ isSigningOut: true }),
  resetSignOut: () => set({ isSigningOut: false })
}))