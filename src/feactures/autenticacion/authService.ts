import { AuthRequest, AuthResponse, RegisterResponse } from "./types";
import apiClient from "@/lib/axios";

export  async function loginUser(request: AuthRequest): Promise<AuthResponse> {
    try {
        const response = await apiClient.post<AuthResponse>("/auth/login", request);
        if (response.data.success) {
            // Store the token in localStorage or any other storage
            localStorage.setItem("token", response.data.token);
        }
         // Return the response data
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}

export async function registerUser(request: AuthRequest): Promise<RegisterResponse> {
    try {
        const response = await apiClient.post<RegisterResponse>("/auth/register", request);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}