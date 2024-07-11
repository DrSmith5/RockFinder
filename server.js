const express = require('express');
const { Rock } = require('./database');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/rock/:uuid', async (req, res) => {
    const uuid = req.params.uuid;

    // Find the rock by UUID
    let rock = await Rock.findOne({ where: { uuid } });

    if (rock) {
        // Update the rock's status
        rock.found = true;
        rock.timestamp = new Date();
        await rock.save();
        
        res.send(`Rock with UUID ${uuid} has been registered as found!`);
    } else {
        res.status(404).send('Rock not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
