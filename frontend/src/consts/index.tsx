
export const ACCESS_TOKEN_KEY = "access_token";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const PRIMARY_COLOR = "#0AAA08"

export const LOGO_DEFAULT = "/images/office.png";

type PageInfo = {
    TITLE: string,
    URL: string
};

type PageTitle = "HOME" | "LOGIN" | "LOGOUT" | "REGISTER" | "PROFILE" | "DASHBOARD" | "ADMIN" | "USER" | "PARAMETER" | "LAPORAN" | "LHP" | "LHC" | "PENGANGKUTAN" | "RENCANA_TEBANG" | "STOK" | "BUKU_UKUR";
// Objek konstan yang memiliki informasi halaman
export const PAGE: Record<PageTitle, PageInfo> = {
    HOME: { TITLE: "Home", URL: "/" },
    LOGIN: { TITLE: "Login", URL: "/login" },
    LOGOUT: { TITLE: "Logout", URL: "/logout" },
    REGISTER: { TITLE: "Register", URL: "/register" },
    PROFILE: { TITLE: "Profile", URL: "/profile" },
    DASHBOARD: { TITLE: "Dashboard", URL: "/" },
    ADMIN: { TITLE: "Admin", URL: "/admin" },
    USER: { TITLE: "User", URL: "/user" },
    PARAMETER: { TITLE: "Parameter", URL: "/parameter" },
    LAPORAN: { TITLE: "Laporan", URL: "/laporan" },
    LHP: { TITLE: "LHP", URL: "/lhp" },
    LHC: { TITLE: "LHC", URL: "/lhc" },
    PENGANGKUTAN: { TITLE: "Pengangkutan", URL: "/pengangkutan" },
    RENCANA_TEBANG: { TITLE: "Rencana Tebang", URL: "/rencana-tebang" },
    STOK: { TITLE: "Stok", URL: "/stok" },
    BUKU_UKUR: { TITLE: "Buku Ukur", URL: "/buku-ukur" },
};


export enum FORMAT {
    DATE = "DD-MM-YYYY",
}


export enum JENIS_TPK {
    TPK_HUTAN = 0,
    TPK_ANTARA
}

export enum OBYEK {
    BLOK_PETAK = 0,
    TRASE_JALAN
}

export enum ALAT_ANGKUT {
    LOGGING_TRUCK = 0,
    TONGKANG,
    RAKIT
}