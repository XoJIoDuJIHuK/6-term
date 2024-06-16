const express = require('express');

const app = express();
const port = 3001;
// Define a route to handle POST requests
app.post('/oauth/callback', (req, res) => {
  // Extract data from the request body
  res.send('XD')
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
