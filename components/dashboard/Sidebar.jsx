"use client";

import { sidebarItems } from "@/data/dashBoardSidebar";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // Clear NextAuth session cookies
    document.cookie = "next-auth.session-token=; Max-Age=0; path=/; domain=" + window.location.hostname;
    document.cookie = "__Secure-next-auth.session-token=; Max-Age=0; path=/; domain=" + window.location.hostname;

    // Perform sign out and redirect
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="sidebar -dashboard">
      {sidebarItems.map((elm, i) =>
        elm.text === "Logout" ? (
          <div
            key={i}
            className={`sidebar__item ${pathname === elm.href ? "-is-active" : ""}`}
            onClick={handleLogout} // Trigger logout when "Logout" is clicked
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex items-center text-17 lh-1 fw-500 ">
              <i className={`${elm.iconClass} mr-15`}></i>
              {elm.text}
            </div>
          </div>
        ) : (
          <div
            key={i}
            className={`sidebar__item ${pathname === elm.href ? "-is-active" : ""}`}
          >
            <Link
              key={i}
              href={elm.href}
              className="d-flex items-center text-17 lh-1 fw-500 "
            >
              <i className={`${elm.iconClass} mr-15`}></i>
              {elm.text}
            </Link>
          </div>
        )
      )}
    </div>
  );
}
