const weaviateLib = require('weaviate-client').default;

const WEAVIATE_HOST = 'bbfobgo4sfscmersxfo3uw.c0.asia-southeast1.gcp.weaviate.cloud';
const WEAVIATE_API_KEY = 'Rm9ZRkkxSWtmbkpTUWVqOV8xN1RrQUlJbFRFVkxML2c0aTUrNmR6bStsWnZKZ1lmbjA5Z2szODQxeVNzPV92MjAw';

async function testConnection() {
    try {
        console.log('🔍 Testing Weaviate connection...');
        console.log('Host:', WEAVIATE_HOST);
        console.log('API Key:', WEAVIATE_API_KEY.substring(0, 20) + '...');
        
        const client = await weaviateLib.connectToWeaviateCloud(WEAVIATE_HOST, {
            authCredentials: new weaviateLib.ApiKey(WEAVIATE_API_KEY),
        });
        
        console.log('✅ Connected to Weaviate!');
        
        // List collections
        const collections = await client.collections.listAll();
        console.log('📚 Current collections:', collections.length === 0 ? '(empty)' : collections.map(c => c.name).join(', '));
        
        // Try to create a test collection
        const testName = 'test_connection_' + Date.now();
        console.log(`\n🧪 Creating test collection: ${testName}`);
        
        await client.collections.create({
            name: testName,
            properties: [
                {
                    name: 'content',
                    dataType: 'text', // Changed from array to string
                    description: 'Test content'
                }
            ],
            vectorizer: 'none'
        });
        
        console.log(`✅ Successfully created collection: ${testName}`);
        
        // Verify it exists
        const exists = await client.collections.exists(testName);
        console.log(`✅ Collection exists: ${exists}`);
        
        // Delete test collection
        await client.collections.delete(testName);
        console.log(`✅ Deleted test collection: ${testName}`);
        
        console.log('\n🎉 All tests passed! Weaviate connection is working correctly.');
        
    } catch (error) {
        console.error('\n❌ Error occurred:');
        console.error('Message:', error.message);
        
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
            console.error('\n💡 Solution: API key is incorrect or expired. Generate a new one in Weaviate console.');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.error('\n💡 Solution: Host URL is incorrect. Check WEAVIATE_HOST in .env');
        } else if (error.message.includes('timeout')) {
            console.error('\n💡 Solution: Network timeout. Check internet connection or firewall.');
        }
        
        console.error('\nFull error object:');
        console.error(error);
    }
}

console.log('='.repeat(60));
console.log('  Weaviate Connection Test');
console.log('='.repeat(60));
testConnection();
