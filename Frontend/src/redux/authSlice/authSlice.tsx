import { createSlice } from "@reduxjs/toolkit";
import type AuthState from "./AuthState";
import { jwtDecode } from "jwt-decode";
import type Token from "@/model/Token";
import type User from "@/model/User";

const getInitialState = (): AuthState => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decodedToken = jwtDecode(token) as Token;
            const userInfo: User = {
                email: decodedToken.sub,
                role: decodedToken.roles,
                token: decodedToken,
            };
            return {
                isAuthenticated: true,
                user: userInfo,
                isHydrated: false, // false để App.tsx fetch profile đầy đủ từ server
            };
        } catch (error) {
            localStorage.removeItem("token");
        }
    }
    return {
        isAuthenticated: false,
        user: null,
        isHydrated: true,
    };
};

//Quá ngu nha misaki
// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
// };

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isHydrated = true; // profile đã load xong
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isHydrated = true;
        },
        // Cập nhật từng field trong user state sau khi update profile thành công
        updateProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice;
