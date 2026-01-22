import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Publicación no encontrada' },
          { status: 404 }
        );
      }
      console.error('Error fetching post:', error);
      return NextResponse.json(
        { error: 'Error al obtener publicación' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason, adminId } = body;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción no válida' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updated_at: new Date().toISOString(),
    };

    if (action === 'approve') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = adminId;
    } else {
      updateData.rejected_at = new Date().toISOString();
      updateData.rejection_reason = reason;
    }

    const { data: post, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return NextResponse.json(
        { error: 'Error al actualizar publicación' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Publicación ${action === 'approve' ? 'aprobada' : 'rechazada'} correctamente`,
      post,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}