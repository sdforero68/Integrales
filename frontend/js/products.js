/**
 * products.js - Datos de Productos y Categorías
 * Adaptación del código TypeScript a JavaScript vanilla
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} price
 * @property {string} description
 * @property {string} [ingredients]
 * @property {string} [benefits]
 * @property {string} [image]
 */

/**
 * Categorías de productos disponibles
 * @type {Array<{id: string, name: string}>}
 */
export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'panaderia', name: 'Panadería' },
  { id: 'amasijos', name: 'Amasijos' },
  { id: 'galleteria', name: 'Galletería' },
  { id: 'granola', name: 'Granola' },
  { id: 'frutos-secos', name: 'Frutos Secos y Semillas' },
  { id: 'envasados', name: 'Envasados' }
];

/**
 * Lista completa de productos
 * @type {Product[]}
 */
export const products = [
  // PANADERÍA
  {
    id: 'pan-queso-grande',
    name: 'Pan de Queso y Cuajada Grande',
    category: 'panaderia',
    price: 12000,
    description: 'Pan artesanal con queso y cuajada incorporados en la mezcla, tamaño grande 5 unds.',
    ingredients: 'Harina integral, mantequilla, miel de caña, queso, quinua, yacón y linaza',
    benefits: 'Rico en proteínas y fibra, no contiene levadura.',
    image: 'Catálogo/CuajadaQuesoGrande.jpg'
  },
  {
    id: 'pan-queso-pequeno',
    name: 'Pan de Queso y Cuajada Pequeño',
    category: 'panaderia',
    price: 10000,
    description: 'Pan artesanal con queso y cuajada incorporados en la mezcla, tamaño pequeño 10 unds.',
    ingredients: 'Harina integral, mantequilla, miel de caña, queso, quinua, yacón y linaza',
    benefits: 'Rico en proteínas y fibra, no contiene levadura.',
    image: 'Catálogo/CuajadaQuesoPeque.jpg'
  },
  {
    id: 'pan-maiz-grande',
    name: 'Pan de Maíz Grande',
    category: 'panaderia',
    price: 12000,
    description: 'Pan artesanal de maíz, con queso y cuajada, tamaño grande 5 unds.',
    ingredients: 'Harina de maíz, mantequilla, miel de caña, queso, quinua, yacón y linaza',
    benefits: 'Sin gluten, rico en fibra',
    image: 'Catálogo/QuesoMaizGrande.jpg'
  },
  {
    id: 'pan-maiz-pequeno',
    name: 'Pan de Maíz Pequeño',
    category: 'panaderia',
    price: 7000,
    description: 'Pan artesanal de maíz, con queso y cuajada, tamaño pequeño 6 unds.',
    ingredients: 'Harina de maíz, mantequilla, miel de caña, queso, quinua, yacón y linaza',
    benefits: 'Sin gluten, rico en fibra',
    image: 'Catálogo/QuesoMaizPeque.jpg'
  },
  {
    id: 'masa-madre-centeno',
    name: 'Masa Madre de Centeno',
    category: 'panaderia',
    price: 16000,
    description: 'Pan de masa madre (proceso de fermentación natural) con harina de centeno',
    ingredients: 'Harina de centeno, masa madre natural y nueces',
    benefits: 'Digestión lenta, rico en minerales, libre de gluten, grasa, huevo, levadura y dulce.',
    image: 'Catálogo/AncestralCenteno.jpg'
  },
  {
    id: 'masa-madre-ancestral-grande',
    name: 'Masa Madre Ancestral Grande',
    category: 'panaderia',
    price: 20000,
    description: 'Pan de masa madre con harinas ancestrales, tamaño grande',
    ingredients: 'Quinua, amaranto, sagú, masa madre',
    benefits: 'Superalimento, alto en proteínas',
    image: 'Catálogo/AncestralGrande.jpg'
  },
  {
    id: 'masa-madre-ancestral-pequeno',
    name: 'Masa Madre Ancestral Pequeño',
    category: 'panaderia',
    price: 14000,
    description: 'Pan de masa madre con harinas ancestrales, tamaño pequeño',
    ingredients: 'Quinua, amaranto, sagú, masa madre',
    benefits: 'Superalimento, alto en proteínas',
    image: 'Catálogo/AncestralPeque.jpg'
  },
  {
    id: 'paneton-grande',
    name: 'Panetón Grande',
    category: 'panaderia',
    price: 20000,
    description: 'Panetón artesanal grande',
    ingredients: 'Harinas integrales, frutos secos, especias',
    benefits: 'Endulzado naturalmente',
    image: 'Catálogo/PanetónGrande.jpg'
  },
  {
    id: 'paneton-mediano',
    name: 'Panetón Mediano',
    category: 'panaderia',
    price: 14000,
    description: 'Panetón artesanal mediano',
    ingredients: 'Harinas integrales, frutos secos, especias',
    benefits: 'Endulzado naturalmente',
    image: 'Catálogo/PanetónMediano.jpg'
  },
  {
    id: 'paneton-mini',
    name: 'Panetón Mini',
    category: 'panaderia',
    price: 6000,
    description: 'Panetón artesanal mini',
    ingredients: 'Harinas integrales, frutos secos, especias',
    benefits: 'Endulzado naturalmente',
    image: 'Catálogo/PanetónPeque.jpg'
  },
  {
    id: 'relleno-surtido',
    name: 'Pan Relleno Surtido',
    category: 'panaderia',
    price: 16000,
    description: 'Pan integral con relleno surtido',
    ingredients: 'Harina integral, rellenos variados',
    benefits: 'Versátil y nutritivo',
    image: 'Catálogo/RellenoSurtido.jpg'
  },
  {
    id: 'relleno-cacao',
    name: 'Pan Relleno de Cacao',
    category: 'panaderia',
    price: 18000,
    description: 'Pan integral con relleno de cacao',
    ingredients: 'Harina integral, cacao puro',
    benefits: 'Antioxidantes del cacao',
    image: 'Catálogo/RellenoCacao.jpg'
  },
  {
    id: 'mogollas',
    name: 'Mogollas',
    category: 'panaderia',
    price: 10000,
    description: 'Mogollas artesanales integrales',
    ingredients: 'Harina integral, masa madre',
    benefits: 'Tradicional y saludable',
    image: 'Catálogo/Mogollas.jpg'
  },
  {
    id: 'roscones',
    name: 'Roscones Integrales',
    category: 'panaderia',
    price: 6000,
    description: 'Roscones integrales artesanales',
    ingredients: 'Harina integral, especias',
    benefits: 'Crujientes y nutritivos',
    image: 'Catálogo/Roscones.jpg'
  },

  // AMASIJOS
  {
    id: 'resobados',
    name: 'Resobados',
    category: 'amasijos',
    price: 7000,
    description: 'Resobados artesanales',
    ingredients: 'Harina, mantequilla',
    benefits: 'Textura única',
    image: 'Catálogo/Resobados.jpg'
  },
  {
    id: 'achiras-18',
    name: 'Achiras (18 unidades)',
    category: 'amasijos',
    price: 7000,
    description: 'Achiras tradicionales, paquete de 18',
    ingredients: 'Almidón de achira, queso',
    benefits: 'Sin gluten',
    image: 'Catálogo/AchirasGrandes.jpg'
  },
  {
    id: 'achiras-9',
    name: 'Achiras (9 unidades)',
    category: 'amasijos',
    price: 3500,
    description: 'Achiras tradicionales, paquete de 9',
    ingredients: 'Almidón de achira, queso',
    benefits: 'Sin gluten',
    image: 'Catálogo/AchirasPeque.jpg'
  },

  // GALLETERÍA
  {
    id: 'galletas-chip-cacao',
    name: 'Galletas Chip Cacao',
    category: 'galleteria',
    price: 7000,
    description: 'Galletas con chips de cacao',
    ingredients: 'Harina integral, chips de cacao puro',
    benefits: 'Antioxidantes',
    image: 'Catálogo/GalletasCacao.jpg'
  },
  {
    id: 'galletas-cafe',
    name: 'Galletas de Café',
    category: 'galleteria',
    price: 7000,
    description: 'Galletas con sabor a café',
    ingredients: 'Café colombiano, harina integral',
    benefits: 'Energizantes',
    image: 'Catálogo/GalletasCafé.jpg'
  },
  {
    id: 'galletas-jengibre',
    name: 'Galletas de Jengibre',
    category: 'galleteria',
    price: 7000,
    description: 'Galletas con jengibre',
    ingredients: 'Jengibre fresco, especias',
    benefits: 'Antiinflamatorio',
    image: 'Catálogo/GalletasJenjibre.jpg'
  },
  {
    id: 'galletas-sal-grande',
    name: 'Galletas de Sal Grandes',
    category: 'galleteria',
    price: 16000,
    description: 'Galletas saladas, presentación grande',
    ingredients: 'Harina integral, sal rosada',
    benefits: 'Snack saludable',
    image: 'Catálogo/GalletasSal.jpg'
  },
  {
    id: 'tostadas',
    name: 'Tostadas',
    category: 'galleteria',
    price: 7000,
    description: 'Tostadas integrales crujientes',
    ingredients: 'Harina integral, semillas',
    benefits: 'Perfectas para dips',
    image: 'Catálogo/Tostadas.jpg'
  },

  // GRANOLA
  {
    id: 'granola-datiles-lb',
    name: 'Granola con Dátiles (Libra)',
    category: 'granola',
    price: 16000,
    description: 'Granola artesanal con dátiles, 1 libra',
    ingredients: 'Avena, dátiles, frutos secos',
    benefits: 'Energía natural',
    image: 'Catálogo/LibraDátiles.jpg'
  },
  {
    id: 'granola-datiles-media',
    name: 'Granola con Dátiles (Media Libra)',
    category: 'granola',
    price: 8000,
    description: 'Granola artesanal con dátiles, media libra',
    ingredients: 'Avena, dátiles, frutos secos',
    benefits: 'Energía natural',
    image: 'Catálogo/MediaDátiles.jpg'
  },
  {
    id: 'granola-uvas-lb',
    name: 'Granola con Uvas (Libra)',
    category: 'granola',
    price: 16000,
    description: 'Granola artesanal con uvas pasas, 1 libra',
    ingredients: 'Avena, uvas pasas, almendras',
    benefits: 'Antioxidantes',
    image: 'Catálogo/LibraUvas.jpg'
  },
  {
    id: 'granola-uvas-media',
    name: 'Granola con Uvas (Media Libra)',
    category: 'granola',
    price: 8000,
    description: 'Granola artesanal con uvas pasas, media libra',
    ingredients: 'Avena, uvas pasas, almendras',
    benefits: 'Antioxidantes',
    image: 'Catálogo/MediaUvas.jpg'
  },
  {
    id: 'granola-arandanos-lb',
    name: 'Granola con Arándanos (Libra)',
    category: 'granola',
    price: 16000,
    description: 'Granola artesanal con arándanos, 1 libra',
    ingredients: 'Avena, arándanos secos, nueces',
    benefits: 'Superalimento',
    image: 'Catálogo/LibraArándanos.jpg'
  },
  {
    id: 'granola-arandanos-media',
    name: 'Granola con Arándanos (Media Libra)',
    category: 'granola',
    price: 8000,
    description: 'Granola artesanal con arándanos, media libra',
    ingredients: 'Avena, arándanos secos, nueces',
    benefits: 'Superalimento',
    image: 'Catálogo/MediaArándanos.jpg'
  },
  {
    id: 'granola-sin-dulce',
    name: 'Granola Sin Dulce (Para Diabéticos)',
    category: 'granola',
    price: 16000,
    description: 'Granola especial sin azúcar',
    ingredients: 'Avena, frutos secos, sin endulzantes',
    benefits: 'Apto para diabéticos',
    image: 'Catálogo/LibraDiabéticos.jpg'
  },

  // FRUTOS SECOS Y SEMILLAS
  {
    id: 'pistachos-250',
    name: 'Pistachos (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Pistachos naturales',
    ingredients: 'Pistachos',
    benefits: 'Rico en proteínas',
    image: 'Catálogo/Pistachos250.jpg'
  },
  {
    id: 'pistachos-125',
    name: 'Pistachos (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Pistachos naturales',
    ingredients: 'Pistachos',
    benefits: 'Rico en proteínas',
    image: 'Catálogo/Pistachos125.jpg'
  },
  {
    id: 'maranon-250',
    name: 'Marañón (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Marañón natural',
    ingredients: 'Marañón',
    benefits: 'Alto en magnesio',
    image: 'Catálogo/Marañon250.jpg'
  },
  {
    id: 'maranon-125',
    name: 'Marañón (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Marañón natural',
    ingredients: 'Marañón',
    benefits: 'Alto en magnesio',
    image: 'Catálogo/Marañon125.jpg'
  },
  {
    id: 'macadamia-250',
    name: 'Macadamia (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Nueces de macadamia premium',
    ingredients: 'Macadamia',
    benefits: 'Grasas saludables',
    image: 'Catálogo/Macadamia250.jpg'
  },
  {
    id: 'macadamia-125',
    name: 'Macadamia (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Nueces de macadamia premium',
    ingredients: 'Macadamia',
    benefits: 'Grasas saludables',
    image: 'Catálogo/Macadamia125.jpg'
  },
  {
    id: 'almendras-250',
    name: 'Almendras (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Almendras naturales',
    ingredients: 'Almendras',
    benefits: 'Vitamina E',
    image: 'Catálogo/Almendra250.jpg'
  },
  {
    id: 'almendras-125',
    name: 'Almendras (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Almendras naturales',
    ingredients: 'Almendras',
    benefits: 'Vitamina E',
    image: 'Catálogo/Almendra125.jpg'
  },
  {
    id: 'datiles-fruto-250',
    name: 'Dátiles (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Dátiles naturales',
    ingredients: 'Dátiles',
    benefits: 'Energía natural',
    image: 'Catálogo/Dátiles250.jpg'
  },
  {
    id: 'datiles-fruto-125',
    name: 'Dátiles (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Dátiles naturales',
    ingredients: 'Dátiles',
    benefits: 'Energía natural',
    image: 'Catálogo/Dátiles125.jpg'
  },
  {
    id: 'nuez-brasil-250',
    name: 'Nuez de Brasil (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Nueces de Brasil',
    ingredients: 'Nuez de Brasil',
    benefits: 'Selenio natural',
    image: 'Catálogo/NuezBrasil.jpg'
  },
  {
    id: 'nuez-brasil-125',
    name: 'Nuez de Brasil (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Nueces de Brasil',
    ingredients: 'Nuez de Brasil',
    benefits: 'Selenio natural',
    image: 'Catálogo/NuezBrasil.jpg'
  },
  {
    id: 'nuez-nogal-250',
    name: 'Nuez de Nogal (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Nueces de nogal',
    ingredients: 'Nuez de nogal',
    benefits: 'Omega 3',
    image: 'Catálogo/NuezNogal.jpg'
  },
  {
    id: 'nuez-nogal-125',
    name: 'Nuez de Nogal (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Nueces de nogal',
    ingredients: 'Nuez de nogal',
    benefits: 'Omega 3',
    image: 'Catálogo/NuezNogal.jpg'
  },
  {
    id: 'albaricoque',
    name: 'Albaricoque',
    category: 'frutos-secos',
    price: 10000,
    description: 'Albaricoques secos',
    ingredients: 'Albaricoque deshidratado',
    benefits: 'Rico en fibra',
    image: 'Catálogo/Albaricoque.jpg'
  },
  {
    id: 'ciruelas-pasas',
    name: 'Ciruelas Pasas',
    category: 'frutos-secos',
    price: 5000,
    description: 'Ciruelas pasas naturales',
    ingredients: 'Ciruelas deshidratadas',
    benefits: 'Digestión saludable',
    image: 'Catálogo/Ciruelas.jpg'
  },
  {
    id: 'semillas-girasol',
    name: 'Semillas de Girasol',
    category: 'frutos-secos',
    price: 5000,
    description: 'Semillas de girasol naturales',
    ingredients: 'Semillas de girasol',
    benefits: 'Vitamina E',
    image: 'Catálogo/SemillasGirasol.jpg'
  },
  {
    id: 'semillas-calabaza',
    name: 'Semillas de Calabaza',
    category: 'frutos-secos',
    price: 6000,
    description: 'Semillas de calabaza',
    ingredients: 'Semillas de calabaza',
    benefits: 'Magnesio y zinc',
    image: 'Catálogo/SemillasCalabaza.jpg'
  },
  {
    id: 'semillas-chia',
    name: 'Semillas de Chía',
    category: 'frutos-secos',
    price: 5000,
    description: 'Semillas de chía',
    ingredients: 'Chía',
    benefits: 'Omega 3, fibra',
    image: 'Catálogo/SemillasChía.jpg'
  },
  {
    id: 'linaza',
    name: 'Linaza',
    category: 'frutos-secos',
    price: 4000,
    description: 'Semillas de linaza',
    ingredients: 'Linaza',
    benefits: 'Omega 3',
    image: 'Catálogo/Linaza.jpg'
  },
  {
    id: 'ajonjoli',
    name: 'Ajonjolí',
    category: 'frutos-secos',
    price: 12000,
    description: 'Semillas de ajonjolí',
    ingredients: 'Ajonjolí',
    benefits: 'Calcio natural',
    image: 'Catálogo/Ajonjolí.jpg'
  },
  {
    id: 'quinua',
    name: 'Quinua',
    category: 'frutos-secos',
    price: 10000,
    description: 'Quinua en grano',
    ingredients: 'Quinua',
    benefits: 'Proteína completa',
    image: 'Catálogo/Quinua.jpg'
  },
  {
    id: 'flor-jamaica',
    name: 'Flor de Jamaica',
    category: 'frutos-secos',
    price: 4000,
    description: 'Flor de Jamaica deshidratada',
    ingredients: 'Flor de Jamaica',
    benefits: 'Antioxidantes',
    image: 'Catálogo/FlorJamaica.jpg'
  },
  {
    id: 'curcuma',
    name: 'Cúrcuma',
    category: 'frutos-secos',
    price: 5000,
    description: 'Cúrcuma en polvo',
    ingredients: 'Cúrcuma',
    benefits: 'Antiinflamatorio',
    image: 'Catálogo/Cúrcuma.jpg'
  },
  {
    id: 'sal-rosada-grano',
    name: 'Sal Rosada en Grano',
    category: 'frutos-secos',
    price: 12000,
    description: 'Sal rosada del Himalaya en grano',
    ingredients: 'Sal rosada',
    benefits: 'Minerales naturales',
    image: 'Catálogo/SalEntera.jpg'
  },
  {
    id: 'sal-rosada-molida',
    name: 'Sal Rosada Molida',
    category: 'frutos-secos',
    price: 12000,
    description: 'Sal rosada del Himalaya molida',
    ingredients: 'Sal rosada',
    benefits: 'Minerales naturales',
    image: 'Catálogo/SalMolida.jpg'
  },
  {
    id: 'mix-maiz',
    name: 'Mix de Maíz',
    category: 'frutos-secos',
    price: 5000,
    description: 'Mezcla de maíz tostado',
    ingredients: 'Maíz variado',
    benefits: 'Snack natural',
    image: 'Catálogo/MixMaíz.jpg'
  },

  // ENVASADOS
  {
    id: 'mantequilla-ghee-lb',
    name: 'Mantequilla Ghee (Libra)',
    category: 'envasados',
    price: 36000,
    description: 'Mantequilla clarificada ghee, 1 libra',
    ingredients: 'Mantequilla clarificada',
    benefits: 'Sin lactosa, alto punto de humo',
    image: 'Catálogo/GueeLibra.jpg'
  },
  {
    id: 'mantequilla-ghee-media',
    name: 'Mantequilla Ghee (Media Libra)',
    category: 'envasados',
    price: 18000,
    description: 'Mantequilla clarificada ghee, media libra',
    ingredients: 'Mantequilla clarificada',
    benefits: 'Sin lactosa, alto punto de humo',
    image: 'Catálogo/GueeMedia.jpg'
  },
  {
    id: 'miel-abejas',
    name: 'Miel de Abejas (500g)',
    category: 'envasados',
    price: 40000,
    description: 'Miel pura de abejas, 500g',
    ingredients: 'Miel 100% natural',
    benefits: 'Antibacteriana, energizante',
    image: 'Catálogo/Miel.jpg'
  }
];

/**
 * Formatea un precio como moneda colombiana (COP)
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado como moneda colombiana
 * @example
 * formatPrice(12000) // "$12.000"
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
}
