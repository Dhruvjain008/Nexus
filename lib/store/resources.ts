"use client";

import { create } from "zustand";
import type { Resource } from "../types";
import { RESOURCES } from "../data";

interface ResourcesState {
  resources: Resource[];
  addResource: (
    newResourceData: Omit<Resource, "id" | "createdAt" | "totalBookings" | "utilizationRate">
  ) => Resource;
  toggleAvailability: (id: string) => void;
  getResourceById: (id: string) => Resource | undefined;
}

export const useResourcesStore = create<ResourcesState>((set, get) => ({
  resources: RESOURCES,

  addResource: (newResourceData) => {
    const id = `res-${Date.now().toString().slice(-4)}`;
    const newResource: Resource = {
      ...newResourceData,
      id,
      totalBookings: 0,
      utilizationRate: 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      resources: [newResource, ...state.resources],
    }));

    return newResource;
  },

  toggleAvailability: (id) => {
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === id ? { ...r, isAvailable: !r.isAvailable } : r
      ),
    }));
  },

  getResourceById: (id) => {
    return get().resources.find((r) => r.id === id);
  },
}));
