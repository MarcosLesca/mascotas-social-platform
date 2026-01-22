import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={cn(
      "sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200 transition-elegant",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center space-x-4 transition-elegant hover-lift interactive"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-elegant">
              <span className="text-white font-bold text-xl">MS</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-2xl block">Mascotas San Justo</span>
              <span className="text-sm text-gray-500 block">Conectando corazones</span>
            </div>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                href="/perdidas"
                className="px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-all duration-200 interactive"
              >
                Perdidas
              </Link>
              <Link 
                href="/adopcion"
                className="px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl font-medium transition-all duration-200 interactive"
              >
                Adopción
              </Link>
              <Link 
                href="/donaciones"
                className="px-4 py-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl font-medium transition-all duration-200 interactive"
              >
                Ayuda
              </Link>
            </div>

            {/* Main CTA Button */}
            <Link 
              href="/publicar"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 interactive"
            >
              Publicar
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button className="p-3 rounded-xl hover:bg-neutral-50 transition-all duration-200 border border-neutral-200 lg:hidden interactive">
              <div className="w-6 h-5 space-y-1.5 flex flex-col justify-center">
                <div className="w-full h-0.5 bg-gray-600 transition-all duration-200"></div>
                <div className="w-full h-0.5 bg-gray-600 transition-all duration-200"></div>
                <div className="w-full h-0.5 bg-gray-600 transition-all duration-200"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}