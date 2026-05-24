import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { AudioPlayerBar } from "@/components/audio/audio-player-bar";

export const dynamic = "force-dynamic";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-4">{children}</main>
      <Footer />
      <AudioPlayerBar />
      <MobileNav />
    </div>
  );
}
