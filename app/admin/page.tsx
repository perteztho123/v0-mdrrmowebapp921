import type { Metadata } from "next"
import AdminDashboard from "@/components/admin-dashboard"

export const metadata: Metadata = {
  title: "MDRRMO Admin Panel",
  description: "Admin dashboard for MDRRMO Pio Duran",
}

export default function AdminPage() {
  return <AdminDashboard />
}
