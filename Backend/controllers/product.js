const express = require('express');
const User = require('../models/user');
const Product = require('../models/product');
const multer = require('multer');
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); 
const upload = multer({ storage }); 

const createProduct = async (req, res) => {
  try {
    const { pdtName, pdtDescription, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const product = await Product.create({
      pdtName,
      pdtDescription,
      price: Number(price),
      category,
      imageUrl: req.file.path, 
      createdBy: req.user._id
    });

    res.status(200).json({ message: 'Product registered', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register product', error: err.message });
  }
};


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
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate('createdBy', 'fullName email');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "product found", product })

    } catch (err) {
        res.status(400).json({ message: "something went wrong" })
    }
}

async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);

        if (req.user._id.toString() === product.createdBy.toString()) {
            await Product.findByIdAndDelete(id);
            res.status(200).json({ message: 'deleted sucessfully' })
        } else {
            return res.status(200).json({ message: 'unautherized' })
        }
    } catch (err) {
        res.status(400).json({ message: "error deleting" });
    }
}

async function searchProduct(req, res) {
    const { name } = req.query;
    try {
        const item = await Product.find({
            pdtName: { $regex: name, $options: 'i' }
        });

        if (item.length === 0) {
            return res.status(200).json({ message: 'product not found' })
        }
        return res.status(200).json({ message: `${item.length} item(s) found similar to ${name}`, item });

    } catch (err) {
        return res.status(400).json({ message: 'An error occured' });

    }
}

async function getProductByCategory(req, res) {
    const category = req.params.category;

    try {
        const item = await Product.find({
            category: { $regex: new RegExp(`^${category}$`, 'i') }
        });

        if (item.length === 0) {
            return res.status(200).json({ message: 'product not found' })
        }
        return res.status(200).json({ message: `${item.length} item(s) found in ${category} category`, item });
    } catch (err) {
        return res.status(400).json({ message: 'An error occured' });

    }
}
module.exports = { createProduct, upload, userProduct, getAllProducts, getSingleProduct, deleteProduct, searchProduct, getProductByCategory };
