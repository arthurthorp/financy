import { Toaster } from "@/components/ui/sonner";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="mx-auto px-6 md:px-12 py-4 md:py-12">{children}</main>
      <Toaster />
    </div>
  );
}
