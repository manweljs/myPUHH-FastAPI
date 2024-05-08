
export const ACCESS_TOKEN_KEY = "access_token";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type PageInfo = {
    TITLE: string,
    URL: string
};

// Objek konstan yang memiliki informasi halaman
export const PAGE: Record<string, PageInfo> = {
    HOME: { TITLE: "Home", URL: "/" },
    LOGIN: { TITLE: "Login", URL: "/login" },
    REGISTER: { TITLE: "Register", URL: "/register" },
    PROFILE: { TITLE: "Profile", URL: "/profile" },
    DASHBOARD: { TITLE: "Dashboard", URL: "/dashboard" },
    ADMIN: { TITLE: "Admin", URL: "/admin" },
    USER: { TITLE: "User", URL: "/user" },
};
