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
    benefits: 'Rico en proteínas y fibra, no contiene levadura.'
  },
  {
    id: 'pan-queso-pequeno',
    name: 'Pan de Queso y Cuajada Pequeño',
    category: 'panaderia',
    price: 10000,
    description: 'Pan artesanal con queso y cuajada incorporados en la mezcla, tamaño pequeño 10 unds.',
    ingredients: 'Harina integral, mantequilla, miel de caña, queso, quinua, yacón y linaza',
    benefits: 'Rico en proteínas y fibra, no contiene levadura.'
  },
  {
    id: 'pan-maiz-grande',
    name: 'Pan de Maíz Grande',
    category: 'panaderia',
    price: 12000,
    description: 'Pan artesanal de maíz, con queso y cuajada, tamaño grande 5 unds.',
    ingredients: 'Harina de maíz, mantequilla, miel de caña, queso, quinua, yacón y linaza',
    benefits: 'Sin gluten, rico en fibra'
  },
  {
    id: 'pan-maiz-pequeno',
    name: 'Pan de Maíz Pequeño',
    category: 'panaderia',
    price: 7000,
    description: 'Pan artesanal de maíz, con queso y cuajada, tamaño pequeño 6 unds.',
    ingredients: 'Harina de maíz, mantequilla, miel de caña, queso, quinua, yacón y linaza',
    benefits: 'Sin gluten, rico en fibra'
  },
  {
    id: 'masa-madre-centeno',
    name: 'Masa Madre de Centeno',
    category: 'panaderia',
    price: 16000,
    description: 'Pan de masa madre (proceso de fermentación natural) con harina de centeno',
    ingredients: 'Harina de centeno, masa madre natural y nueces',
    benefits: 'Digestión lenta, rico en minerales, libre de gluten, grasa, huevo, levadura y dulce.'
  },
  {
    id: 'masa-madre-ancestral-grande',
    name: 'Masa Madre Ancestral Grande',
    category: 'panaderia',
    price: 20000,
    description: 'Pan de masa madre con harinas ancestrales, tamaño grande',
    ingredients: 'Quinua, amaranto, sagú, masa madre',
    benefits: 'Superalimento, alto en proteínas'
  },
  {
    id: 'masa-madre-ancestral-pequeno',
    name: 'Masa Madre Ancestral Pequeño',
    category: 'panaderia',
    price: 14000,
    description: 'Pan de masa madre con harinas ancestrales, tamaño pequeño',
    ingredients: 'Quinua, amaranto, sagú, masa madre',
    benefits: 'Superalimento, alto en proteínas'
  },
  {
    id: 'paneton-grande',
    name: 'Panetón Grande',
    category: 'panaderia',
    price: 20000,
    description: 'Panetón artesanal grande',
    ingredients: 'Harinas integrales, frutos secos, especias',
    benefits: 'Endulzado naturalmente'
  },
  {
    id: 'paneton-mediano',
    name: 'Panetón Mediano',
    category: 'panaderia',
    price: 14000,
    description: 'Panetón artesanal mediano',
    ingredients: 'Harinas integrales, frutos secos, especias',
    benefits: 'Endulzado naturalmente'
  },
  {
    id: 'paneton-mini',
    name: 'Panetón Mini',
    category: 'panaderia',
    price: 6000,
    description: 'Panetón artesanal mini',
    ingredients: 'Harinas integrales, frutos secos, especias',
    benefits: 'Endulzado naturalmente'
  },
  {
    id: 'relleno-surtido',
    name: 'Pan Relleno Surtido',
    category: 'panaderia',
    price: 16000,
    description: 'Pan integral con relleno surtido',
    ingredients: 'Harina integral, rellenos variados',
    benefits: 'Versátil y nutritivo'
  },
  {
    id: 'relleno-cacao',
    name: 'Pan Relleno de Cacao',
    category: 'panaderia',
    price: 18000,
    description: 'Pan integral con relleno de cacao',
    ingredients: 'Harina integral, cacao puro',
    benefits: 'Antioxidantes del cacao'
  },
  {
    id: 'mogollas',
    name: 'Mogollas',
    category: 'panaderia',
    price: 10000,
    description: 'Mogollas artesanales integrales',
    ingredients: 'Harina integral, masa madre',
    benefits: 'Tradicional y saludable'
  },
  {
    id: 'roscones',
    name: 'Roscones Integrales',
    category: 'panaderia',
    price: 6000,
    description: 'Roscones integrales artesanales',
    ingredients: 'Harina integral, especias',
    benefits: 'Crujientes y nutritivos'
  },
  {
    id: 'chicharronas',
    name: 'Chicharronas',
    category: 'panaderia',
    price: 10000,
    description: 'Chicharronas tradicionales',
    ingredients: 'Harina de trigo integral',
    benefits: 'Receta tradicional'
  },
  {
    id: 'guatila-oregano',
    name: 'Pan de Guatila y Orégano',
    category: 'panaderia',
    price: 12000,
    description: 'Pan especial con guatila y orégano',
    ingredients: 'Guatila, orégano, harina integral',
    benefits: 'Rico en vitaminas'
  },
  {
    id: 'balu',
    name: 'Balú',
    category: 'panaderia',
    price: 12000,
    description: 'Pan artesanal Balú',
    ingredients: 'Harinas integrales especiales',
    benefits: 'Receta única'
  },

  // AMASIJOS
  {
    id: 'arepas-boyacenses',
    name: 'Arepas Boyacenses',
    category: 'amasijos',
    price: 16000,
    description: 'Arepas tradicionales boyacenses',
    ingredients: 'Maíz, queso',
    benefits: 'Tradición colombiana'
  },
  {
    id: 'almojabanas',
    name: 'Almojábanas',
    category: 'amasijos',
    price: 16000,
    description: 'Almojábanas artesanales',
    ingredients: 'Queso, almidón de yuca',
    benefits: 'Sin gluten, alto en proteína'
  },
  {
    id: 'torta-almojabana-grande',
    name: 'Torta de Almojábana Grande',
    category: 'amasijos',
    price: 12000,
    description: 'Torta de almojábana tamaño grande',
    ingredients: 'Queso, almidón de yuca',
    benefits: 'Perfecta para compartir'
  },
  {
    id: 'torta-almojabana-mediana',
    name: 'Torta de Almojábana Mediana',
    category: 'amasijos',
    price: 10000,
    description: 'Torta de almojábana tamaño mediano',
    ingredients: 'Queso, almidón de yuca',
    benefits: 'Ideal para familia pequeña'
  },
  {
    id: 'torta-almojabana-pequena',
    name: 'Torta de Almojábana Pequeña',
    category: 'amasijos',
    price: 7000,
    description: 'Torta de almojábana tamaño pequeño',
    ingredients: 'Queso, almidón de yuca',
    benefits: 'Porción individual'
  },
  {
    id: 'ponquesitos-agraz',
    name: 'Ponquesitos de Agraz',
    category: 'amasijos',
    price: 8000,
    description: 'Ponquesitos artesanales de agraz',
    ingredients: 'Agraz, harina integral',
    benefits: 'Antioxidantes naturales'
  },
  {
    id: 'garullas',
    name: 'Garullas',
    category: 'amasijos',
    price: 3000,
    description: 'Garullas tradicionales',
    ingredients: 'Harina de trigo, panela',
    benefits: 'Dulce tradicional'
  },
  {
    id: 'resobados',
    name: 'Resobados',
    category: 'amasijos',
    price: 7000,
    description: 'Resobados artesanales',
    ingredients: 'Harina, mantequilla',
    benefits: 'Textura única'
  },
  {
    id: 'achiras-18',
    name: 'Achiras (18 unidades)',
    category: 'amasijos',
    price: 7000,
    description: 'Achiras tradicionales, paquete de 18',
    ingredients: 'Almidón de achira, queso',
    benefits: 'Sin gluten'
  },
  {
    id: 'achiras-9',
    name: 'Achiras (9 unidades)',
    category: 'amasijos',
    price: 3500,
    description: 'Achiras tradicionales, paquete de 9',
    ingredients: 'Almidón de achira, queso',
    benefits: 'Sin gluten'
  },

  // GALLETERÍA
  {
    id: 'galletas-avena-grande',
    name: 'Galletas de Avena Grande',
    category: 'galleteria',
    price: 14000,
    description: 'Galletas de avena, presentación grande',
    ingredients: 'Avena, miel, frutos secos',
    benefits: 'Rico en fibra'
  },
  {
    id: 'galletas-avena-pequena',
    name: 'Galletas de Avena Pequeña',
    category: 'galleteria',
    price: 7000,
    description: 'Galletas de avena, presentación pequeña',
    ingredients: 'Avena, miel, frutos secos',
    benefits: 'Rico en fibra'
  },
  {
    id: 'galletas-chip-cacao',
    name: 'Galletas Chip Cacao',
    category: 'galleteria',
    price: 7000,
    description: 'Galletas con chips de cacao',
    ingredients: 'Harina integral, chips de cacao puro',
    benefits: 'Antioxidantes'
  },
  {
    id: 'galletas-cafe',
    name: 'Galletas de Café',
    category: 'galleteria',
    price: 7000,
    description: 'Galletas con sabor a café',
    ingredients: 'Café colombiano, harina integral',
    benefits: 'Energizantes'
  },
  {
    id: 'galletas-jengibre',
    name: 'Galletas de Jengibre',
    category: 'galleteria',
    price: 7000,
    description: 'Galletas con jengibre',
    ingredients: 'Jengibre fresco, especias',
    benefits: 'Antiinflamatorio'
  },
  {
    id: 'galletas-sal-grande',
    name: 'Galletas de Sal Grandes',
    category: 'galleteria',
    price: 16000,
    description: 'Galletas saladas, presentación grande',
    ingredients: 'Harina integral, sal rosada',
    benefits: 'Snack saludable'
  },
  {
    id: 'galletas-sal-pequena',
    name: 'Galletas de Sal Pequeñas',
    category: 'galleteria',
    price: 8000,
    description: 'Galletas saladas, presentación pequeña',
    ingredients: 'Harina integral, sal rosada',
    benefits: 'Snack saludable'
  },
  {
    id: 'tostadas',
    name: 'Tostadas',
    category: 'galleteria',
    price: 7000,
    description: 'Tostadas integrales crujientes',
    ingredients: 'Harina integral, semillas',
    benefits: 'Perfectas para dips'
  },

  // GRANOLA
  {
    id: 'granola-datiles-lb',
    name: 'Granola con Dátiles (Libra)',
    category: 'granola',
    price: 16000,
    description: 'Granola artesanal con dátiles, 1 libra',
    ingredients: 'Avena, dátiles, frutos secos',
    benefits: 'Energía natural'
  },
  {
    id: 'granola-datiles-media',
    name: 'Granola con Dátiles (Media Libra)',
    category: 'granola',
    price: 8000,
    description: 'Granola artesanal con dátiles, media libra',
    ingredients: 'Avena, dátiles, frutos secos',
    benefits: 'Energía natural'
  },
  {
    id: 'granola-uvas-lb',
    name: 'Granola con Uvas (Libra)',
    category: 'granola',
    price: 16000,
    description: 'Granola artesanal con uvas pasas, 1 libra',
    ingredients: 'Avena, uvas pasas, almendras',
    benefits: 'Antioxidantes'
  },
  {
    id: 'granola-uvas-media',
    name: 'Granola con Uvas (Media Libra)',
    category: 'granola',
    price: 8000,
    description: 'Granola artesanal con uvas pasas, media libra',
    ingredients: 'Avena, uvas pasas, almendras',
    benefits: 'Antioxidantes'
  },
  {
    id: 'granola-arandanos-lb',
    name: 'Granola con Arándanos (Libra)',
    category: 'granola',
    price: 16000,
    description: 'Granola artesanal con arándanos, 1 libra',
    ingredients: 'Avena, arándanos secos, nueces',
    benefits: 'Superalimento'
  },
  {
    id: 'granola-arandanos-media',
    name: 'Granola con Arándanos (Media Libra)',
    category: 'granola',
    price: 8000,
    description: 'Granola artesanal con arándanos, media libra',
    ingredients: 'Avena, arándanos secos, nueces',
    benefits: 'Superalimento'
  },
  {
    id: 'granola-sin-dulce',
    name: 'Granola Sin Dulce (Para Diabéticos)',
    category: 'granola',
    price: 16000,
    description: 'Granola especial sin azúcar',
    ingredients: 'Avena, frutos secos, sin endulzantes',
    benefits: 'Apto para diabéticos'
  },

  // FRUTOS SECOS Y SEMILLAS
  {
    id: 'mix-frutos-250',
    name: 'Mix de Frutos Secos (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Mezcla premium de frutos secos, 250g',
    ingredients: 'Almendras, nueces, marañón, macadamia',
    benefits: 'Omega 3, proteínas'
  },
  {
    id: 'mix-frutos-125',
    name: 'Mix de Frutos Secos (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Mezcla premium de frutos secos, 125g',
    ingredients: 'Almendras, nueces, marañón, macadamia',
    benefits: 'Omega 3, proteínas'
  },
  {
    id: 'pistachos-250',
    name: 'Pistachos (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Pistachos naturales',
    ingredients: 'Pistachos',
    benefits: 'Rico en proteínas'
  },
  {
    id: 'pistachos-125',
    name: 'Pistachos (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Pistachos naturales',
    ingredients: 'Pistachos',
    benefits: 'Rico en proteínas'
  },
  {
    id: 'maranon-250',
    name: 'Marañón (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Marañón natural',
    ingredients: 'Marañón',
    benefits: 'Alto en magnesio'
  },
  {
    id: 'maranon-125',
    name: 'Marañón (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Marañón natural',
    ingredients: 'Marañón',
    benefits: 'Alto en magnesio'
  },
  {
    id: 'macadamia-250',
    name: 'Macadamia (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Nueces de macadamia premium',
    ingredients: 'Macadamia',
    benefits: 'Grasas saludables'
  },
  {
    id: 'macadamia-125',
    name: 'Macadamia (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Nueces de macadamia premium',
    ingredients: 'Macadamia',
    benefits: 'Grasas saludables'
  },
  {
    id: 'almendras-250',
    name: 'Almendras (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Almendras naturales',
    ingredients: 'Almendras',
    benefits: 'Vitamina E'
  },
  {
    id: 'almendras-125',
    name: 'Almendras (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Almendras naturales',
    ingredients: 'Almendras',
    benefits: 'Vitamina E'
  },
  {
    id: 'datiles-fruto-250',
    name: 'Dátiles (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Dátiles naturales',
    ingredients: 'Dátiles',
    benefits: 'Energía natural'
  },
  {
    id: 'datiles-fruto-125',
    name: 'Dátiles (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Dátiles naturales',
    ingredients: 'Dátiles',
    benefits: 'Energía natural'
  },
  {
    id: 'nuez-brasil-250',
    name: 'Nuez de Brasil (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Nueces de Brasil',
    ingredients: 'Nuez de Brasil',
    benefits: 'Selenio natural'
  },
  {
    id: 'nuez-brasil-125',
    name: 'Nuez de Brasil (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Nueces de Brasil',
    ingredients: 'Nuez de Brasil',
    benefits: 'Selenio natural'
  },
  {
    id: 'nuez-nogal-250',
    name: 'Nuez de Nogal (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Nueces de nogal',
    ingredients: 'Nuez de nogal',
    benefits: 'Omega 3'
  },
  {
    id: 'nuez-nogal-125',
    name: 'Nuez de Nogal (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Nueces de nogal',
    ingredients: 'Nuez de nogal',
    benefits: 'Omega 3'
  },
  {
    id: 'cacahuates-250',
    name: 'Cacahuates (250g)',
    category: 'frutos-secos',
    price: 20000,
    description: 'Cacahuates naturales',
    ingredients: 'Cacahuates',
    benefits: 'Proteína vegetal'
  },
  {
    id: 'cacahuates-125',
    name: 'Cacahuates (125g)',
    category: 'frutos-secos',
    price: 10000,
    description: 'Cacahuates naturales',
    ingredients: 'Cacahuates',
    benefits: 'Proteína vegetal'
  },
  {
    id: 'albaricoque',
    name: 'Albaricoque',
    category: 'frutos-secos',
    price: 10000,
    description: 'Albaricoques secos',
    ingredients: 'Albaricoque deshidratado',
    benefits: 'Rico en fibra'
  },
  {
    id: 'ciruelas-pasas',
    name: 'Ciruelas Pasas',
    category: 'frutos-secos',
    price: 5000,
    description: 'Ciruelas pasas naturales',
    ingredients: 'Ciruelas deshidratadas',
    benefits: 'Digestión saludable'
  },
  {
    id: 'semillas-girasol',
    name: 'Semillas de Girasol',
    category: 'frutos-secos',
    price: 5000,
    description: 'Semillas de girasol naturales',
    ingredients: 'Semillas de girasol',
    benefits: 'Vitamina E'
  },
  {
    id: 'semillas-calabaza',
    name: 'Semillas de Calabaza',
    category: 'frutos-secos',
    price: 6000,
    description: 'Semillas de calabaza',
    ingredients: 'Semillas de calabaza',
    benefits: 'Magnesio y zinc'
  },
  {
    id: 'semillas-chia',
    name: 'Semillas de Chía',
    category: 'frutos-secos',
    price: 5000,
    description: 'Semillas de chía',
    ingredients: 'Chía',
    benefits: 'Omega 3, fibra'
  },
  {
    id: 'linaza',
    name: 'Linaza',
    category: 'frutos-secos',
    price: 4000,
    description: 'Semillas de linaza',
    ingredients: 'Linaza',
    benefits: 'Omega 3'
  },
  {
    id: 'ajonjoli',
    name: 'Ajonjolí',
    category: 'frutos-secos',
    price: 12000,
    description: 'Semillas de ajonjolí',
    ingredients: 'Ajonjolí',
    benefits: 'Calcio natural'
  },
  {
    id: 'quinua',
    name: 'Quinua',
    category: 'frutos-secos',
    price: 10000,
    description: 'Quinua en grano',
    ingredients: 'Quinua',
    benefits: 'Proteína completa'
  },
  {
    id: 'flor-jamaica',
    name: 'Flor de Jamaica',
    category: 'frutos-secos',
    price: 4000,
    description: 'Flor de Jamaica deshidratada',
    ingredients: 'Flor de Jamaica',
    benefits: 'Antioxidantes'
  },
  {
    id: 'curcuma',
    name: 'Cúrcuma',
    category: 'frutos-secos',
    price: 5000,
    description: 'Cúrcuma en polvo',
    ingredients: 'Cúrcuma',
    benefits: 'Antiinflamatorio'
  },
  {
    id: 'sal-rosada-grano',
    name: 'Sal Rosada en Grano',
    category: 'frutos-secos',
    price: 12000,
    description: 'Sal rosada del Himalaya en grano',
    ingredients: 'Sal rosada',
    benefits: 'Minerales naturales'
  },
  {
    id: 'sal-rosada-molida',
    name: 'Sal Rosada Molida',
    category: 'frutos-secos',
    price: 12000,
    description: 'Sal rosada del Himalaya molida',
    ingredients: 'Sal rosada',
    benefits: 'Minerales naturales'
  },
  {
    id: 'harina-maca',
    name: 'Harina de Maca',
    category: 'frutos-secos',
    price: 26000,
    description: 'Harina de maca peruana',
    ingredients: 'Maca',
    benefits: 'Energizante natural'
  },
  {
    id: 'harina-algarrobo',
    name: 'Harina de Algarrobo',
    category: 'frutos-secos',
    price: 24000,
    description: 'Harina de algarrobo',
    ingredients: 'Algarrobo',
    benefits: 'Sin gluten'
  },
  {
    id: 'mix-maiz',
    name: 'Mix de Maíz',
    category: 'frutos-secos',
    price: 5000,
    description: 'Mezcla de maíz tostado',
    ingredients: 'Maíz variado',
    benefits: 'Snack natural'
  },
  {
    id: 'habas-fritas',
    name: 'Habas Fritas y Tostadas',
    category: 'frutos-secos',
    price: 2500,
    description: 'Habas fritas y tostadas',
    ingredients: 'Habas',
    benefits: 'Proteína vegetal'
  },

  // ENVASADOS
  {
    id: 'mantequilla-ghee-lb',
    name: 'Mantequilla Ghee (Libra)',
    category: 'envasados',
    price: 36000,
    description: 'Mantequilla clarificada ghee, 1 libra',
    ingredients: 'Mantequilla clarificada',
    benefits: 'Sin lactosa, alto punto de humo'
  },
  {
    id: 'mantequilla-ghee-media',
    name: 'Mantequilla Ghee (Media Libra)',
    category: 'envasados',
    price: 18000,
    description: 'Mantequilla clarificada ghee, media libra',
    ingredients: 'Mantequilla clarificada',
    benefits: 'Sin lactosa, alto punto de humo'
  },
  {
    id: 'miel-abejas',
    name: 'Miel de Abejas (500g)',
    category: 'envasados',
    price: 40000,
    description: 'Miel pura de abejas, 500g',
    ingredients: 'Miel 100% natural',
    benefits: 'Antibacteriana, energizante'
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
