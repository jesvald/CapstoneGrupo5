const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Data Generators
const INDUSTRIES = ['Construcción', 'Tecnología', 'Minería', 'Salud', 'Transporte', 'Servicios', 'Energía', 'Retail'];
const REGIONS = ['Metropolitana', 'Valparaíso', 'Biobío', 'Antofagasta', 'Araucanía', 'Los Lagos'];
const CITIES = {
    'Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Maipú', 'Puente Alto'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
    'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles'],
    'Antofagasta': ['Antofagasta', 'Calama'],
    'Araucanía': ['Temuco', 'Villarrica'],
    'Los Lagos': ['Puerto Montt', 'Osorno']
};

const PROVIDER_NAMES = [
    'Constructora', 'Servicios', 'Ingeniería', 'Soluciones', 'Tecnologías', 'Logística', 'Consultora', 'Inversiones', 'Comercial', 'Industrial'
];
const PROVIDER_SUFFIXES = ['Limitada', 'S.A.', 'SpA', 'E.I.R.L.', 'y Cía.'];

const TENDER_CATEGORIES = ['Infraestructura', 'Tecnología', 'Servicios', 'Suministros', 'Consultoría'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProvider() {
    const name = `${getRandomElement(PROVIDER_NAMES)} ${getRandomElement(['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Norte', 'Sur', 'Andina', 'Pacífico', 'Global'])} ${getRandomElement(PROVIDER_SUFFIXES)}`;
    const region = getRandomElement(REGIONS);
    const city = getRandomElement(CITIES[region]);

    return {
        nombre: name,
        rubro: getRandomElement(INDUSTRIES),
        telefono: `+569${getRandomInt(10000000, 99999999)}`,
        email: `contacto@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.cl`,
        direccion: `Calle ${getRandomInt(1, 999)}`,
        ciudad: city,
        region: region
    };
}

function generateTender(index) {
    const category = getRandomElement(TENDER_CATEGORIES);
    const date = new Date();
    date.setDate(date.getDate() - getRandomInt(0, 60)); // Published in last 60 days

    return {
        codigo: `LIC-2024-${String(index).padStart(3, '0')}`,
        titulo: `Licitación de ${category} - Proyecto ${getRandomInt(100, 999)}`,
        descripcion: `Descripción detallada del proyecto de ${category.toLowerCase()}...`,
        monto_estimado: getRandomInt(1000000, 100000000),
        fecha_publicacion: date.toISOString().slice(0, 10),
        fecha_cierre: new Date(date.getTime() + getRandomInt(15, 45) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        estado: 'abierta',
        categoria: category
    };
}

async function seed() {
    console.log('🌱 Starting database seeding...');
    const connection = await mysql.createConnection(DB_CONFIG);

    try {
        // 1. Truncate tables
        console.log('🗑️  Cleaning existing data...');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE ofertas');
        await connection.execute('TRUNCATE TABLE llamadas');
        await connection.execute('TRUNCATE TABLE licitaciones');
        await connection.execute('TRUNCATE TABLE proveedores');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Insert Providers
        console.log('🏗️  Creating Providers...');
        const providers = [];
        for (let i = 0; i < 50; i++) {
            providers.push(generateProvider());
        }

        for (const p of providers) {
            await connection.execute(
                'INSERT INTO proveedores (nombre, rubro, telefono, email, direccion, ciudad, region) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.nombre, p.rubro, p.telefono, p.email, p.direccion, p.ciudad, p.region]
            );
        }
        console.log(`✅ ${providers.length} Providers inserted.`);

        // 3. Insert Tenders
        console.log('📄 Creating Tenders...');
        const tenders = [];
        for (let i = 1; i <= 20; i++) {
            tenders.push(generateTender(i));
        }

        for (const t of tenders) {
            await connection.execute(
                'INSERT INTO licitaciones (codigo, titulo, descripcion, monto_estimado, fecha_publicacion, fecha_cierre, estado, categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [t.codigo, t.titulo, t.descripcion, t.monto_estimado, t.fecha_publicacion, t.fecha_cierre, t.estado, t.categoria]
            );
        }
        console.log(`✅ ${tenders.length} Tenders inserted.`);

        // Get IDs
        const [providerRows] = await connection.execute('SELECT id FROM proveedores');
        const providerIds = providerRows.map(r => r.id);

        const [tenderRows] = await connection.execute('SELECT id FROM licitaciones');
        const tenderIds = tenderRows.map(r => r.id);

        // 4. Insert Calls
        console.log('📞 Creating Calls...');
        const CALL_STATUSES = ['completada', 'ocupada', 'fallida', 'sin_respuesta'];
        const SENTIMENTS = ['positivo', 'neutro', 'negativo'];

        let callsCount = 0;
        const today = new Date();

        for (let i = 0; i < 500; i++) {
            const providerId = getRandomElement(providerIds);
            const tenderId = getRandomElement(tenderIds);
            const daysAgo = getRandomInt(0, 30);
            const callDate = new Date(today);
            callDate.setDate(today.getDate() - daysAgo);
            callDate.setHours(getRandomInt(9, 18), getRandomInt(0, 59));

            const status = Math.random() > 0.2 ? 'completada' : getRandomElement(['ocupada', 'fallida', 'sin_respuesta']);
            let duration = 0;
            let successful = false;
            let interested = null;
            let sentiment = null;
            let conversion = false;

            if (status === 'completada') {
                duration = getRandomInt(30, 600);
                successful = true;
                interested = Math.random() > 0.4; // 60% interested
                sentiment = getRandomElement(SENTIMENTS);

                if (interested) {
                    conversion = Math.random() > 0.5; // 50% of interested convert to offer
                    if (conversion) sentiment = 'positivo';
                } else {
                    sentiment = Math.random() > 0.5 ? 'neutro' : 'negativo';
                }
            }

            await connection.execute(
                `INSERT INTO llamadas (
          proveedor_id, licitacion_id, fecha_llamada, estado, duracion_segundos, 
          contacto_exitoso, proveedor_interesado, conversion_oferta, sentimiento, 
          transcripcion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    providerId, tenderId, callDate, status, duration,
                    successful, interested, conversion, sentiment,
                    status === 'completada' ? 'Transcripción simulada...' : null
                ]
            );
            callsCount++;

            // 5. Create Offer if converted
            if (conversion) {
                await connection.execute(
                    `INSERT INTO ofertas (
            licitacion_id, proveedor_id, monto_ofertado, fecha_oferta, estado
          ) VALUES (?, ?, ?, ?, ?)`,
                    [
                        tenderId, providerId, getRandomInt(1000000, 50000000),
                        callDate, 'pendiente'
                    ]
                );
            }
        }
        console.log(`✅ ${callsCount} Calls inserted.`);

        console.log('✨ Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await connection.end();
    }
}

seed();
