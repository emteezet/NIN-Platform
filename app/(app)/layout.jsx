import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div>
                <Sidebar />
                <main>
                    {children}
                    <Footer />
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
