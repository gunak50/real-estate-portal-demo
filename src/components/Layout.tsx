import { Outlet } from 'react-router-dom';
import ChatDrawer from './ChatDrawer';
import CompareBar from './CompareBar';
import Footer from './Footer';
import Navbar from './Navbar';
import Toaster from './Toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
      <ChatDrawer />
      <Toaster />
    </div>
  );
}
