test('GET /hello-world', async () => {
    const token = await getAuthToken();
    const response = await fetch(`https://${process.env.STAGE}.api.helpfl.click/hello-world`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(data).toEqual({hello: 'world'});
});

async function getAuthToken() {
    const response = await fetch('https://dev--isxkzf0.auth0.com/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            audience: 'https://api.helpfl.click',
            grant_type: 'client_credentials'
        })
    });
    const {access_token} = await response.json();
    return access_token;
}
