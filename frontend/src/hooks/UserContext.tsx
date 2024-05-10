// UserContext.tsx
import { GetPerusahaan, GetUser } from '@/api';
import { PAGE } from '@/consts';
import { getToken } from '@/functions';
import { Perusahaan, User } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';


type UserContextType = {
    user: User | null;
    setUser: (user: User) => void;
    perusahaan: Perusahaan | null;
    setPerusahaan: (perusahaan: Perusahaan) => void;
    navigate: (path: string) => void;
    page: string;
    setPage: (page: string) => void;
    minimizeSidebar: boolean;
    setMinimizeSidebar: Dispatch<SetStateAction<boolean>>;
    theme: string;
    setTheme: Dispatch<SetStateAction<string>>;
};

const defaultState: UserContextType = {
    user: null,
    setUser: () => { },
    perusahaan: null,
    setPerusahaan: () => { },
    navigate: () => { },
    page: PAGE.HOME.TITLE,
    setPage: () => { },
    minimizeSidebar: false,
    setMinimizeSidebar: () => { },
    theme: "light",
    setTheme: () => { }

};

const UserContext = createContext<UserContextType>(defaultState);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [perusahaan, setPerusahaan] = useState<Perusahaan | null>(null)
    const [page, setPage] = useState<string>(PAGE.DASHBOARD.TITLE)
    const [minimizeSidebar, setMinimizeSidebar] = useState<boolean>(false)
    const [theme, setTheme] = useState<string>("light")

    const router = useRouter()

    const navigate = (path: string) => {
        router.push(path)
    }
    const value = {
        user,
        setUser,
        perusahaan,
        setPerusahaan,
        navigate,
        page,
        setPage,
        minimizeSidebar,
        setMinimizeSidebar,
        theme,
        setTheme
    };

    const handleGetUser = async () => {
        const user = await GetUser()
        const perusahaan = await GetPerusahaan()
        setUser(user)
        setPerusahaan(perusahaan)
    }

    useEffect(() => {
        const accessToken = getToken()
        if (!user && accessToken) {
            handleGetUser()
        }
    }, [user]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};


export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};


