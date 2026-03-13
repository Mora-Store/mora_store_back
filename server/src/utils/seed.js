/**
 * Complete Seed — populates DB with all categories, subcategories,
 * 30+ demo products with real Unsplash images and discounts.
 * Usage: node src/utils/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

const CATEGORIES = [
    {
        name: 'Mujer',
        slug: 'mujer',
        icon: '👩',
        subcategories: [
            { name: 'Aretes', slug: 'aretes' },
            { name: 'Relojes', slug: 'relojes' },
            { name: 'Labiales', slug: 'labiales' },
            { name: 'Perfumes', slug: 'perfumes' },
            { name: 'Bolsos', slug: 'bolsos' },
            { name: 'Pulseras', slug: 'pulseras' },
            { name: 'Collares', slug: 'collares' },
            { name: 'Pinturas', slug: 'pinturas' },
        ],
    },
    {
        name: 'Hombre',
        slug: 'hombre',
        icon: '👨',
        subcategories: [
            { name: 'Relojes', slug: 'relojes' },
            { name: 'Carteras', slug: 'carteras' },
            { name: 'Cinturones', slug: 'cinturones' },
            { name: 'Perfumes', slug: 'perfumes' },
            { name: 'Llaveros', slug: 'llaveros' },
        ],
    },
    {
        name: 'Mascotas',
        slug: 'mascotas',
        icon: '🐾',
        subcategories: [
            { name: 'Collares', slug: 'collares' },
            { name: 'Correas', slug: 'correas' },
            { name: 'Ropa', slug: 'ropa' },
            { name: 'Juguetes', slug: 'juguetes' },
            { name: 'Accesorios', slug: 'accesorios' },
        ],
    },
    {
        name: 'Niños',
        slug: 'ninos',
        icon: '👶',
        subcategories: [
            { name: 'Mochilas', slug: 'mochilas' },
            { name: 'Accesorios cabello', slug: 'accesorios-cabello' },
            { name: 'Juguetes', slug: 'juguetes' },
            { name: 'Ropa', slug: 'ropa' },
        ],
    },
    {
        name: 'Ropa',
        slug: 'ropa',
        icon: '👗',
        subcategories: [
            { name: 'Blusas', slug: 'blusas' },
            { name: 'Pantalones', slug: 'pantalones' },
            { name: 'Vestidos', slug: 'vestidos' },
            { name: 'Camisas', slug: 'camisas' },
        ],
    },
];

// High-quality Unsplash image URLs for each product type
const IMG = {
    aretes: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80&fit=crop',
    aretes2: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80&fit=crop',
    reloj_mujer: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&fit=crop',
    reloj_mujer2: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80&fit=crop',
    labial: 'https://images.unsplash.com/photo-1586495777744-4e6b58f4d2c6?w=600&q=80&fit=crop',
    labial2: 'https://images.unsplash.com/photo-1631214524020-3c69268cc4b0?w=600&q=80&fit=crop',
    perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80&fit=crop',
    perfume2: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80&fit=crop',
    bolso: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&fit=crop',
    bolso2: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&fit=crop',
    pulsera: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80&fit=crop',
    pulsera2: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80&fit=crop',
    collar: 'https://images.unsplash.com/photo-1599459182728-50e35fef5e7d?w=600&q=80&fit=crop',
    collar2: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80&fit=crop',
    pintura: 'https://images.unsplash.com/photo-1604653136316-e06e8793f95e?w=600&q=80&fit=crop',
    reloj_h: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80&fit=crop',
    reloj_h2: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80&fit=crop',
    cartera: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80&fit=crop',
    cinturon: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&q=80&fit=crop',
    perfume_h: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80&fit=crop',
    llavero: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80&fit=crop',
    collar_perro: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=600&q=80&fit=crop',
    correa: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&q=80&fit=crop',
    ropa_mascota: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80&fit=crop',
    juguete_pet: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80&fit=crop',
    acc_mascota: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80&fit=crop',
    mochila: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&fit=crop',
    cabello: 'https://images.unsplash.com/photo-1604472726034-b2b72b1ff6b2?w=600&q=80&fit=crop',
    juguete: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c4?w=600&q=80&fit=crop',
    ropa_nino: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80&fit=crop',
    blusa: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80&fit=crop',
    pantalon: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&fit=crop',
    vestido: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80&fit=crop',
    camisa: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80&fit=crop',
};

const run = async () => {
    await connectDB();
    console.log('🌱 Iniciando seed completo...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Settings.deleteMany({});

    // Admin
    const admin = new User({
        username: process.env.ADMIN_USER || 'admin',
        passwordHash: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
    });
    await admin.save();
    console.log(`✅ Admin: ${admin.username}`);

    // Categories
    const cats = await Category.insertMany(CATEGORIES);
    console.log(`✅ ${cats.length} categorías creadas`);
    const M = cats.find(c => c.slug === 'mujer');
    const H = cats.find(c => c.slug === 'hombre');
    const P = cats.find(c => c.slug === 'mascotas');
    const N = cats.find(c => c.slug === 'ninos');
    const R = cats.find(c => c.slug === 'ropa');

    const PRODUCTS = [
        // ── MUJER / Aretes
        {
            name: 'Aretes de Luna Dorados',
            description: 'Aretes colgantes inspirados en la luna llena. Baño de oro 18k sobre bronce, hipoalergénicos.',
            price: 45, discount: 20, category: M._id, subcategory: 'Aretes', featured: true,
            images: [IMG.aretes],
        },
        {
            name: 'Aretes Perla Vintage',
            description: 'Aretes de perla cultivada con cierre de mariposa. Elegantes para cualquier ocasión.',
            price: 38, discount: 0, category: M._id, subcategory: 'Aretes', featured: false,
            images: [IMG.aretes2],
        },
        // ── MUJER / Relojes
        {
            name: 'Reloj Elegance Rose Gold',
            description: 'Reloj de cuarzo con brazalete de acero inoxidable en tono rose gold. Resistente al agua 30m.',
            price: 320, discount: 15, category: M._id, subcategory: 'Relojes', featured: true,
            images: [IMG.reloj_mujer],
        },
        {
            name: 'Reloj Marmol Blanco',
            description: 'Elegante reloj con esfera efecto mármol, correa de cuero genuino blanco.',
            price: 285, discount: 0, category: M._id, subcategory: 'Relojes', featured: false,
            images: [IMG.reloj_mujer2],
        },
        // ── MUJER / Labiales
        {
            name: 'Labial Rojo Pasión',
            description: 'Labial de larga duración con formula hidratante y cobertura total. Tono rojo intenso.',
            price: 28, discount: 0, category: M._id, subcategory: 'Labiales', featured: false,
            images: [IMG.labial],
        },
        {
            name: 'Set Labiales Nude 3pcs',
            description: 'Pack de 3 labiales en tonos nude: beige natural, nude rosado y marrón cálido.',
            price: 65, discount: 25, category: M._id, subcategory: 'Labiales', featured: true,
            images: [IMG.labial2],
        },
        // ── MUJER / Perfumes
        {
            name: 'Perfume Fleur Blanc 100ml',
            description: 'Fragancia femenina con notas de jazmín, rosa y vainilla. Duración 8 horas.',
            price: 180, discount: 10, category: M._id, subcategory: 'Perfumes', featured: true,
            images: [IMG.perfume],
        },
        // ── MUJER / Bolsos
        {
            name: 'Bolso Mini Camel',
            description: 'Bolso miniatura en cuero vegano color camel con cadena dorada. Tendencia esta temporada.',
            price: 185, discount: 0, category: M._id, subcategory: 'Bolsos', featured: true,
            images: [IMG.bolso],
        },
        {
            name: 'Bolso Tote Lona Premium',
            description: 'Bolso tote de lona resistente con detalles de cuero. Ideal para el día a día.',
            price: 95, discount: 0, category: M._id, subcategory: 'Bolsos', featured: false,
            images: [IMG.bolso2],
        },
        // ── MUJER / Pulseras
        {
            name: 'Pulsera Dorada Minimalista',
            description: 'Pulsera delgada en baño de oro 18k. Diseño minimalista que combina con todo.',
            price: 35, discount: 0, category: M._id, subcategory: 'Pulseras', featured: false,
            images: [IMG.pulsera],
        },
        {
            name: 'Set Pulseras Boho 5pcs',
            description: 'Pack de 5 pulseras estilo bohemio: metálicas, de hilo y con charms.',
            price: 48, discount: 15, category: M._id, subcategory: 'Pulseras', featured: false,
            images: [IMG.pulsera2],
        },
        // ── MUJER / Collares
        {
            name: 'Collar de Perlas Moderno',
            description: 'Collar multicapa con perlas artificiales y dije de estrella. Longitud ajustable.',
            price: 65, discount: 0, category: M._id, subcategory: 'Collares', featured: false,
            images: [IMG.collar],
        },
        {
            name: 'Collar Corazón Plata',
            description: 'Collar de plata 925 con dije de corazón. Caja de regalo incluida.',
            price: 120, discount: 20, category: M._id, subcategory: 'Collares', featured: true,
            images: [IMG.collar2],
        },
        // ── MUJER / Pinturas
        {
            name: 'Set Pinturas Uñas 12 colores',
            description: 'Set de 12 esmaltes de uñas de larga duración. Colores de temporada, sin tóxicos.',
            price: 42, discount: 0, category: M._id, subcategory: 'Pinturas', featured: false,
            images: [IMG.pintura],
        },
        // ── HOMBRE / Relojes
        {
            name: 'Reloj Clásico Café Hombre',
            description: 'Reloj analógico con correa de cuero genuino color café. Movimiento japonés Miyota.',
            price: 380, discount: 0, category: H._id, subcategory: 'Relojes', featured: true,
            images: [IMG.reloj_h],
        },
        {
            name: 'Reloj Deportivo Cronógrafo',
            description: 'Reloj deportivo con cronógrafo, resistente al agua 100m. Correa de silicona.',
            price: 290, discount: 10, category: H._id, subcategory: 'Relojes', featured: true,
            images: [IMG.reloj_h2],
        },
        // ── HOMBRE / Carteras
        {
            name: 'Cartera Slim Negra',
            description: 'Cartera delgada RFID en cuero genuino con 6 ranuras para tarjetas.',
            price: 120, discount: 0, category: H._id, subcategory: 'Carteras', featured: false,
            images: [IMG.cartera],
        },
        // ── HOMBRE / Cinturones
        {
            name: 'Cinturón Cuero Marrón Clásico',
            description: 'Cinturón de cuero genuino con hebilla de acero inoxidable. Tallas S al XL.',
            price: 75, discount: 0, category: H._id, subcategory: 'Cinturones', featured: false,
            images: [IMG.cinturon],
        },
        // ── HOMBRE / Perfumes
        {
            name: 'Perfume Oud Noir 100ml',
            description: 'Fragancia masculina con notas de madera de oud, cuero y especias. Intensa y duradera.',
            price: 220, discount: 20, category: H._id, subcategory: 'Perfumes', featured: true,
            images: [IMG.perfume_h],
        },
        // ── HOMBRE / Llaveros
        {
            name: 'Llavero Cuero Trenzado',
            description: 'Llavero artesanal de cuero trenzado con argolla de acero inoxidable.',
            price: 25, discount: 0, category: H._id, subcategory: 'Llaveros', featured: false,
            images: [IMG.llavero],
        },
        // ── MASCOTAS / Collares
        {
            name: 'Collar Ajustable Perro',
            description: 'Collar ajustable con medallón personalizable. Disponible en varios colores.',
            price: 40, discount: 0, category: P._id, subcategory: 'Collares', featured: false,
            images: [IMG.collar_perro],
        },
        // ── MASCOTAS / Correas
        {
            name: 'Correa Retráctil 5m',
            description: 'Correa retráctil resistente hasta 25kg. Freno de seguridad con candado.',
            price: 55, discount: 15, category: P._id, subcategory: 'Correas', featured: false,
            images: [IMG.correa],
        },
        // ── MASCOTAS / Ropa
        {
            name: 'Suéter Lana Mascota S',
            description: 'Suéter de lana suave para mascotas pequeñas. Diseño clásico a rayas.',
            price: 48, discount: 0, category: P._id, subcategory: 'Ropa', featured: false,
            images: [IMG.ropa_mascota],
        },
        // ── MASCOTAS / Juguetes
        {
            name: 'Juguete Mordedor Kong',
            description: 'Juguete de goma resistente relleno de sabor. Ideal para limpieza dental.',
            price: 32, discount: 0, category: P._id, subcategory: 'Juguetes', featured: false,
            images: [IMG.juguete_pet],
        },
        // ── MASCOTAS / Accesorios
        {
            name: 'Set Cuencos Doble Acero',
            description: 'Set de 2 cuencos de acero inoxidable con soporte antideslizante.',
            price: 38, discount: 10, category: P._id, subcategory: 'Accesorios', featured: false,
            images: [IMG.acc_mascota],
        },
        // ── NIÑOS / Mochilas
        {
            name: 'Mochila Unicornio Niña',
            description: 'Mochila escolar con diseño de unicornio. Resistente al agua, compartimentos organizados.',
            price: 85, discount: 20, category: N._id, subcategory: 'Mochilas', featured: false,
            images: [IMG.mochila],
        },
        // ── NIÑOS / Accesorios cabello
        {
            name: 'Set Accesorios Cabello 20pcs',
            description: 'Kit de 20 accesorios de cabello: ligas, diademas y clips de colores.',
            price: 22, discount: 0, category: N._id, subcategory: 'Accesorios cabello', featured: false,
            images: [IMG.cabello],
        },
        // ── NIÑOS / Juguetes
        {
            name: 'Set Bloques Madera 50pcs',
            description: 'Bloques de madera natural certificada, pinturas atóxicas. Desarrolla creatividad.',
            price: 68, discount: 0, category: N._id, subcategory: 'Juguetes', featured: false,
            images: [IMG.juguete],
        },
        // ── NIÑOS / Ropa
        {
            name: 'Set Pijama Estrellitas 2pcs',
            description: 'Pijama de algodón 100% orgánico con estampado de estrellas. Tallas 2-8 años.',
            price: 58, discount: 15, category: N._id, subcategory: 'Ropa', featured: false,
            images: [IMG.ropa_nino],
        },
        // ── ROPA / Blusas
        {
            name: 'Blusa Floral Primavera',
            description: 'Blusa de gasa con estampado floral. Tallas S, M, L, XL. Lavado a mano.',
            price: 95, discount: 0, category: R._id, subcategory: 'Blusas', featured: false,
            images: [IMG.blusa],
        },
        // ── ROPA / Pantalones
        {
            name: 'Pantalón Mom Jeans Vintage',
            description: 'Jeans de corte mom con lavado vintage. Denim 100% algodón. Tallas XS-XL.',
            price: 145, discount: 30, category: R._id, subcategory: 'Pantalones', featured: true,
            images: [IMG.pantalon],
        },
        // ── ROPA / Vestidos
        {
            name: 'Vestido Midi Floral',
            description: 'Vestido midi con estampado floral y escote en V. Perfecto para ocasiones especiales.',
            price: 185, discount: 0, category: R._id, subcategory: 'Vestidos', featured: true,
            images: [IMG.vestido],
        },
        // ── ROPA / Camisas
        {
            name: 'Camisa Lino Hombre Blanca',
            description: 'Camisa de lino 100% con corte slim. Ideal para el verano. Tallas S-XXL.',
            price: 120, discount: 0, category: R._id, subcategory: 'Camisas', featured: false,
            images: [IMG.camisa],
        },
    ];

    const created = await Product.insertMany(PRODUCTS);
    console.log(`✅ ${created.length} productos creados`);

    await Settings.create({
        whatsappNumber: process.env.WHATSAPP_NUMBER || '51999123456',
        businessName: 'Catálogo Accesorios',
    });
    console.log('✅ Configuración creada');

    console.log('\n🎉 Seed completo finalizado!');
    console.log(`   Admin: ${process.env.ADMIN_USER || 'admin'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    await mongoose.disconnect();
    process.exit(0);
};

run().catch(err => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
});
