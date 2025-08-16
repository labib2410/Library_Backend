const Product = require('../Models/Product');

const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: '✅ Product added successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to add product', details: error.message });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to fetch products' });
    }
};
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ quantity: { $lt: 4 } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to fetch low stock products' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: '🗑️ Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to delete product' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: '✅ Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to update product' });
    }
};
module.exports = { addProduct,deleteProduct,getAllProducts,updateProduct,getLowStockProducts };