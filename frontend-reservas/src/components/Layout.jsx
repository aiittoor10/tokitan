// src/components/Layout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <main style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
