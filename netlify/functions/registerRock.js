const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect(uri);

    const db = client.db('rockdb');

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

exports.handler = async function(event, context) {
    const uuid = event.queryStringParameters.uuid;

    try {
        const { db } = await connectToDatabase();
        const rocks = db.collection('rocks');

        const rock = await rocks.findOne({ uuid: uuid });

        if (rock) {
            await rocks.updateOne({ uuid: uuid }, { $set: { found: true, timestamp: new Date() } });
            return {
                statusCode: 200,
                body: `Rock with UUID ${uuid} has been registered as found!`
            };
        } else {
            return {
                statusCode: 404,
                body: 'Rock not found'
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
