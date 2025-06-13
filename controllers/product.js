const express = require('express');
const User = require('../models/user');
const Product = require('../models/product');
const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads'));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

async function createProduct(req, res) {
  try {
    const { pdtName, pdtDescription, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const product = await Product.create({
      pdtName,
      pdtDescription,
      price: Number(price),
      imageUrl: `uploads/${req.file.filename}`,
      createdBy: req.user._id
    });

    res.status(200).json({ message: 'Product registered', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register product', error: err.message });
  }
}

module.exports = { createProduct, upload };
