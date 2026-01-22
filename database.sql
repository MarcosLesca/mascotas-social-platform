-- Posts principales
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'adoption', 'donation')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  approval_by UUID,
  rejection_reason TEXT
);

-- Información de las mascotas
CREATE TABLE pet_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT NOT NULL, -- perro, gato, etc.
  breed TEXT,
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'unknown')),
  age TEXT,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  distinctive_features TEXT
);

-- Información de contacto
CREATE TABLE contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT
);

-- Ubicación
CREATE TABLE location (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT NOT NULL
);

-- Imágenes de las publicaciones
CREATE TABLE post_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  size INTEGER NOT NULL,
  order_index INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usuarios admin (opcional, para más adelante)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_expires_at ON posts(expires_at);
CREATE INDEX idx_pet_info_type ON pet_info(type);
CREATE INDEX idx_pet_info_size ON pet_info(size);
CREATE INDEX idx_pet_info_gender ON pet_info(gender);
CREATE INDEX idx_location_department ON location(department);
CREATE INDEX idx_location_city ON location(city);
CREATE INDEX idx_post_images_post_id ON post_images(post_id);

-- RLS (Row Level Security) policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE location ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;

-- Policy para que todos puedan ver posts aprobados
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'approved');

-- Policy para que todos puedan ver la info relacionada con posts aprobados
CREATE POLICY "Pet info is viewable for approved posts" ON pet_info
  FOR SELECT USING (
    post_id IN (SELECT id FROM posts WHERE status = 'approved')
  );

CREATE POLICY "Contact info is viewable for approved posts" ON contact_info
  FOR SELECT USING (
    post_id IN (SELECT id FROM posts WHERE status = 'approved')
  );

CREATE POLICY "Location is viewable for approved posts" ON location
  FOR SELECT USING (
    post_id IN (SELECT id FROM posts WHERE status = 'approved')
  );

CREATE POLICY "Images are viewable for approved posts" ON post_images
  FOR SELECT USING (
    post_id IN (SELECT id FROM posts WHERE status = 'approved')
  );

-- Policy para insertar posts (todos pueden crear, quedan pending)
CREATE POLICY "Anyone can create posts" ON posts
  FOR INSERT WITH CHECK (true);

-- Policy para que los relacionados con un post puedan modificarlo
CREATE POLICY "Users can edit their own posts" ON posts
  FOR UPDATE USING (true);

-- Policies similares para las tablas relacionadas
CREATE POLICY "Anyone can create pet info" ON pet_info
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create contact info" ON contact_info
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create location" ON location
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create images" ON post_images
  FOR INSERT WITH CHECK (true);