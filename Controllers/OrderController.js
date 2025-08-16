const Order = require('../Models/Orders');
const Product = require('../Models/Product');
const createOrder = async (req, res) => {
    try {
        const { items, totalPrice } = req.body;
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `المنتج ${item.name} غير موجود` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ error: `المخزون غير كافي للمنتج ${item.name}` });
            }
        }
        //create order
        const newOrder = new Order({ items, totalPrice });
        await newOrder.save();
        for (let item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc:
                        { quantity: -item.quantity }
                }
            );
        }
        res.status(200).json({
            success: true,
            order: newOrder
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

};
const getOrdersInDay = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(500).json({
                message: "Date is required"
            });
        }
        const startDay = new Date(date);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(date);
        endDay.setHours(23, 59, 59, 999);
        const orders = await Order.find({
            createdAt: { $gte: startDay, $lte: endDay }
        });
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        return res.status(200).json({
            date,
            totalOrders: orders.length,
            totalSales,
            orders
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};
const getOrdersInMonth = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({ error: 'لازم تبعت year و month' });
        }
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const orders = await Order.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        res.json({
            totalOrders: orders.length,
            totalRevenue,
            orders
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'حصل خطأ في السيرفر' });
    }
};
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'الأوردر مش موجود' });
    }

    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { 
        $inc: { quantity: item.quantity } 
      });
    }

    await Order.findByIdAndDelete(id);

    res.json({ message: 'تم حذف الأوردر وتعديل المخزون بنجاح' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
};



module.exports = { createOrder, getOrdersInDay ,getOrdersInMonth,deleteOrder};
