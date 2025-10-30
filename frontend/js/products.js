// Simple demo data for catalog
export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'bakery', name: 'Panadería' },
  { id: 'amasijos', name: 'Amasijos' },
  { id: 'cookies', name: 'Galletería' },
  { id: 'granola', name: 'Granola' },
  { id: 'nuts', name: 'Frutos Secos' },
  { id: 'jarred', name: 'Envasados' },
];

export const products = [
  {
    id: 'p1',
    name: 'Pan de Quinua',
    description: 'Pan artesanal con harina de quinua y semillas.',
    ingredients: 'quinua, linaza, chía',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    price: 9500,
    category: 'bakery',
    tags: ['Integral', 'Sin conservantes'],
  },
  {
    id: 'p2',
    name: 'Galletas de Avena',
    description: 'Crujientes y llenas de energía, endulzadas naturalmente.',
    ingredients: 'avena, panela, coco',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop',
    price: 6800,
    category: 'cookies',
    tags: ['Artesanal'],
  },
  {
    id: 'p3',
    name: 'Granola Andina',
    description: 'Mezcla de granos ancestrales y frutos secos.',
    ingredients: 'quinua, amaranto, nueces, miel',
    image: 'https://images.unsplash.com/photo-1550699520-39ec5bb7c2d7?q=80&w=1200&auto=format&fit=crop',
    price: 12000,
    category: 'granola',
    tags: ['Energético'],
  },
  {
    id: 'p4',
    name: 'Mix de Frutos Secos',
    description: 'Selección premium tostada ligeramente.',
    ingredients: 'almendras, nueces, maní, uvas pasas',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1200&auto=format&fit=crop',
    price: 13500,
    category: 'nuts',
    tags: ['Natural'],
  },
];


