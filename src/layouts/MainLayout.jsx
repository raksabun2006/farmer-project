import { Outlet } from "react-router";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const MainLayout = () => {
  return (
    /* 
          Using flexbox utilities (flex flex-col min-h-screen) forces 
          the footer to stick to the exact bottom of the screen, 
          even if a page has very little content (like your 404 page).
        */
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Global Navigation Bar Header */}
      <Navbar />

      {/* 2. Dynamic Main View Area Container */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl animate-fadeIn">
        {/* 
                  The <Outlet /> is a placeholder component. React Router automatically 
                  injects whichever child page matches the current URL path right here 
                  (e.g., Home, Login, Register, or Farmer Dashboard).
                */}
        <Outlet />
      </main>

      {/* 3. Global Marketplace Footer Layout */}
      <Footer />
    </div>
  );
};

export default MainLayout;
