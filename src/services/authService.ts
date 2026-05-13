import { API_CONFIG, setAuthToken, removeAuthToken, getAuthToken, getAuthHeaders } from "../utils/apiConfig";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface BasicResponse {
  success: boolean;
  message: string;
}

// Helper function to add timeout to fetch
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout: number = 10000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout - server is not responding")), timeout)
    ),
  ]);
};

// Login API
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      },
      API_CONFIG.TIMEOUT
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Login failed");
    }

    const data = await response.json();

    if (data.success && data.token) {
      setAuthToken(data.token);
      // Store user data if needed
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register API
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    // Split fullName if provided as single field
    let firstName = userData.firstName;
    let lastName = userData.lastName;

    // If fullName is provided, split it
    if (!lastName && firstName.includes(" ")) {
      const nameParts = firstName.trim().split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ") || "";
    }

    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
        }),
      },
      API_CONFIG.TIMEOUT
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Registration failed");
    }

    const data = await response.json();

    if (data.success && data.token) {
      setAuthToken(data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Logout
export const logout = (): void => {
  removeAuthToken();
  localStorage.removeItem("user");
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const forgotPassword = async (email: string): Promise<BasicResponse> => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
    API_CONFIG.TIMEOUT
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to request reset");
  return data;
};

export const resetPassword = async (token: string, password: string): Promise<BasicResponse> => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    },
    API_CONFIG.TIMEOUT
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to reset password");
  return data;
};

export const getMe = async (): Promise<{ success: boolean; user: User }> => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/me`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
    API_CONFIG.TIMEOUT
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
};
