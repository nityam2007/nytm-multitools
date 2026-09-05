// Browser-local tool preferences | TypeScript
import { useSyncExternalStore } from "react";
const memory = new Map<string, string>();
export function readPreference(key: string, fallback = "") {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    memory.delete(key);
  } catch {
    memory.set(key, value);
  }
  window.dispatchEvent(new Event("toolPreferencesChanged"));
}
function subscribe(listener: () => void) {
  window.addEventListener("toolPreferencesChanged", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("toolPreferencesChanged", listener);
    window.removeEventListener("storage", listener);
  };
}
export function usePreference(key: string, fallback = "") {
  return useSyncExternalStore(
    subscribe,
    () => readPreference(key, fallback),
    () => fallback,
  );
}
export function readToolList(key: string): string[] {
  try {
    const value: unknown = JSON.parse(readPreference(key, "[]"));
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function writeToolList(key: string, value: string[]) {
  writePreference(key, JSON.stringify(value));
}
