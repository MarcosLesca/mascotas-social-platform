// Usuario admin
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Sesión de admin
export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: Date;
}

// Acciones de admin para auditoría
export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: 'approve_post' | 'reject_post' | 'delete_post' | 'update_post';
  postId?: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

// Estadísticas para dashboard
export interface DashboardStats {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  expiredPosts: number;
  postsByType: {
    lost: number;
    adoption: number;
    donation: number;
  };
  recentPosts: number;
  expiringSoon: number;
}

// Notificaciones internas (si las agregamos después)
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string; // si es para admin específico
}