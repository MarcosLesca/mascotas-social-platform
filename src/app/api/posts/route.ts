import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { CreatePostData, PostType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as PostType | null;
    const status = searchParams.get('status') || 'approved';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
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
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Error al obtener publicaciones' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const postData: CreatePostData = await request.json();

    // Validaciones básicas
    if (!postData.title || !postData.description || !postData.type) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Generar slug único
    const slug = `${postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50)}-${Date.now()}`;

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
      return NextResponse.json(
        { error: 'Error al crear publicación' },
        { status: 500 }
      );
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
    }

    // Verificar si hubo errores en las inserciones secundarias
    const anyError = petError || contactError || locationError;
    if (anyError) {
      console.error('Error in secondary insertions:', anyError);
      // No borramos el post principal, pero logueamos el error
    }

    return NextResponse.json({
      success: true,
      message: 'Publicación creada correctamente. Está pendiente de aprobación.',
      post,
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}