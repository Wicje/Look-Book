import { AssetItem, LookbookProject, Collaborator } from '../types/lookbook';

export const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    id: 'col-1',
    name: 'Camille Laurent',
    role: 'Art Director',
    location: 'Paris Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    color: '#F59E0B',
    activeSpreadIndex: 0
  },
  {
    id: 'col-2',
    name: 'Marco Rossi',
    role: 'Lead Stylist',
    location: 'Milan Atelier',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    color: '#10B981',
    activeSpreadIndex: 1
  },
  {
    id: 'col-3',
    name: 'Kenji Sato',
    role: 'Visual Merchandiser',
    location: 'Tokyo HQ',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    color: '#3B82F6',
    activeSpreadIndex: 2
  }
];

export const DEFAULT_ASSETS: AssetItem[] = [
  {
    id: 'look-01',
    title: 'Architectural Charcoal Wool Coat',
    category: 'Outerwear',
    imageUrl: '/images/look-01.jpg',
    tags: ['Coat', 'Charcoal', 'Wool', 'Oversized', 'FW26'],
    colorPalette: ['#2B2E33', '#4A4E53', '#1A1C1F', '#D1D5DB'],
    fabric: '100% Double-Faced Virgin Wool',
    sku: 'FW26-OUT-001'
  },
  {
    id: 'look-02',
    title: 'Draped Cream Silk Blazer & Trousers',
    category: 'Tailoring',
    imageUrl: '/images/look-02.jpg',
    tags: ['Blazer', 'Cream', 'Silk', 'Suiting', 'SS27'],
    colorPalette: ['#F7F4EB', '#E6E0D2', '#D1C7B7', '#2A2A2A'],
    fabric: 'Heavy Mulberry Silk Crepe',
    sku: 'SS27-TLR-004'
  },
  {
    id: 'look-03',
    title: 'Textured Black Turtleneck & Leather Trousers',
    category: 'Knitwear',
    imageUrl: '/images/look-03.jpg',
    tags: ['Knit', 'Monochrome', 'Cashmere', 'Black', 'FW26'],
    colorPalette: ['#121212', '#262626', '#3D3D3D', '#737373'],
    fabric: '70% Ribbed Cashmere / 30% Silk',
    sku: 'FW26-KNT-009'
  },
  {
    id: 'look-04',
    title: 'Fluid Sand Belted Trench',
    category: 'Outerwear',
    imageUrl: '/images/look-04.jpg',
    tags: ['Trench', 'Sand', 'Beige', 'Minimal', 'SS27'],
    colorPalette: ['#D6C5B3', '#B8A592', '#8C7A67', '#1F1F1F'],
    fabric: 'Water-Repellent Japanese Gabardine',
    sku: 'SS27-OUT-002'
  },
  {
    id: 'look-05',
    title: 'Minimalist Slate Grey Oversized Blazer',
    category: 'Tailoring',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    tags: ['Blazer', 'Grey', 'Tailoring', 'Minimal'],
    colorPalette: ['#6B7280', '#4B5563', '#9CA3AF', '#F3F4F6'],
    fabric: 'Tropical Wool Blend',
    sku: 'FW26-TLR-012'
  },
  {
    id: 'look-06',
    title: 'Sculptural Off-White Drape Dress',
    category: 'Tailoring',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    tags: ['Dress', 'Off-White', 'Sculptural', 'Editorial'],
    colorPalette: ['#F9FAFB', '#E5E7EB', '#9CA3AF', '#111827'],
    fabric: 'Bonded Viscose Satin',
    sku: 'SS27-DRS-008'
  },
  {
    id: 'look-07',
    title: 'Deconstructed Trench Coat in Charcoal',
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    tags: ['Trench', 'Charcoal', 'Deconstructed'],
    colorPalette: ['#374151', '#1F2937', '#6B7280', '#D1D5DB'],
    fabric: 'Structured Cotton Twill',
    sku: 'FW26-OUT-008'
  },
  {
    id: 'look-08',
    title: 'High-Neck Cashmere Sweater in Oat',
    category: 'Knitwear',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80',
    tags: ['Knit', 'Cashmere', 'Oatmeal', 'Soft'],
    colorPalette: ['#E5DFD3', '#C7BCAC', '#998D7C', '#2C251E'],
    fabric: '100% Organic Mongolian Cashmere',
    sku: 'FW26-KNT-003'
  },
  {
    id: 'look-09',
    title: 'Architectural Leather Chelsea Boots',
    category: 'Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
    tags: ['Boots', 'Leather', 'Black', 'Footwear'],
    colorPalette: ['#0A0A0A', '#1C1C1E', '#3A3A3C', '#E5E5EA'],
    fabric: 'Full-Grain Calfskin Leather',
    sku: 'FW26-FTW-001'
  },
  {
    id: 'look-10',
    title: 'Structured Leather Saddle Tote Bag',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    tags: ['Bag', 'Leather', 'Accessory', 'Tan'],
    colorPalette: ['#8B5A2B', '#A67B5B', '#5C3A21', '#F5EBE6'],
    fabric: 'Hand-Stitched Italian Calfskin',
    sku: 'SS27-ACC-015'
  }
];

export const INITIAL_PROJECT: LookbookProject = {
  id: 'proj-fw26-minimal',
  title: 'SILHOUETTE & SUBSTANCE',
  season: 'AUTUMN / WINTER 2026',
  brand: 'ATELIER NOIR',
  designer: 'Studio Editorial',
  year: '2026',
  locale: 'en',
  themePreset: 'minimal-light',
  collaborators: DEFAULT_COLLABORATORS,
  assets: DEFAULT_ASSETS,
  spreads: [
    {
      id: 'spread-1',
      pageNumber: 1,
      layout: 'cover-spread',
      title: 'SILHOUETTE & SUBSTANCE',
      subtitle: 'A Study in Monochromatic Architecture & Volumetric Tailoring',
      lookNumber: 'COVER',
      bgColor: '#FAF9F6',
      textColor: '#171717',
      slots: [
        {
          slotId: 'cover-hero',
          assetId: 'look-01',
          customCaption: 'LOOK 01 — Architectural Charcoal Wool Coat',
          hotspots: [
            {
              id: 'h1',
              x: 48,
              y: 35,
              title: 'Charcoal Wool Lapel',
              sku: 'FW26-OUT-001'
            }
          ]
        }
      ]
    },
    {
      id: 'spread-2',
      pageNumber: 2,
      layout: 'editorial-duo',
      title: 'DUALISM OF TEXTURE',
      subtitle: 'Contrasting Heavy Wool Structures with Fluid Silk Crepe',
      lookNumber: 'LOOK 01 / 02',
      bgColor: '#FAF9F6',
      textColor: '#171717',
      slots: [
        {
          slotId: 'duo-left',
          assetId: 'look-01',
          customCaption: 'Look 01 — Heavy Charcoal Wool Oversized Silhouette'
        },
        {
          slotId: 'duo-right',
          assetId: 'look-02',
          customCaption: 'Look 02 — Soft Draped Cream Silk Blazer'
        }
      ]
    },
    {
      id: 'spread-3',
      pageNumber: 3,
      layout: 'single-hero',
      title: 'MONOCHROME KNITWEAR',
      subtitle: 'Sculpted Cashmere Layering for Sub-Zero Elegance',
      lookNumber: 'LOOK 03',
      bgColor: '#121212',
      textColor: '#F5F5F5',
      slots: [
        {
          slotId: 'hero-main',
          assetId: 'look-03',
          customCaption: 'Look 03 — Ribbed Cashmere Turtleneck & Leather Trousers'
        }
      ]
    },
    {
      id: 'spread-4',
      pageNumber: 4,
      layout: 'triptych-grid',
      title: 'TRANSITIONAL TAILORING',
      subtitle: 'Fluid Outerwear paired with Structured Leather Accents',
      lookNumber: 'LOOK 04',
      bgColor: '#F5F3EF',
      textColor: '#1C1917',
      slots: [
        {
          slotId: 'trip-main',
          assetId: 'look-04',
          customCaption: 'Look 04 — Fluid Sand Gabardine Trench'
        },
        {
          slotId: 'trip-sub-1',
          assetId: 'look-09',
          customCaption: 'Detail — Calfskin Chelsea Boots'
        },
        {
          slotId: 'trip-sub-2',
          assetId: 'look-10',
          customCaption: 'Detail — Leather Saddle Tote Bag'
        }
      ]
    },
    {
      id: 'spread-5',
      pageNumber: 5,
      layout: 'quote-accent',
      title: 'THE MANIFESTO',
      subtitle: 'Form follows silhouette; weight surrenders to fluid motion.',
      lookNumber: 'EDITORIAL',
      quote: '"Design is the reduction of unnecessary form until pure intention remains in the cloth."',
      bgColor: '#FAF9F6',
      textColor: '#171717',
      slots: [
        {
          slotId: 'quote-img',
          assetId: 'look-06',
          customCaption: 'Look 05 — Off-White Draped Viscose Satin'
        }
      ]
    }
  ]
};

export const PRESET_PROJECTS: { label: string; project: LookbookProject }[] = [
  {
    label: 'FW26 Atelier Noir (Default)',
    project: INITIAL_PROJECT
  },
  {
    label: 'SS27 Solar Luxe (Warm Earth)',
    project: {
      ...INITIAL_PROJECT,
      id: 'proj-ss27-solar',
      title: 'SOLAR RADIANCES',
      season: 'SPRING / SUMMER 2027',
      brand: 'SOLARIS STUDIO',
      locale: 'en',
      themePreset: 'warm-atelier',
      spreads: [
        {
          id: 's1',
          pageNumber: 1,
          layout: 'cover-spread',
          title: 'SOLAR RADIANCES',
          subtitle: 'Lightweight Linens, Sand Gabardine & Ethereal Silks',
          lookNumber: 'COVER',
          bgColor: '#F7F4EB',
          textColor: '#2C251E',
          slots: [{ slotId: 'cover-hero', assetId: 'look-02' }]
        },
        {
          id: 's2',
          pageNumber: 2,
          layout: 'editorial-duo',
          title: 'DESERT LIGHT',
          subtitle: 'Unstructured tailoring for high-sun climates',
          lookNumber: 'LOOK 01 / 02',
          bgColor: '#F7F4EB',
          textColor: '#2C251E',
          slots: [
            { slotId: 'duo-left', assetId: 'look-04' },
            { slotId: 'duo-right', assetId: 'look-08' }
          ]
        }
      ]
    }
  },
  {
    label: 'ARCHITECTURAL MONO (Dark Brutalist)',
    project: {
      ...INITIAL_PROJECT,
      id: 'proj-brutalist-mono',
      title: 'BRUTALIST STRUCTURES',
      season: 'PERMANENT COLLECTION',
      brand: 'MONO ARCHIVE',
      locale: 'en',
      themePreset: 'high-fashion-dark',
      spreads: [
        {
          id: 'b1',
          pageNumber: 1,
          layout: 'cover-spread',
          title: 'BRUTALIST STRUCTURES',
          subtitle: 'Severe cuts, concrete tones & high contrast silhouettes',
          lookNumber: 'VOL 01',
          bgColor: '#0F0F10',
          textColor: '#FFFFFF',
          slots: [{ slotId: 'cover-hero', assetId: 'look-03' }]
        },
        {
          id: 'b2',
          pageNumber: 2,
          layout: 'single-hero',
          title: 'OVERSIZED TAILORING',
          subtitle: 'Drop-shoulder architectural wool coat in heavy charcoal',
          lookNumber: 'LOOK 01',
          bgColor: '#0F0F10',
          textColor: '#FFFFFF',
          slots: [{ slotId: 'hero-main', assetId: 'look-01' }]
        }
      ]
    }
  }
];
