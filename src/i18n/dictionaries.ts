import { SupportedLocale } from '../types/lookbook';

export interface Dictionary {
  appName: string;
  subTitle: string;
  canvas: string;
  sequencer: string;
  present: string;
  autoSequence: string;
  export: string;
  commerceSync: string;
  presets: string;
  lookLibrary: string;
  upload: string;
  searchPlaceholder: string;
  dragDropHint: string;
  inspector: string;
  templateLayout: string;
  bgCanvas: string;
  typography: string;
  spreadTitle: string;
  subtitle: string;
  lookBadge: string;
  page: string;
  of: string;
  hotspots: string;
  addHotspot: string;
  collaboratorsOnline: string;
  printReady: string;
  language: string;
}

export const DICTIONARIES: Record<SupportedLocale, Dictionary> = {
  en: {
    appName: 'ATELIER',
    subTitle: 'LOOKBOOK BUILDER',
    canvas: 'Composition Canvas',
    sequencer: 'Page Sequencer',
    present: 'Interactive Preview',
    autoSequence: 'Smart Auto-Sequence',
    export: 'Export & Print',
    commerceSync: 'Shopify Sync',
    presets: 'Preset Lookbooks',
    lookLibrary: 'Look Library',
    upload: 'Upload Look',
    searchPlaceholder: 'Search looks, fabrics, SKUs...',
    dragDropHint: 'Drag looks onto canvas slots or click to insert',
    inspector: 'Inspector & Properties',
    templateLayout: 'Spread Template Layout',
    bgCanvas: 'Spread Background Canvas',
    typography: 'Spread Typography',
    spreadTitle: 'Spread Title',
    subtitle: 'Subtitle / Description',
    lookBadge: 'Look Number Badge',
    page: 'PAGE',
    of: 'OF',
    hotspots: 'Interactive Hotspots',
    addHotspot: 'Add Product Hotspot',
    collaboratorsOnline: 'Live Collaborators',
    printReady: '300 DPI Print PDF',
    language: 'Language / Langue'
  },
  fr: {
    appName: 'ATELIER',
    subTitle: 'CRÉATEUR DE LOOKBOOK',
    canvas: 'Canevas de Composition',
    sequencer: 'Séquenceur de Pages',
    present: 'Aperçu Interactif',
    autoSequence: 'Séquencement Auto',
    export: 'Exporter & Imprimer',
    commerceSync: 'Sync E-Commerce',
    presets: 'Lookbooks Prédéfinis',
    lookLibrary: 'Photothèque',
    upload: 'Téléverser',
    searchPlaceholder: 'Rechercher silhouettes, tissus, SKUs...',
    dragDropHint: 'Glissez les looks sur le canevas',
    inspector: 'Inspecteur & Propriétés',
    templateLayout: 'Mise en Page du Blocs',
    bgCanvas: 'Couleur de Fond',
    typography: 'Typographie du Lookbook',
    spreadTitle: 'Titre de la Page',
    subtitle: 'Sous-titre / Description',
    lookBadge: 'Badge de Silhouette',
    page: 'PAGE',
    of: 'SUR',
    hotspots: 'Points Chauds Interactifs',
    addHotspot: 'Ajouter Point Produit',
    collaboratorsOnline: 'Collaborateurs en Direct',
    printReady: 'Impression Haute Résolution',
    language: 'Langue'
  },
  it: {
    appName: 'ATELIER',
    subTitle: 'CREATORE DI LOOKBOOK',
    canvas: 'Tela di Composizione',
    sequencer: 'Sequenziatore Pagine',
    present: 'Anteprima Interattiva',
    autoSequence: 'Sequenziamento Smart',
    export: 'Esporta e Stampa',
    commerceSync: 'Sincronizza Catalogo',
    presets: 'Lookbook Predefiniti',
    lookLibrary: 'Galleria Silhouette',
    upload: 'Carica Immagine',
    searchPlaceholder: 'Cerca look, tessuti, SKU...',
    dragDropHint: 'Trascina i look sulle cornici',
    inspector: 'Ispettore e Proprietà',
    templateLayout: 'Layout del Modello',
    bgCanvas: 'Sfondo della Pagina',
    typography: 'Tipografia Editoriale',
    spreadTitle: 'Titolo della Sezione',
    subtitle: 'Sottotitolo / Note',
    lookBadge: 'Numero Silhouette',
    page: 'PAGINA',
    of: 'DI',
    hotspots: 'Punti Interattivi',
    addHotspot: 'Aggiungi Hotspot',
    collaboratorsOnline: 'Collaboratori Online',
    printReady: 'PDF di Stampa 300 DPI',
    language: 'Lingua'
  },
  ja: {
    appName: 'ATELIER',
    subTitle: 'ルックブックビルダー',
    canvas: 'レイアウト構成',
    sequencer: 'ページシーケンサー',
    present: 'インタラクティブプレビュー',
    autoSequence: '自動シーケンス生成',
    export: 'エクスポート・印刷',
    commerceSync: 'EC同期 (Shopify)',
    presets: 'プリセットコレクション',
    lookLibrary: 'ルックライブラリ',
    upload: '画像アップロード',
    searchPlaceholder: 'ルック、素材、SKUを検索...',
    dragDropHint: 'ルックをスロットにドラッグ＆ドロップ',
    inspector: 'インスペクター・プロパティ',
    templateLayout: 'スプレッドレイアウト',
    bgCanvas: '背景カラー',
    typography: 'タイポグラフィ',
    spreadTitle: 'タイトル',
    subtitle: 'サブタイトル・詳細',
    lookBadge: 'ルックナンバー',
    page: 'ページ',
    of: '/',
    hotspots: 'インタラクティブホットスポット',
    addHotspot: '商品タグ追加',
    collaboratorsOnline: 'オンライン共有中',
    printReady: '高精細印刷PDF',
    language: '言語設定'
  },
  es: {
    appName: 'ATELIER',
    subTitle: 'CREADOR DE LOOKBOOKS',
    canvas: 'Lienzo de Composición',
    sequencer: 'Secuenciador de Páginas',
    present: 'Vista Previa Interactiva',
    autoSequence: 'Secuenciación Automática',
    export: 'Exportar e Imprimir',
    commerceSync: 'Sincronizar E-Commerce',
    presets: 'Lookbooks Predeterminados',
    lookLibrary: 'Biblioteca de Looks',
    upload: 'Subir Imagen',
    searchPlaceholder: 'Buscar looks, telas, SKUs...',
    dragDropHint: 'Arrastra looks a los espacios del lienzo',
    inspector: 'Inspector y Propiedades',
    templateLayout: 'Diseño de Plantilla',
    bgCanvas: 'Fondo del Lienzo',
    typography: 'Tipografía Editorial',
    spreadTitle: 'Título de la Página',
    subtitle: 'Subtítulo / Notas',
    lookBadge: 'Número de Look',
    page: 'PÁGINA',
    of: 'DE',
    hotspots: 'Puntos Interactivos',
    addHotspot: 'Agregar Hotspot',
    collaboratorsOnline: 'Colaboradores en Vivo',
    printReady: 'PDF Imprimible 300 DPI',
    language: 'Idioma'
  }
};
