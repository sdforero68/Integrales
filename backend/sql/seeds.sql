-- ============================================
-- Datos de Ejemplo (Seeds)
-- Base de Datos: Anita Integrales
-- ============================================

USE integrales_db;

-- ============================================
-- INSERTAR CATEGORÍAS
-- ============================================
INSERT INTO categorias (nombre, slug, descripcion, imagen, orden) VALUES
('Panadería', 'panaderia', 'Productos de panadería artesanal elaborados con harinas integrales y masa madre', 'Categorias/Panaderia.jpg', 1),
('Amasijos', 'amasijos', 'Amasijos tradicionales colombianos', 'Categorias/Amasijos.jpg', 2),
('Galletería', 'galleteria', 'Galletas artesanales con ingredientes naturales', 'Categorias/Galleteria.jpg', 3),
('Granola', 'granola', 'Granolas artesanales con frutos secos y semillas', 'Categorias/Granola.jpg', 4),
('Frutos Secos y Semillas', 'frutos-secos', 'Frutos secos, semillas y superalimentos', 'Categorias/FrutosSecos.jpg', 5),
('Envasados', 'envasados', 'Productos envasados como miel, ghee y más', 'Categorias/Envasados.jpg', 6);

-- ============================================
-- INSERTAR PRODUCTOS - PANADERÍA
-- ============================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, ingredientes, beneficios, precio, imagen, stock, destacado) VALUES
(1, 'Pan de Queso y Cuajada Grande', 'pan-queso-grande', 'Pan artesanal con queso y cuajada incorporados en la mezcla, tamaño grande 5 unds.', 'Harina integral, mantequilla, miel de caña, queso, quinua, yacón y linaza', 'Rico en proteínas y fibra, no contiene levadura.', 12000, 'Catálogo/CuajadaQuesoGrande.jpg', 50, TRUE),
(1, 'Pan de Queso y Cuajada Pequeño', 'pan-queso-pequeno', 'Pan artesanal con queso y cuajada incorporados en la mezcla, tamaño pequeño 10 unds.', 'Harina integral, mantequilla, miel de caña, queso, quinua, yacón y linaza', 'Rico en proteínas y fibra, no contiene levadura.', 10000, 'Catálogo/CuajadaQuesoPeque.jpg', 50, FALSE),
(1, 'Pan de Maíz Grande', 'pan-maiz-grande', 'Pan artesanal de maíz, con queso y cuajada, tamaño grande 5 unds.', 'Harina de maíz, mantequilla, miel de caña, queso, quinua, yacón y linaza', 'Sin gluten, rico en fibra', 12000, 'Catálogo/QuesoMaizGrande.jpg', 30, FALSE),
(1, 'Pan de Maíz Pequeño', 'pan-maiz-pequeno', 'Pan artesanal de maíz, con queso y cuajada, tamaño pequeño 6 unds.', 'Harina de maíz, mantequilla, miel de caña, queso, quinua, yacón y linaza', 'Sin gluten, rico en fibra', 7000, 'Catálogo/QuesoMaizPeque.jpg', 30, FALSE),
(1, 'Masa Madre de Centeno', 'masa-madre-centeno', 'Pan de masa madre (proceso de fermentación natural) con harina de centeno', 'Harina de centeno, masa madre natural y nueces', 'Digestión lenta, rico en minerales, libre de gluten, grasa, huevo, levadura y dulce.', 16000, 'Catálogo/AncestralCenteno.jpg', 20, TRUE),
(1, 'Masa Madre Ancestral Grande', 'masa-madre-ancestral-grande', 'Pan de masa madre con harinas ancestrales, tamaño grande', 'Quinua, amaranto, sagú, masa madre', 'Superalimento, alto en proteínas', 20000, 'Catálogo/AncestralGrande.jpg', 20, TRUE),
(1, 'Masa Madre Ancestral Pequeño', 'masa-madre-ancestral-pequeno', 'Pan de masa madre con harinas ancestrales, tamaño pequeño', 'Quinua, amaranto, sagú, masa madre', 'Superalimento, alto en proteínas', 14000, 'Catálogo/AncestralPeque.jpg', 20, FALSE),
(1, 'Panetón Grande', 'paneton-grande', 'Panetón artesanal grande', 'Harinas integrales, frutos secos, especias', 'Endulzado naturalmente', 20000, 'Catálogo/PanetónGrande.jpg', 15, FALSE),
(1, 'Panetón Mediano', 'paneton-mediano', 'Panetón artesanal mediano', 'Harinas integrales, frutos secos, especias', 'Endulzado naturalmente', 14000, 'Catálogo/PanetónMediano.jpg', 15, FALSE),
(1, 'Panetón Mini', 'paneton-mini', 'Panetón artesanal mini', 'Harinas integrales, frutos secos, especias', 'Endulzado naturalmente', 6000, 'Catálogo/PanetónPeque.jpg', 20, FALSE),
(1, 'Pan Relleno Surtido', 'relleno-surtido', 'Pan integral con relleno surtido', 'Harina integral, rellenos variados', 'Versátil y nutritivo', 16000, 'Catálogo/RellenoSurtido.jpg', 25, FALSE),
(1, 'Pan Relleno de Cacao', 'relleno-cacao', 'Pan integral con relleno de cacao', 'Harina integral, cacao puro', 'Antioxidantes del cacao', 18000, 'Catálogo/RellenoCacao.jpg', 25, TRUE),
(1, 'Mogollas', 'mogollas', 'Mogollas artesanales integrales', 'Harina integral, masa madre', 'Tradicional y saludable', 10000, 'Catálogo/Mogollas.jpg', 30, FALSE),
(1, 'Roscones Integrales', 'roscones', 'Roscones integrales artesanales', 'Harina integral, especias', 'Crujientes y nutritivos', 6000, 'Catálogo/Roscones.jpg', 40, FALSE);

-- ============================================
-- INSERTAR PRODUCTOS - AMASIJOS
-- ============================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, ingredientes, beneficios, precio, imagen, stock, destacado) VALUES
(2, 'Resobados', 'resobados', 'Resobados artesanales', 'Harina, mantequilla', 'Textura única', 7000, 'Catálogo/Resobados.jpg', 50, FALSE),
(2, 'Achiras (18 unidades)', 'achiras-18', 'Achiras tradicionales, paquete de 18', 'Almidón de achira, queso', 'Sin gluten', 7000, 'Catálogo/AchirasGrandes.jpg', 40, TRUE),
(2, 'Achiras (9 unidades)', 'achiras-9', 'Achiras tradicionales, paquete de 9', 'Almidón de achira, queso', 'Sin gluten', 3500, 'Catálogo/AchirasPeque.jpg', 40, FALSE);

-- ============================================
-- INSERTAR PRODUCTOS - GALLETERÍA
-- ============================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, ingredientes, beneficios, precio, imagen, stock, destacado) VALUES
(3, 'Galletas Chip Cacao', 'galletas-chip-cacao', 'Galletas con chips de cacao', 'Harina integral, chips de cacao puro', 'Antioxidantes', 7000, 'Catálogo/GalletasCacao.jpg', 60, TRUE),
(3, 'Galletas de Café', 'galletas-cafe', 'Galletas con sabor a café', 'Café colombiano, harina integral', 'Energizantes', 7000, 'Catálogo/GalletasCafé.jpg', 60, FALSE),
(3, 'Galletas de Jengibre', 'galletas-jengibre', 'Galletas con jengibre', 'Jengibre fresco, especias', 'Antiinflamatorio', 7000, 'Catálogo/GalletasJenjibre.jpg', 60, FALSE),
(3, 'Galletas de Sal Grandes', 'galletas-sal-grande', 'Galletas saladas, presentación grande', 'Harina integral, sal rosada', 'Snack saludable', 16000, 'Catálogo/GalletasSal.jpg', 30, FALSE),
(3, 'Tostadas', 'tostadas', 'Tostadas integrales crujientes', 'Harina integral, semillas', 'Perfectas para dips', 7000, 'Catálogo/Tostadas.jpg', 50, FALSE);

-- ============================================
-- INSERTAR PRODUCTOS - GRANOLA
-- ============================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, ingredientes, beneficios, precio, imagen, stock, destacado) VALUES
(4, 'Granola con Dátiles (Libra)', 'granola-datiles-lb', 'Granola artesanal con dátiles, 1 libra', 'Avena, dátiles, frutos secos', 'Energía natural', 16000, 'Catálogo/LibraDátiles.jpg', 40, TRUE),
(4, 'Granola con Dátiles (Media Libra)', 'granola-datiles-media', 'Granola artesanal con dátiles, media libra', 'Avena, dátiles, frutos secos', 'Energía natural', 8000, 'Catálogo/MediaDátiles.jpg', 40, FALSE),
(4, 'Granola con Uvas (Libra)', 'granola-uvas-lb', 'Granola artesanal con uvas pasas, 1 libra', 'Avena, uvas pasas, almendras', 'Antioxidantes', 16000, 'Catálogo/LibraUvas.jpg', 40, FALSE),
(4, 'Granola con Uvas (Media Libra)', 'granola-uvas-media', 'Granola artesanal con uvas pasas, media libra', 'Avena, uvas pasas, almendras', 'Antioxidantes', 8000, 'Catálogo/MediaUvas.jpg', 40, FALSE),
(4, 'Granola con Arándanos (Libra)', 'granola-arandanos-lb', 'Granola artesanal con arándanos, 1 libra', 'Avena, arándanos secos, nueces', 'Superalimento', 16000, 'Catálogo/LibraArándanos.jpg', 40, TRUE),
(4, 'Granola con Arándanos (Media Libra)', 'granola-arandanos-media', 'Granola artesanal con arándanos, media libra', 'Avena, arándanos secos, nueces', 'Superalimento', 8000, 'Catálogo/MediaArándanos.jpg', 40, FALSE),
(4, 'Granola Sin Dulce (Para Diabéticos)', 'granola-sin-dulce', 'Granola especial sin azúcar', 'Avena, frutos secos, sin endulzantes', 'Apto para diabéticos', 16000, 'Catálogo/LibraDiabéticos.jpg', 30, TRUE);

-- ============================================
-- INSERTAR PRODUCTOS - FRUTOS SECOS Y SEMILLAS
-- ============================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, ingredientes, beneficios, precio, imagen, stock, destacado) VALUES
(5, 'Pistachos (250g)', 'pistachos-250', 'Pistachos naturales', 'Pistachos', 'Rico en proteínas', 20000, 'Catálogo/Pistachos250.jpg', 25, FALSE),
(5, 'Pistachos (125g)', 'pistachos-125', 'Pistachos naturales', 'Pistachos', 'Rico en proteínas', 10000, 'Catálogo/Pistachos125.jpg', 30, FALSE),
(5, 'Marañón (250g)', 'maranon-250', 'Marañón natural', 'Marañón', 'Alto en magnesio', 20000, 'Catálogo/Marañon250.jpg', 25, FALSE),
(5, 'Marañón (125g)', 'maranon-125', 'Marañón natural', 'Marañón', 'Alto en magnesio', 10000, 'Catálogo/Marañon125.jpg', 30, FALSE),
(5, 'Macadamia (250g)', 'macadamia-250', 'Nueces de macadamia premium', 'Macadamia', 'Grasas saludables', 20000, 'Catálogo/Macadamia250.jpg', 20, TRUE),
(5, 'Macadamia (125g)', 'macadamia-125', 'Nueces de macadamia premium', 'Macadamia', 'Grasas saludables', 10000, 'Catálogo/Macadamia125.jpg', 25, FALSE),
(5, 'Almendras (250g)', 'almendras-250', 'Almendras naturales', 'Almendras', 'Vitamina E', 20000, 'Catálogo/Almendra250.jpg', 30, TRUE),
(5, 'Almendras (125g)', 'almendras-125', 'Almendras naturales', 'Almendras', 'Vitamina E', 10000, 'Catálogo/Almendra125.jpg', 35, FALSE),
(5, 'Dátiles (250g)', 'datiles-fruto-250', 'Dátiles naturales', 'Dátiles', 'Energía natural', 20000, 'Catálogo/Dátiles250.jpg', 30, FALSE),
(5, 'Dátiles (125g)', 'datiles-fruto-125', 'Dátiles naturales', 'Dátiles', 'Energía natural', 10000, 'Catálogo/Dátiles125.jpg', 35, FALSE),
(5, 'Nuez de Brasil (250g)', 'nuez-brasil-250', 'Nueces de Brasil', 'Nuez de Brasil', 'Selenio natural', 20000, 'Catálogo/NuezBrasil.jpg', 20, FALSE),
(5, 'Nuez de Brasil (125g)', 'nuez-brasil-125', 'Nueces de Brasil', 'Nuez de Brasil', 'Selenio natural', 10000, 'Catálogo/NuezBrasil.jpg', 25, FALSE),
(5, 'Nuez de Nogal (250g)', 'nuez-nogal-250', 'Nueces de nogal', 'Nuez de nogal', 'Omega 3', 20000, 'Catálogo/NuezNogal.jpg', 25, FALSE),
(5, 'Nuez de Nogal (125g)', 'nuez-nogal-125', 'Nueces de nogal', 'Nuez de nogal', 'Omega 3', 10000, 'Catálogo/NuezNogal.jpg', 30, FALSE),
(5, 'Albaricoque', 'albaricoque', 'Albaricoques secos', 'Albaricoque deshidratado', 'Rico en fibra', 10000, 'Catálogo/Albaricoque.jpg', 40, FALSE),
(5, 'Ciruelas Pasas', 'ciruelas-pasas', 'Ciruelas pasas naturales', 'Ciruelas deshidratadas', 'Digestión saludable', 5000, 'Catálogo/Ciruelas.jpg', 50, FALSE),
(5, 'Semillas de Girasol', 'semillas-girasol', 'Semillas de girasol naturales', 'Semillas de girasol', 'Vitamina E', 5000, 'Catálogo/SemillasGirasol.jpg', 60, FALSE),
(5, 'Semillas de Calabaza', 'semillas-calabaza', 'Semillas de calabaza', 'Semillas de calabaza', 'Magnesio y zinc', 6000, 'Catálogo/SemillasCalabaza.jpg', 55, FALSE),
(5, 'Semillas de Chía', 'semillas-chia', 'Semillas de chía', 'Chía', 'Omega 3, fibra', 5000, 'Catálogo/SemillasChía.jpg', 70, TRUE),
(5, 'Linaza', 'linaza', 'Semillas de linaza', 'Linaza', 'Omega 3', 4000, 'Catálogo/Linaza.jpg', 70, FALSE),
(5, 'Ajonjolí', 'ajonjoli', 'Semillas de ajonjolí', 'Ajonjolí', 'Calcio natural', 12000, 'Catálogo/Ajonjolí.jpg', 50, FALSE),
(5, 'Quinua', 'quinua', 'Quinua en grano', 'Quinua', 'Proteína completa', 10000, 'Catálogo/Quinua.jpg', 60, TRUE),
(5, 'Flor de Jamaica', 'flor-jamaica', 'Flor de Jamaica deshidratada', 'Flor de Jamaica', 'Antioxidantes', 4000, 'Catálogo/FlorJamaica.jpg', 50, FALSE),
(5, 'Cúrcuma', 'curcuma', 'Cúrcuma en polvo', 'Cúrcuma', 'Antiinflamatorio', 5000, 'Catálogo/Cúrcuma.jpg', 45, FALSE),
(5, 'Sal Rosada en Grano', 'sal-rosada-grano', 'Sal rosada del Himalaya en grano', 'Sal rosada', 'Minerales naturales', 12000, 'Catálogo/SalEntera.jpg', 40, FALSE),
(5, 'Sal Rosada Molida', 'sal-rosada-molida', 'Sal rosada del Himalaya molida', 'Sal rosada', 'Minerales naturales', 12000, 'Catálogo/SalMolida.jpg', 40, FALSE),
(5, 'Mix de Maíz', 'mix-maiz', 'Mezcla de maíz tostado', 'Maíz variado', 'Snack natural', 5000, 'Catálogo/MixMaíz.jpg', 50, FALSE);

-- ============================================
-- INSERTAR PRODUCTOS - ENVASADOS
-- ============================================
INSERT INTO productos (categoria_id, nombre, slug, descripcion, ingredientes, beneficios, precio, imagen, stock, destacado) VALUES
(6, 'Mantequilla Ghee (Libra)', 'mantequilla-ghee-lb', 'Mantequilla clarificada ghee, 1 libra', 'Mantequilla clarificada', 'Sin lactosa, alto punto de humo', 36000, 'Catálogo/GueeLibra.jpg', 20, TRUE),
(6, 'Mantequilla Ghee (Media Libra)', 'mantequilla-ghee-media', 'Mantequilla clarificada ghee, media libra', 'Mantequilla clarificada', 'Sin lactosa, alto punto de humo', 18000, 'Catálogo/GueeMedia.jpg', 25, FALSE),
(6, 'Miel de Abejas (500g)', 'miel-abejas', 'Miel pura de abejas, 500g', 'Miel 100% natural', 'Antibacteriana, energizante', 40000, 'Catálogo/Miel.jpg', 30, TRUE);

-- ============================================
-- INSERTAR PUNTOS DE VENTA
-- ============================================
INSERT INTO puntos_venta (nombre, direccion, ciudad, telefono, horario, activo) VALUES
('Floraria', 'Dirección del mercado Floraria', 'Bogotá', '3222225271', 'Sábados cada 15 días', TRUE),
('Kennedy La Macarena', 'Dirección del mercado Kennedy La Macarena', 'Bogotá', '3222225271', 'Sábados cada 15 días', TRUE),
('Parque Principal Fontibón', 'Parque Principal Fontibón', 'Bogotá', '3222225271', 'Sábados cada 8 días', TRUE);

-- ============================================
-- INSERTAR USUARIO ADMINISTRADOR DE PRUEBA
-- Password: admin123 (hash bcrypt)
-- ============================================
-- NOTA: En producción, usar bcrypt para hashear contraseñas
-- Ejemplo de hash para 'admin123': $2b$10$rOzJ8K8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK
INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol, activo, email_verificado) VALUES
('Admin', 'Sistema', 'admin@anitaintegrales.com', '3222225271', '$2b$10$rOzJ8K8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK', 'admin', TRUE, TRUE);

