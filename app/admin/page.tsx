import { redirect } from "next/navigation";

export const metadata = {
  title: "Panel administrativo",
};

export default function AdminPage() {
  redirect("/");
}
