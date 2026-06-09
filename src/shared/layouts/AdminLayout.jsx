// src/shared/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export default function AdminLayout() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#F8FAFC",
        fontFamily: FONT,
      }}
    >
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            background: "#fff",
            borderBottom: "0.5px solid #E5E7EB",
            height: 52,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 600,
              color: "#111827",
              margin: 0,
            }}
          >
            Panel de Administración
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#9CA3AF",
                background: "#F3F4F6",
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              Super Admin
            </span>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
