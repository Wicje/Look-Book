import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let domain = searchParams.get('domain') || 'kith.com';

  // Sanitize domain
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

  try {
    const url = `https://${domain}/products.json?limit=20`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LookbookBuilder/1.0',
        'Accept': 'application/json'
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch products from ${domain}. Check store URL.` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const rawProducts = data.products || [];

    const products = rawProducts.map((p: any) => {
      const primaryImage = p.images && p.images.length > 0 ? p.images[0].src : '';
      const category = inferCategory(p.product_type || p.title || '');

      return {
        id: `shopify-${p.id}`,
        title: p.title,
        category,
        imageUrl: primaryImage,
        tags: [p.vendor || 'Shopify', category, ...(p.tags || []).slice(0, 3)],
        colorPalette: ['#1A1C1F', '#4A4E53', '#8C8C8C', '#E5E5E5'],
        fabric: p.variants && p.variants[0] ? p.variants[0].title : 'Standard Spec',
        sku: p.variants && p.variants[0] && p.variants[0].sku ? p.variants[0].sku : `SKU-${p.id}`
      };
    }).filter((p: any) => p.imageUrl !== '');

    return NextResponse.json({
      domain,
      count: products.length,
      products
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to connect to store API' },
      { status: 500 }
    );
  }
}

function inferCategory(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('coat') || t.includes('jacket') || t.includes('trench') || t.includes('parka') || t.includes('outerwear')) {
    return 'Outerwear';
  }
  if (t.includes('blazer') || t.includes('suit') || t.includes('pant') || t.includes('trouser') || t.includes('tailor')) {
    return 'Tailoring';
  }
  if (t.includes('sweater') || t.includes('knit') || t.includes('cardigan') || t.includes('hoodie') || t.includes('turtleneck')) {
    return 'Knitwear';
  }
  if (t.includes('boot') || t.includes('shoe') || t.includes('sneaker') || t.includes('loafer') || t.includes('footwear')) {
    return 'Footwear';
  }
  if (t.includes('bag') || t.includes('hat') || t.includes('belt') || t.includes('glasses') || t.includes('accessory')) {
    return 'Accessories';
  }
  return 'Tailoring';
}
