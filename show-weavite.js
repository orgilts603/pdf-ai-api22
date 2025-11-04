require("dotenv").config();
const weaviateLib = require("weaviate-client");


//Test33b1a4006C169407e81a429a36faf85b0

const WEAVIATE_HOST = process.env.WEAVIATE_HOST;
const WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY;


async function makeWeaviateClient() {
    console.time
    // The weaviate-client package exposes helper connectToWeaviateCloud in recent versions.
    // Fallback: instantiate raw client via weaviateLib.client({ scheme, host, apiKey: new ... })
    if (typeof weaviateLib.connectToWeaviateCloud === 'function') {
        const client = await weaviateLib.connectToWeaviateCloud(WEAVIATE_HOST, {
            authCredentials: new weaviateLib.ApiKey(WEAVIATE_API_KEY),
        });
        // optional: await client.connect() if required by client version
        return client;
    } else {
        // fallback manual client creation
        const client = weaviateLib.client({
            scheme: WEAVIATE_HOST.startsWith('https') ? 'https' : 'http',
            host: WEAVIATE_HOST.replace(/^https?:\/\//, ''),
            apiKey: new weaviateLib.ApiKey(WEAVIATE_API_KEY),
        });
        return client;
    }
}

/**
 * Collection-ий бүх өгөгдлийг харах функц
 */
async function showAllCollectionData(collectionName) {
    try {
        const client = await weaviateLib.connectToWeaviateCloud(WEAVIATE_HOST, {
            authCredentials: new weaviateLib.ApiKey(WEAVIATE_API_KEY),
        });

        console.log(`\n📚 Collection: ${collectionName}`);
        console.log('━'.repeat(80));

        // Get collection
        const collection = client.collections.get(collectionName);
        console.log(await collection.exists())
        // Query all objects with limit
        const result = await collection.query.fetchObjects({
            // limit: 100, // Хязгаар (илүү ихийг харахыг хүсвэл өөрчлөх)
            // returnMetadata: ['distance', 'score'],
        });

        console.log(`\n✅ Нийт олдсон: ${result.objects.length} objects\n`);

        // Бүх object-ийг харуулах
        result.objects.forEach((obj, index) => {
            console.log(`\n📄 Object ${index + 1}:`);
            console.log(`   UUID: ${obj.uuid}`);
            console.log(`   Properties:`);
            
            // Properties харуулах
            Object.entries(obj.properties).forEach(([key, value]) => {
                if (typeof value === 'string' && value.length > 200) {
                    console.log(`   • ${key}: ${value}...`);
                } else {
                    console.log(`   • ${key}:`, value);
                }
            });
            
            console.log('   ' + '─'.repeat(70));
        });

        // Summary statistics
        console.log(`\n📊 Нэгдсэн мэдээлэл:`);
        console.log(`   • Нийт объект: ${result.objects.length}`);
        
        if (result.objects.length > 0) {
            const sampleProps = result.objects[0].properties;
            console.log(`   • Properties: ${Object.keys(sampleProps).join(', ')}`);
        }

        console.log('\n' + '━'.repeat(80));

    } catch (error) {
        console.error('❌ Алдаа гарлаа:', error.message);
        if (error.message.includes('does not exist')) {
            console.log('\n💡 Collection олдсонгүй. Байгаа collection-уудыг харах:');
            await listAllCollections();
        }
    }
}

/**
 * Бүх collection-ийн жагсаалт харах
 */
async function listAllCollections() {
    try {
        const client = await weaviateLib.connectToWeaviateCloud(WEAVIATE_HOST, {
            authCredentials: new weaviateLib.ApiKey(WEAVIATE_API_KEY),
        });

        console.log('\n📋 Байгаа collection-ууд:');
        console.log('━'.repeat(80));

        const collections = await client.collections.listAll();
        
        if (collections && Object.keys(collections).length > 0) {
            Object.keys(collections).forEach((name, index) => {
                console.log(`${index + 1}. ${name}`);
            });
        } else {
            console.log('❌ Collection олдсонгүй');
        }

        console.log('━'.repeat(80));

    } catch (error) {
        console.error('❌ Алдаа гарлаа:', error.message);
    }
}

async function bootstrap() {
    // Ашиглах collection нэр
    const collectionName = "OrigurTestBookmarks14056f17c30cb457d8b73E952d3ce9d8d";
    
    console.log('🔍 Weaviate өгөгдлийг харах...\n');
    
    // Эхлээд бүх collection харах
    
    // Тодорхой collection-ий өгөгдөл харах
    await showAllCollectionData(collectionName);
}

bootstrap();