import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_KEY } from './consts';

export function middleware(request: NextRequest) {

    const cookie = cookies()
    // Mengabaikan permintaan HMR
    if (request.url.includes('/_next/webpack-hmr')) {
        return NextResponse.next();
    }


    const accessToken = cookie.get(ACCESS_TOKEN_KEY);
    if (!accessToken) {
        return NextResponse.redirect('/login');
    }
    return NextResponse.next();
}

// Config Middleware untuk hanya matcher ke rute aplikasi utama
export const config = {
    matcher: ['/', '/about', '/dashboard'], // Tambahkan rute yang sesuai aplikasimu
};
