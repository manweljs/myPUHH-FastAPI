import type { Metadata } from "next";
import { APP } from "./APP";
import "@/styles/global.css";
import "@flaticon/flaticon-uicons/css/all/all.css"
import "@/styles/variables.css"
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-grids/styles/material.css';
import '@syncfusion/ej2-react-spreadsheet/styles/material.css';
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
  const syncfusionKey = process.env.SYNCFUSTION_LICENSE_KEY;
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY);
  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      <APP accessToken={accessToken?.value} syncfusionKey={syncfusionKey}>
        {children}
      </APP>
    </html>
  );
}
