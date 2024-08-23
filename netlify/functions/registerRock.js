const { MongoClient } = require("mongodb");

exports.handler = async function(event, context) {
    const uuid = event.queryStringParameters.uuid;

    if (!uuid) {
        return {
            statusCode: 400,
            body: 'UUID not provided.'
        };
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('rockdb');
        const rocks = database.collection('rocks');

        // Find the rock with the given UUID
        const query = { uuid: uuid };
        const rock = await rocks.findOne(query);

        if (rock) {
            // Set the class name based on the updated status
            const className = 'found';

            return {
                statusCode: 200,
                body: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link href="/styling.css" rel="stylesheet">
                        <title>RockFinder</title>
                        <link rel="icon" type="image/x-icon" href="/images/Website/Icon.png">
                    </head>
                    <body>
                        <div id="header" class="center">
                            <h1>Secret Stones</h1>
                        </div>
                    
                        <div class="rock" id="bunny-rock">
                            <h3 id="is-bunny-found" class="${className}">Found!</h3>
                            <img id="bunny-img" class="rock-img" src="/images/Stones/Bunny.jpg">
                        </div>
                    
                        <script>
                            // Update the class of the rock element dynamically
                            document.getElementById('is-bunny-found').className = '${className}';
                        </script>
                    </body>
                    </html>
                `,
                headers: {
                    'Content-Type': 'text/html'
                }
            };
        } else {
            return {
                statusCode: 404,
                body: 'Rock not found.'
            };
        }
    } catch (error) {
        console.error("Error handling QR code scan:", error);
        return {
            statusCode: 500,
            body: 'An error occurred while processing your request.'
        };
    } finally {
        await client.close();
    }
};
