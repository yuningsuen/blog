import SmartNavigation from "../components/SmartNavigation";
import CV from "../components/CV";
import Footer from "../components/Footer";

export const metadata = {
  title: "CV",
  description: "Learn more about me.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <SmartNavigation />
      <main className="flex-1 pt-20">
        <CV />
      </main>
      <Footer />
    </div>
  );
}
