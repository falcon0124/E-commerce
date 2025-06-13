const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./server');
const path = require('path');

dotenv.config();

const app = express(); 
const port = process.env.PORT;

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static(path.resolve('./public')));


const authroute = require('./routes/auth');
const userRoute = require('./routes/user');
const pdtRoute = require('./routes/product');

app.use('/api/auth', authroute);
app.use('/api/user', userRoute);
app.use('/api/product', pdtRoute);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}).catch((err) => {
  console.error("DB connection failed", err);
});
