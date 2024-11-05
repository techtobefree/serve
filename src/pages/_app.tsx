import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ height: '100vh', width: '100vw', padding: 20, margin: -20 }}>
      <Outlet />
    </div>
  )
}
