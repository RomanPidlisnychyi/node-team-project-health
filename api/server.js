require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const calorieRouter = require('./routers/caloriesRouter');
const initDatabase = require('./helpers/initDatabase');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('combined'));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/calories', calorieRouter);

app.listen(PORT, async () => {
  await initDatabase();

  console.log('Server started listening on port', PORT);
});
