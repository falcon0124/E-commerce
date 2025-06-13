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

async function userProduct(req, res) {
    const userId = req.user._id;
    try {
        const products = await Product.find({ createdBy: userId });

        if (products.length === 0) {
            return res.status(200).json({ message: "NO products" });
        }
        res.status(200).json({ message: "found your products", products });
    } catch (err) {
        res.status(404).json({ message: "Problem fetching" });
    }
}

async function getAllProducts(req, res) {
    try {
        const allProducts = await Product.find({})
            .populate('createdBy', 'fullName email');

        if (allProducts.length === 0) {
            return res.status(200).json({ message: 'no products to display' })
        }
        res.status(200).json({ message: `Found ${allProducts.length} products`, allProducts });
    } catch (err) {
        res.status(400).json({ message: 'error getting products' });

    }
}

async function getSingleProduct(req, res) {
    const {id} = req.params;
    try{
        const product = await Product.findById(id).populate('createdBy', 'fullName email');

        if(!product){
            return res.status(200).json({message: "product not found"})
        }
        res.status(200).json({message: "product found", product})

    }catch(err){
        res.status(400).json({message: "something went wrong"})
    }
}
module.exports = { createProduct, upload, userProduct, getAllProducts, getSingleProduct };
