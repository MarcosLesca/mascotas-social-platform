import type { PostType, PetSize, PetGender, PostStatus } from "./enums";

// Información de contacto
export interface ContactInfo {
  name?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
}

// Ubicación geográfica
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  department?: string; // Ahora opcional para barrio/zona
}

// Imágenes de la mascota
export interface PetImage {
  id: string;
  url: string;
  alt: string;
  size: number;
  uploadedAt: Date;
}

// Información de la mascota
export interface PetInfo {
  name?: string;
  type: string; // perro, gato, etc.
  breed?: string;
  size: PetSize;
  gender: PetGender;
  age?: string;
  color: string;
  description: string;
  distinctiveFeatures?: string;
}

// Publicación principal
export interface Post {
  id: string;
  type: PostType;
  status: PostStatus;
  pet: PetInfo;
  contact: ContactInfo;
  location: Location;
  images: PetImage[];
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  approvedBy?: string; // admin user ID
  slug: string;
}

// Datos para crear publicación (sin los campos generados automáticamente)
export interface CreatePostData {
  type: PostType;
  pet: Omit<PetInfo, 'id'>;
  contact: ContactInfo;
  location: Location;
  images: Omit<PetImage, 'id' | 'uploadedAt'>[];
  title: string;
  description: string;
}

// filtros para buscar publicaciones
export interface PostFilters {
  type?: PostType;
  petType?: string;
  size?: PetSize;
  gender?: PetGender;
  department?: string;
  city?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Respuesta de API con paginación
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Datos para admin
export interface AdminAction {
  postId: string;
  action: 'approve' | 'reject';
  reason?: string;
  adminId: string;
}