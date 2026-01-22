// Estados de las publicaciones
export const POST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved", 
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

// Tipos de publicaciones
export const POST_TYPE = {
  LOST: "lost",
  ADOPTION: "adoption",
  DONATION: "donation",
} as const;

// Tamaños de mascotas
export const PET_SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

// Sexos de mascotas
export const PET_GENDER = {
  MALE: "male",
  FEMALE: "female",
  UNKNOWN: "unknown",
} as const;

// Extraer tipos
export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
export type PostType = (typeof POST_TYPE)[keyof typeof POST_TYPE];
export type PetSize = (typeof PET_SIZE)[keyof typeof PET_SIZE];
export type PetGender = (typeof PET_GENDER)[keyof typeof PET_GENDER];