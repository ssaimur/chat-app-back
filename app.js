const express = require('express');
const app = express();

const port = process.env.PORT || 4000;

app.get('/', (req, res, next) => {
  res.json({ success: true, message: 'the server is running' });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
