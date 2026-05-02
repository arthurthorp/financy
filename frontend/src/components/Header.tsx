import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import logoIcon from "@/assets/logo.svg";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getInitials } from "@/utils/getInitials";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";

import { MenuIcon, LogOutIcon } from "lucide-react";

function NavLinks({
  isDashboardPage,
  isTransactionsPage,
  isCategoriesPage,
}: {
  isDashboardPage: boolean;
  isTransactionsPage: boolean;
  isCategoriesPage: boolean;
}) {
  return (
    <>
      <Link
        className={`px-2 text-gray-600 hover:text-primary transition ${
          isDashboardPage ? "text-primary font-semibold" : ""
        }`}
        to="/dashboard"
      >
        Dashboard
      </Link>

      <Link
        className={`px-2 text-gray-600 hover:text-primary transition ${
          isTransactionsPage ? "text-primary font-semibold" : ""
        }`}
        to="/transactions"
      >
        Transações
      </Link>

      <Link
        className={`px-2 text-gray-600 hover:text-primary transition ${
          isCategoriesPage ? "text-primary font-semibold" : ""
        }`}
        to="/categories"
      >
        Categorias
      </Link>
    </>
  );
}

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardPage = location.pathname === "/dashboard";
  const isTransactionsPage = location.pathname === "/transactions";
  const isCategoriesPage = location.pathname === "/categories";
  const isLoginOrRegisterPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoginOrRegisterPage || !isAuthenticated) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 h-17.25 px-6 md:px-12 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="min-w-40">
          <img src={logoIcon} alt="logo" />
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavLinks
            isDashboardPage={isDashboardPage}
            isTransactionsPage={isTransactionsPage}
            isCategoriesPage={isCategoriesPage}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Link to="/profile">
              <Avatar>
                <AvatarFallback className="bg-gray-300 text-gray-800">
                  {getInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72">
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gray-300 text-gray-800">
                        {getInitials(user?.name || "")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-sm font-medium">{user?.name}</div>
                  </div>
                </SheetHeader>

                <div className="flex flex-col gap-4">
                  <NavLinks
                    isDashboardPage={isDashboardPage}
                    isTransactionsPage={isTransactionsPage}
                    isCategoriesPage={isCategoriesPage}
                  />

                  <Button
                    variant="ghost"
                    className="justify-start gap-2 mt-4"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
