const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./server');

dotenv.config();

const app = express(); 
const port = process.env.PORT;

app.use(express.json());

const authroute = require('./routes/auth');

app.use('/api/auth', authroute)

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}).catch((err) => {
  console.error("DB connection failed", err);
});
