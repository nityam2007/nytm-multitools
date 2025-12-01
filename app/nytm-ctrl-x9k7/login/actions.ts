"use server";

import { verifyPassword, createSession, setSessionCookie, clearSession } from "@/lib/auth";

export async function loginAction(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const isValid = await verifyPassword(password);
    
    if (!isValid) {
      return { success: false, error: "Invalid password" };
    }

    const token = await createSession();
    await setSessionCookie(token);
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function logoutAction(): Promise<void> {
  await clearSession();
}
