"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const NavLinks = () => (
    <>
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
    </>
  );

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300"
          >
            Task Manager
          </Link>

          {isLoggedIn && (
            <div className="hidden md:flex space-x-6">
              <NavLinks />
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="font-semibold"
              >
                Logout
              </Button>
            ) : (
              <Button asChild variant="secondary" className="font-semibold">
                <Link href="/login">Login</Link>
              </Button>
            )}

            {isLoggedIn && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col space-y-4 mt-6">
                    <NavLinks />
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
