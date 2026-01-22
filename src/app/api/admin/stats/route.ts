import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Estadísticas generales
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    const { count: pendingPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: approvedPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: rejectedPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    // Publicaciones por tipo
    const { data: postsByTypeRaw } = await supabase
      .from('posts')
      .select('type')
      .eq('status', 'approved');

    const postsByType = {
      lost: 0,
      adoption: 0,
      donation: 0,
    };

    postsByTypeRaw?.forEach(post => {
      if (post.type in postsByType) {
        postsByType[post.type as keyof typeof postsByType]++;
      }
    });

    // Publicaciones recientes (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .gte('created_at', sevenDaysAgo.toISOString());

    // Publicaciones que expiran pronto (próximos 7 días)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const { count: expiringSoon } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .lte('expires_at', sevenDaysFromNow.toISOString())
      .gte('expires_at', new Date().toISOString());

    const stats = {
      totalPosts: totalPosts || 0,
      pendingPosts: pendingPosts || 0,
      approvedPosts: approvedPosts || 0,
      rejectedPosts: rejectedPosts || 0,
      expiredPosts: (totalPosts || 0) - (approvedPosts || 0) - (rejectedPosts || 0) - (pendingPosts || 0),
      postsByType,
      recentPosts: recentPosts || 0,
      expiringSoon: expiringSoon || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}