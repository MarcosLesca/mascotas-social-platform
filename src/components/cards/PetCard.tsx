import Link from "next/link";
import type { Post } from "@/types/post";

interface PetCardProps {
  post: Post;
  className?: string;
}

export function PetCard({ post, className = "" }: PetCardProps) {
  const statusColors = {
    lost: "bg-rose-500 text-white",
    found: "bg-emerald-500 text-white", 
    adoption: "bg-sky-500 text-white",
    donation: "bg-sky-600 text-white"
  };

  const statusLabels = {
    lost: "Perdida",
    found: "Encontrada",
    adoption: "En Adopción", 
    donation: "Necesita Ayuda"
  };

  const typeColors = {
    lost: "border-rose-200 hover:border-rose-300",
    found: "border-emerald-200 hover:border-emerald-300",
    adoption: "border-sky-200 hover:border-sky-300",
    donation: "border-sky-300 hover:border-sky-400"
  };

  return (
    <Link 
      href={`/publicacion/${post.slug}`}
      className={`
        group block bg-white border-2 rounded-3xl overflow-hidden 
        transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl interactive
        ${typeColors[post.type]} ${className}
      `}
    >
      {/* Status Badge */}
      <div className={`px-6 py-3 text-center font-bold text-sm ${statusColors[post.type]}`}>
        {statusLabels[post.type]}
      </div>
      
      <div className="p-8">
        {/* Image Container */}
        <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200">
          {post.images.length > 0 ? (
            <img 
              src={post.images[0].url} 
              alt={post.images[0].alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-neutral-300 rounded-xl"></div>
            </div>
          )}
          
          {/* Image overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="font-bold text-2xl text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
            {post.title}
          </h3>
          
          {/* Pet Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="font-medium">Tipo:</span>
              <span className="capitalize">{post.pet.type}</span>
              {post.pet.breed && <span>· {post.pet.breed}</span>}
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="font-medium">Tamaño:</span>
              <span className="capitalize">
                {post.pet.size === 'small' ? 'Pequeño' : 
                 post.pet.size === 'medium' ? 'Mediano' : 'Grande'}
              </span>
              <span>·</span>
              <span className="capitalize">
                {post.pet.gender === 'male' ? 'Macho' : 
                 post.pet.gender === 'female' ? 'Hembra' : 'Desconocido'}
              </span>
            </div>
          </div>
          
          {/* Description Preview */}
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {post.description}
          </p>
          
          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span>{post.location.city}, {post.location.department}</span>
          </div>
          
          {/* Time & Contact */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              Contactar →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Helper function to format dates
function formatDate(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Hoy";
  if (diffInDays === 1) return "Ayer";
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
  return `Hace ${Math.floor(diffInDays / 30)} meses`;
}

// Skeleton Card for loading states
export function PetCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
        <div className="bg-gray-300 h-12"></div>
        <div className="p-8 space-y-4">
          <div className="aspect-square bg-gray-200 rounded-2xl"></div>
          <div className="h-8 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}