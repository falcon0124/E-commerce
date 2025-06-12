const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./server');

dotenv.config();

const app = express(); 
const port = process.env.PORT;

app.use(express.json());

const authroute = require('./routes/auth');
const userRoute = require('./routes/user');

app.use('/api/auth', authroute)
app.use('/api/user', userRoute);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}).catch((err) => {
  console.error("DB connection failed", err);
});
