require('dotenv').config();
const { pool } = require('./src/config/database');

async function testQuery() {
    try {
        console.log('Testing direct SQL query...');

        // Test 1: Simple query without parameters
        const [result1] = await pool.execute('SELECT COUNT(*) as count FROM llamadas');
        console.log('Test 1 - Count llamadas:', result1[0].count);

        // Test 2: Query with LIMIT parameter
        const limit = 5;
        const [result2] = await pool.execute(
            'SELECT id FROM llamadas ORDER BY fecha_llamada DESC LIMIT ?',
            [limit]
        );
        console.log('Test 2 - With LIMIT param:', result2.length, 'rows');

        // Test 3: The actual query from getRecentActivity
        const callsSql = `
      SELECT 
        'call' as type,
        l.id,
        l.fecha_llamada as created_at,
        p.nombre as entity_name,
        l.estado,
        l.proveedor_interesado,
        l.conversion_oferta
      FROM llamadas l
      JOIN proveedores p ON l.proveedor_id = p.id
      ORDER BY l.fecha_llamada DESC
      LIMIT ?
    `;

        const [result3] = await pool.execute(callsSql, [limit]);
        console.log('Test 3 - Actual query:', result3.length, 'rows');
        console.log('First row:', result3[0]);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('Code:', error.code);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testQuery();
