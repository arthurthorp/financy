import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import logoIcon from "@/assets/logo.svg";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Anchor } from "./ui/anchor";
import { getInitials } from "@/utils/getInitials";

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

  if (isLoginOrRegisterPage) return <></>;

  return (
    <div className="w-full bg-white border-b-gray-200 h-17.25 px-12 py-4">
      {isAuthenticated && (
        <div className="flex justify-between w-full">
          <div className="min-w-48">
            <img src={logoIcon} />
          </div>
          <div className="flex items-center gap-4">
            <Anchor
              className="text-gray-600 hover:text-primary hover:no-underline! hover:font-semibold transition-all duration-200"
              active={isDashboardPage}
              to="/dashboard"
            >
              Dashboard
            </Anchor>

            <Anchor
              className="text-gray-600 hover:text-primary hover:no-underline! hover:font-semibold transition-all duration-200"
              active={isTransactionsPage}
              to="/transactions"
            >
              Transações
            </Anchor>

            <Anchor
              className="text-gray-600 hover:text-primary hover:no-underline! hover:font-semibold transition-all duration-200"
              active={isCategoriesPage}
              to="/categories"
            >
              Categorias
            </Anchor>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Avatar>
                  <AvatarFallback className="bg-gray-300 text-gray-800">
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}></Button>
          </div>
        </div>
      )}
    </div>
  );
}
