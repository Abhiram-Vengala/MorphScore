const TwitterApi = require('twitter-api-v2');

const client = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAH5StQEAAAAAhn8MUyHolc9wsbA%2F6koBwJ1%2BS1Q%3D47onR7sEUjVCWLUi7kAw4xL2ddQqUJlCVWV5BCmw842Vqb3S56');

app.get('/api/lookup-user', async (req, res) => {
  try {
    const username = req.query.username;

    const response = await client.v2.userByUsername(username);

    // Check for successful response
    if (response.data) {
      res.json({ user: response.data });
    } else {
      res.json({ user: null }); // User not found
    }
  } catch (error) {
    console.error('Error looking up user:', error);
    res.status(500).send('Error');
  }
});
