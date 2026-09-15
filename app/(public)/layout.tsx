import CustomCursor from "@/components/public/CustomCursor";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import SmoothScroll from "@/components/public/SmoothScroll";
import { TrackView } from "@/components/public/TrackView";
import { getSiteSettings } from "@/lib/db/public";

export const revalidate = 3600;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <SmoothScroll />
      <TrackView />
      <CustomCursor />
      <Navbar name={settings.display_name} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
