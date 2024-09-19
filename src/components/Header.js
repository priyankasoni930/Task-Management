"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            {/* <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300"
            >
              Task Manager
            </Link> */}
            {isLoggedIn && (
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/tasks"
                  className="text-white hover:text-gray-200 transition duration-300"
                >
                  Tasks
                </Link>
                <Link
                  href="/kanban"
                  className="text-white hover:text-gray-200 transition duration-300"
                >
                  Kanban
                </Link>
              </div>
            )}
          </div>
          <div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        {isLoggedIn && (
          <div className="mt-4 md:hidden">
            <Link
              href="/tasks"
              className="block text-white hover:text-gray-200 mb-2 transition duration-300"
            >
              Tasks
            </Link>
            <Link
              href="/kanban"
              className="block text-white hover:text-gray-200 transition duration-300"
            >
              Kanban
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
