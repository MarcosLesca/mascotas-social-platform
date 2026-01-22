"use server";

import { revalidatePath } from 'next/cache';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { CreatePostData, Post, PostType, PostFilters } from '@/types';
import { generateSlug } from '@/lib/utils';

// Obtener publicaciones con filtros
export async function getPosts(filters?: PostFilters, page = 1, limit = 12) {
  try {
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select(`
        *,
        pet_info (*),
        contact_info (*),
        location (*),
        post_images (*)
      `, { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.petType) {
      query = query.eq('pet_info.type', filters.petType);
    }
    if (filters?.size) {
      query = query.eq('pet_info.size', filters.size);
    }
    if (filters?.gender) {
      query = query.eq('pet_info.gender', filters.gender);
    }
    if (filters?.department) {
      query = query.eq('location.department', filters.department);
    }
    if (filters?.city) {
      query = query.eq('location.city', filters.city);
    }

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return {
      data: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

// Obtener publicación por ID
export async function getPostById(id: string) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        pet_info (*),
        contact_info (*),
        location (*),
        post_images (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return post;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Crear nueva publicación
export async function createPost(postData: CreatePostData) {
  try {
    // Validaciones básicas
    if (!postData.title || !postData.description || !postData.type) {
      return {
        success: false,
        error: 'Faltan campos requeridos',
      };
    }

    // Generar slug único
    const slug = generateSlug(postData.title) + `-${Date.now()}`;

    // Fecha de expiración (1 mes desde ahora)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Insertar publicación principal
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        title: postData.title,
        description: postData.description,
        type: postData.type,
        status: 'pending',
        slug,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
      return {
        success: false,
        error: `Error al crear publicación: ${postError.message}`,
      };
    }

    // Insertar información de la mascota
    const { error: petError } = await supabaseAdmin
      .from('pet_info')
      .insert({
        post_id: post.id,
        name: postData.pet.name,
        type: postData.pet.type,
        breed: postData.pet.breed,
        size: postData.pet.size,
        gender: postData.pet.gender,
        age: postData.pet.age,
        color: postData.pet.color,
        description: postData.pet.description,
        distinctive_features: postData.pet.distinctiveFeatures,
      });

    if (petError) {
      console.error('Error inserting pet info:', petError);
      return {
        success: false,
        error: `Error al guardar información de la mascota: ${petError.message}`,
      };
    }

    // Insertar información de contacto
    const { error: contactError } = await supabaseAdmin
      .from('contact_info')
      .insert({
        post_id: post.id,
        name: postData.contact.name,
        phone: postData.contact.phone,
        email: postData.contact.email,
        whatsapp: postData.contact.whatsapp,
      });

    if (contactError) {
      console.error('Error inserting contact info:', contactError);
      return {
        success: false,
        error: `Error al guardar información de contacto: ${contactError.message}`,
      };
    }

    // Insertar ubicación
    const { error: locationError } = await supabaseAdmin
      .from('location')
      .insert({
        post_id: post.id,
        latitude: postData.location.latitude,
        longitude: postData.location.longitude,
        address: postData.location.address,
        city: postData.location.city,
        department: postData.location.department,
      });

    if (locationError) {
      console.error('Error inserting location:', locationError);
      return {
        success: false,
        error: `Error al guardar ubicación: ${locationError.message}`,
      };
    }

    // Insertar imágenes
    if (postData.images && postData.images.length > 0) {
      const imagesToInsert = postData.images.map((image, index) => ({
        post_id: post.id,
        url: image.url,
        alt: image.alt,
        size: image.size,
        order_index: index,
      }));

      const { error: imagesError } = await supabaseAdmin
        .from('post_images')
        .insert(imagesToInsert);

      if (imagesError) {
        console.error('Error inserting images:', imagesError);
        return {
          success: false,
          error: `Error al guardar imágenes: ${imagesError.message}`,
        };
      }
    }

    // Revalidar caché
    revalidatePath('/');
    revalidatePath('/perdidas');
    revalidatePath('/adopcion');
    revalidatePath('/donaciones');

    return {
      success: true,
      message: 'Publicación creada correctamente. Está pendiente de aprobación.',
      post,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'Error interno del servidor',
    };
  }
}

// Obtener publicaciones pendientes (para admin)
export async function getPendingPosts() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        pet_info (*),
        contact_info (*),
        location (*),
        post_images (*)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending posts:', error);
      return [];
    }

    return posts || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

// Aprobar publicación
export async function approvePost(postId: string, adminId: string) {
  try {
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error approving post:', error);
      return {
        success: false,
        error: 'Error al aprobar publicación',
      };
    }

    // Revalidar caché
    revalidatePath('/');
    revalidatePath('/perdidas');
    revalidatePath('/adopcion');
    revalidatePath('/donaciones');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Publicación aprobada correctamente',
      post,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'Error interno del servidor',
    };
  }
}

// Rechazar publicación
export async function rejectPost(postId: string, reason: string, adminId: string) {
  try {
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error rejecting post:', error);
      return {
        success: false,
        error: 'Error al rechazar publicación',
      };
    }

    // Revalidar caché
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Publicación rechazada correctamente',
      post,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'Error interno del servidor',
    };
  }
}