import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'editorial fashion coat blazer';

  try {
    // Call live Unsplash public search source endpoint
    const searchUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=16`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch images from Unsplash API' }, { status: res.status });
    }

    const data = await res.json();
    const results = data.results || [];

    const assets = results.map((item: any) => ({
      id: `unsplash-${item.id}`,
      title: item.alt_description || item.description || 'Editorial Fashion Silhouette',
      category: inferCategoryFromQuery(item.alt_description || query),
      imageUrl: item.urls?.raw ? `${item.urls.raw}&auto=format&fit=crop&w=1000&q=80` : item.urls?.regular,
      tags: ['UnsplashLive', ...(item.tags || []).slice(0, 3).map((t: any) => t.title)],
      colorPalette: item.color ? [item.color, '#2A2A2A', '#8C8C8C', '#E5E5E5'] : ['#1E1E1E', '#4A4A4A', '#8C8C8C'],
      fabric: 'Editorial High-Fashion Spec',
      sku: `UNSP-${item.id.substring(0, 6).toUpperCase()}`
    }));

    return NextResponse.json({ query, count: assets.length, assets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error connecting to Unsplash API' }, { status: 500 });
  }
}

function inferCategoryFromQuery(text: string): string {
  const t = (text || '').toLowerCase();
  if (t.includes('coat') || t.includes('trench') || t.includes('outerwear')) return 'Outerwear';
  if (t.includes('blazer') || t.includes('suit') || t.includes('dress') || t.includes('trouser')) return 'Tailoring';
  if (t.includes('sweater') || t.includes('knit') || t.includes('turtleneck')) return 'Knitwear';
  if (t.includes('boot') || t.includes('shoe')) return 'Footwear';
  if (t.includes('bag') || t.includes('hat') || t.includes('accessory')) return 'Accessories';
  return 'Tailoring';
}
