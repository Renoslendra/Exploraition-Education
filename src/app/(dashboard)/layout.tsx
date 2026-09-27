import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardAuthGuard from "@/components/auth/DashboardAuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4] print:bg-white print:min-h-0">
      <Navbar />
      <main className="flex-1 flex flex-col pt-[64px] print:pt-0 print:m-0 print:p-0">
        <DashboardAuthGuard>{children}</DashboardAuthGuard>
      </main>
      <Footer />
    </div>
  );
}
