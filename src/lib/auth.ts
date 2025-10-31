import { supabase } from "./supabase";

/**
 * Supabase Authentication Module
 *
 * Provides authentication functions for Freshify app
 */

// ==================== SIGN UP ====================

export async function signUp(email: string, password: string, name: string) {
  try {
    // Create user with email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error);

      // Translate Supabase errors to Indonesian
      let errorMessage = error?.message || "Gagal membuat akun";

      if (error?.message?.includes("already registered")) {
        errorMessage =
          "Email sudah terdaftar. Silakan gunakan email lain atau login.";
      } else if (error?.message?.includes("invalid email")) {
        errorMessage = "Format email tidak valid.";
      } else if (error?.message?.includes("password")) {
        errorMessage = "Password minimal harus 6 karakter.";
      } else if (!errorMessage) {
        errorMessage = "Gagal membuat akun. Silakan coba lagi.";
      }

      return { data: null, error: errorMessage, user: null };
    }

    if (data?.user) {
      return {
        data,
        error: null,
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: name,
        },
      };
    }

    return { data: null, error: "Gagal membuat akun", user: null };
  } catch (err: any) {
    console.error("Signup exception:", err);
    return {
      data: null,
      error: err.message || "Gagal membuat akun. Silakan coba lagi.",
      user: null,
    };
  }
}

// ==================== SIGN IN ====================

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);

      // Translate Supabase errors to Indonesian
      let errorMessage = (error as any)?.message || "Gagal login";

      if ((error as any)?.message?.includes("Invalid login credentials")) {
        errorMessage =
          "Email atau password salah. Jika Anda belum punya akun, silakan daftar terlebih dahulu di tab Sign Up.";
      } else if ((error as any)?.message?.includes("Email not confirmed")) {
        errorMessage = "Email belum dikonfirmasi. Periksa inbox Anda.";
      } else if ((error as any)?.message?.includes("invalid email")) {
        errorMessage = "Format email tidak valid.";
      } else if (!errorMessage) {
        errorMessage = "Gagal login. Silakan coba lagi.";
      }

      return { data: null, error: errorMessage };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("Sign in exception:", err);
    return {
      data: null,
      error: err.message || "Gagal login. Silakan coba lagi.",
    };
  }
}

// ==================== SIGN OUT ====================

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      return { error: (error as any)?.message || "Gagal logout" };
    }
    return { error: null };
  } catch (err: any) {
    console.error("Sign out exception:", err);
    return { error: err.message };
  }
}

// ==================== GET CURRENT USER ====================

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
      role: (user.user_metadata?.role || "user") as "user" | "admin",
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

// ==================== GET SESSION ====================

export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return { user: session.user };
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

// ==================== UPDATE USER ROLE ====================

export async function updateUserRole(_userId: string, role: "user" | "admin") {
  try {
    const {
      data: { user: _user },
      error,
    } = await supabase.auth.updateUser({
      data: { role },
    });

    if (error) {
      console.error("Update role error:", error);
      return {
        success: false,
        error: (error as any)?.message || "Gagal update role",
      };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Update role exception:", error);
    return { success: false, error: error.message || "Gagal update role" };
  }
}

// ==================== AUTH STATE LISTENER ====================

/**
 * Subscribe to authentication state changes
 * Useful for real-time auth updates
 */
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}

// ==================== GET ACCESS TOKEN ====================

/**
 * Get current user's access token for API calls
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error("Get access token error:", error);
    return null;
  }
}
