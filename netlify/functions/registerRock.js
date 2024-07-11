const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function(event, context) {
    const uuid = event.queryStringParameters.uuid;

    try {
        await client.connect();
        const database = client.db('rockdb');
        const rocks = database.collection('rocks');

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
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    } finally {
        await client.close();
    }
};
