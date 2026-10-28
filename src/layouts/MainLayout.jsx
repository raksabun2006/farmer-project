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
    <div className="flex min-h-screen flex-col bg-[#f8faf8] text-[#26332c]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
