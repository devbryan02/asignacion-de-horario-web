
import { AuthRequest, AuthResponse } from "./types";
import apiClient from "@/lib/axios";

export  async function loginUser(request: AuthRequest): Promise<AuthResponse> {
    try {
        const response = await apiClient.post<AuthResponse>("/auth/login", request);
        if (response.data.success) {
            // Store the token in localStorage or any other storage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userRole", response.data.role || '');
        }
         // Return the response data
        return response.data
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}

