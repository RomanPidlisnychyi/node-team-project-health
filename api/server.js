require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('combined'));

app.get('/', (req, res, next) => {
  console.log('All worked!');

  return res.status(200).json({ message: 'All worked!' });
});

app.listen(PORT, () => {
  console.log('server started listening on port', PORT);
});
