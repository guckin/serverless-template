test('GET /hello-world', async () => {
    const response = await fetch(`https://${process.env.STAGE}.api.helpfl.click/hello-world`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(data).toEqual({hello: 'world'});
});
