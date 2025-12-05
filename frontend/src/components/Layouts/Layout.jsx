import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();

  const hideLayoutFor = ["/login", "/register"];

  const shouldHideLayout = hideLayoutFor.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <NavigationBar />}

      <main className="main-content">
        <Outlet />
      </main>

      {!shouldHideLayout && <Footer />}
    </>
  );
}