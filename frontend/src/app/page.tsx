
import { ACCESS_TOKEN_KEY, PAGE } from "@/consts";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/dashboard/Dashboard"), { ssr: false });


export default function page() {

  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY);
  if (!accessToken) {
    redirect(PAGE.LOGIN.URL);
  }

  return (
    <Dashboard />
  );
}
