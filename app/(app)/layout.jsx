import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function AppLayout({ children }) {
    return (
        <>
            <Navbar />
            <div className="flex flex-1 relative w-full">
                <Sidebar />
                <main className="flex-1 w-full md:px-8" id="main-content">
                    {children}
                </main>
            </div>
            <Footer />
        </>
    );
}
