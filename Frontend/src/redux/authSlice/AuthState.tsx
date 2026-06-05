import type User from "@/model/User";

export default interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}
