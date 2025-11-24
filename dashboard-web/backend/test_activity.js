require('dotenv').config();
const { getRecentActivity } = require('./src/services/analytics_service');

async function test() {
    try {
        console.log('Testing getRecentActivity...');
        const result = await getRecentActivity(5);
        console.log('SUCCESS:', JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

test();
