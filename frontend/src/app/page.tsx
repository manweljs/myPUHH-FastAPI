import Image from "next/image";
import styles from "./page.module.css";
import { ACCESS_TOKEN_KEY, PAGE } from "@/consts";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/home/Home"), { ssr: false });


export default function page() {

  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY);
  if (!accessToken) {
    redirect(PAGE.LOGIN.URL);
  }

  return (
    <Home />
  );
}
