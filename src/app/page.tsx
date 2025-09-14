import FullscreenHero from "./components/FullscreenHero";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import SmartNavigation from "./components/SmartNavigation";

export default function Home() {
  return (
    <>
      <SmartNavigation fullscreenMode={true} />
      <FullscreenHero />
      <MainContent />
      <Footer />
    </>
  );
}
