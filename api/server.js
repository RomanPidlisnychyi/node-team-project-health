require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('./routers/userRouter');
const {connect} = require('./helpers/dataBase');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('combined'));

app.use('/users', userRouter);
connect();

app.listen(PORT, () => {
  console.log('server started listening on port', PORT);
});
