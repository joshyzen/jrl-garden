"use client";

const FAVORITES_KEY = "plant-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(plantId: string): string[] {
  const favorites = getFavorites();
  if (!favorites.includes(plantId)) {
    favorites.push(plantId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
}

export function removeFavorite(plantId: string): string[] {
  const favorites = getFavorites().filter(id => id !== plantId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}

export function toggleFavorite(plantId: string): { favorites: string[]; isFavorite: boolean } {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(plantId);
  
  if (isFavorite) {
    return { favorites: removeFavorite(plantId), isFavorite: false };
  } else {
    return { favorites: addFavorite(plantId), isFavorite: true };
  }
}

export function isFavorite(plantId: string): boolean {
  return getFavorites().includes(plantId);
}
