async function registerRock(uuid) {
    try {
        const response = await fetch(`/.netlify/functions/registerRock?uuid=${uuid}`);
        const message = await response.text();
        document.getElementById('message').innerText = message;
    } catch (error) {
        document.getElementById('message').innerText = 'An error occurred while registering the rock.';
    }
}