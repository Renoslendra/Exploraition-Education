import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4]">
      <Navbar />
      <main className="flex-1 flex flex-col pt-[64px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
