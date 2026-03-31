import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { UIProvider } from "@/components/UIContext";

export default function AppLayout({ children }) {
    return (
        <UIProvider>
            <div className="flex flex-col h-dvh overflow-hidden">
                <Navbar />
                <div className="flex flex-1 overflow-hidden pt-16">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto scroll-smooth">
                        <div className="min-h-full flex flex-col pb-24 md:pb-0">
                            <div className="flex-1">
                                {children}
                            </div>
                            <Footer />
                        </div>
                    </main>
                </div>
                <BottomNav />
            </div>
        </UIProvider>
    );
}
