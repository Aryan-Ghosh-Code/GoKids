import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  );
}
