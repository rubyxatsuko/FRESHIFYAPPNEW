/**
 * Supabase Mock Client for Development
 *
 * This is a simplified version without external dependencies.
 * Replace this with actual Supabase connection when deploying.
 */

// Simple auth state management
let currentSession: any = null;

// Mock Supabase client
export const supabase = {
  auth: {
    signUp: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      // Mock signup - simulate errors
      if (!password || password.length < 6) {
        return {
          data: null,
          error: { message: "Password should be at least 6 characters" },
        };
      }
      if (!email.includes("@")) {
        return { data: null, error: { message: "Invalid email" } };
      }
      // Check if already exists
      const existingUser = localStorage.getItem("freshify_user");
      if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
          return { data: null, error: { message: "User already registered" } };
        }
      }
      // Mock signup - use email as consistent ID
      const userId =
        "user-" +
        btoa(email)
          .replace(/[^a-zA-Z0-9]/g, "")
          .substring(0, 20);
      const user = { id: userId, email };
      localStorage.setItem("freshify_user", JSON.stringify(user));
      localStorage.setItem(
        "freshify_session",
        JSON.stringify({ user, access_token: "mock-token" })
      );
      currentSession = { user, access_token: "mock-token" };
      return { data: { user, session: currentSession }, error: null };
    },

    signInWithPassword: async ({
      email,
    }: {
      email: string;
      password: string;
    }) => {
      // Mock login - simulate errors
      if (!email.includes("@")) {
        return { data: null, error: { message: "Invalid email" } };
      }
      // Mock login - check if admin credentials
      const isAdmin = email === "admin@freshify.com";
      // Use email as consistent ID - same user always gets same ID
      const userId = isAdmin
        ? "admin-id"
        : "user-" +
          btoa(email)
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 20);
      const user = {
        id: userId,
        email,
        user_metadata: { role: isAdmin ? "admin" : "user" },
      };
      localStorage.setItem("freshify_user", JSON.stringify(user));
      localStorage.setItem(
        "freshify_session",
        JSON.stringify({ user, access_token: "mock-token" })
      );
      currentSession = { user, access_token: "mock-token" };
      return { data: { user, session: currentSession }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem("freshify_user");
      localStorage.removeItem("freshify_session");
      currentSession = null;
      return { error: null };
    },

    getSession: async () => {
      const sessionStr = localStorage.getItem("freshify_session");
      if (sessionStr) {
        currentSession = JSON.parse(sessionStr);
        return { data: { session: currentSession }, error: null };
      }
      return { data: { session: null }, error: null };
    },

    getUser: async () => {
      const userStr = localStorage.getItem("freshify_user");
      if (userStr) {
        return { data: { user: JSON.parse(userStr) }, error: null };
      }
      return { data: { user: null }, error: null };
    },

    updateUser: async (updates: any) => {
      // Mock update user
      const userStr = localStorage.getItem("freshify_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...updates.data };
        localStorage.setItem("freshify_user", JSON.stringify(updatedUser));
        return { data: { user: updatedUser }, error: null };
      }
      return { data: { user: null }, error: { message: "User not found" } };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simple mock - call immediately with current state
      setTimeout(() => {
        const sessionStr = localStorage.getItem("freshify_session");
        if (sessionStr) {
          callback("SIGNED_IN", JSON.parse(sessionStr));
        } else {
          callback("SIGNED_OUT", null);
        }
      }, 0);

      return {
        data: { subscription: { unsubscribe: () => {} } },
      };
    },
  },
};

export const supabaseUrl = "https://mock.supabase.co";
export const supabaseAnonKey = "mock-anon-key";

/**
 * NOTE: This is a mock implementation for development.
 * To connect to real Supabase:
 * 1. Install: npm install @supabase/supabase-js
 * 2. Replace this file with actual Supabase client configuration
 * 3. Update utils/supabase/info.tsx with your project credentials
 */
