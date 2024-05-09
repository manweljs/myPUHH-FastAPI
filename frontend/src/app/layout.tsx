import type { Metadata } from "next";
import { APP } from "./APP";
import "@/styles/global.css";
import "@flaticon/flaticon-uicons/css/all/all.css"
import "@/styles/variables.css"
import { cookies } from "next/headers";
import { ACCESS_TOKEN_KEY } from "@/consts";


export const metadata: Metadata = {
  title: "myPUHH",
  description: "myPUHH - Aplikasi Penata Usahaan Hasil Hutan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY);
  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      <APP accessToken={accessToken?.value}>
        {children}
      </APP>
    </html>
  );
}
