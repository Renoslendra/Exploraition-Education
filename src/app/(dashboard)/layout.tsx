import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardAuthGuard from "@/components/auth/DashboardAuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4]">
      <Navbar />
      <main className="flex-1 flex flex-col pt-[64px]">
        <DashboardAuthGuard>{children}</DashboardAuthGuard>
      </main>
      <Footer />
    </div>
  );
}
