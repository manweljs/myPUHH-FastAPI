// UserContext.tsx
import { GetUser } from '@/api';
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
};

const defaultState: UserContextType = {
    user: null,
    setUser: () => { },
    perusahaan: null,
    setPerusahaan: () => { },
    navigate: () => { },
    page: PAGE.HOME.TITLE,
    setPage: () => { }

};

const UserContext = createContext<UserContextType>(defaultState);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [perusahaan, setPerusahaan] = useState<Perusahaan | null>(null)
    const [page, setPage] = useState<string>(PAGE.HOME.TITLE)

    const router = useRouter()

    const navigate = (path: string) => {
        router.push(path)
    }
    const value = { user, setUser, perusahaan, setPerusahaan, navigate, page, setPage };

    const handleGetUser = async () => {
        const response = await GetUser()
        console.log('response', response)
        setUser(response)
    }

    useEffect(() => {
        const accessToken = getToken()
        if (!user && accessToken) {
            handleGetUser()
        }
    }, [user]);

    // console.log('user', user)
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


