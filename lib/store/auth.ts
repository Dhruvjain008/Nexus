"use client";
import { create } from "zustand";
import type { User, UserRole } from "../types";
import { USERS } from "../data";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  switchRole: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  login: (userId: string) => {
    const user = USERS.find((u) => u.id === userId) || null;
    set({ currentUser: user, isAuthenticated: !!user });
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),
  switchRole: (userId: string) => {
    const user = USERS.find((u) => u.id === userId) || null;
    set({ currentUser: user, isAuthenticated: !!user });
  },
}));

// Demo scenario users for quick role switching
export const DEMO_USERS: { id: string; label: string; role: UserRole; description: string }[] = [
  {
    id: "user-1",
    label: "Arjun Mehta",
    role: "user",
    description: "Student borrower — first booking",
  },
  {
    id: "user-3",
    label: "Dr. Rajesh Rawal",
    role: "owner",
    description: "Resource owner — MIT ARL",
  },
  {
    id: "user-4",
    label: "Vikram Malhotra",
    role: "manager",
    description: "Organisation manager — Horizon Hub",
  },
  {
    id: "user-5",
    label: "Dhruv Jain",
    role: "admin",
    description: "Platform administrator",
  },
];
