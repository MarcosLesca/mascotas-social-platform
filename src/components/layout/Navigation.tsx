import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={cn(
      "sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-neutral-200 dark:border-neutral-700 transition-elegant",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center space-x-4 transition-elegant hover-lift"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-elegant">
              <span className="text-white font-bold text-xl">MS</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-2xl block">Mascotas San Justo</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">Conectando corazones</span>
            </div>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                href="/perdidas"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl font-medium transition-all duration-200"
              >
                Perdidas
              </Link>
              <Link 
                href="/adopcion"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl font-medium transition-all duration-200"
              >
                Adopción
              </Link>
              <Link 
                href="/donaciones"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-xl font-medium transition-all duration-200"
              >
                Ayuda
              </Link>
            </div>

            {/* Main CTA Button */}
            <Link 
              href="/publicar"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Publicar
            </Link>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {/* Mobile Menu Toggle */}
              <button className="p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 border border-neutral-200 dark:border-neutral-700 lg:hidden">
                <div className="w-6 h-5 space-y-1.5 flex flex-col justify-center">
                  <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-200"></div>
                  <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-200"></div>
                  <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-200"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}