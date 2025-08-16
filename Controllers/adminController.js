const Order = require('../Models/Orders');

const ADMIN_USERNAME = "ELMOHANDES";
const ADMIN_PASSWORD = '01007474409';

const login = async (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({
            message: 'تم تسجيل الدخول بنجاح',
            name: ADMIN_USERNAME, success: true
        });
    } else {
        res.status(401).json({
            error: 'يوزر نيم أو باسوورد غلط',
            success: false
        });
    }
};
const dailyProfit = async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ message: "please provide date" });
    }
    try {
        const startDay = new Date(date);
        startDay.setHours(0, 0, 0, 0);
        const endDay = new Date(date);
        endDay.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: startDay, $lte: endDay }
        }).populate('items.productId');

        let totalSales = 0;
        let totalCost = 0;

        for (let order of orders) {
            for (let item of order.items) {
                if (!item.productId) continue;
                const purchasePrice = item.productId.purchasePrice;
                const salePrice = item.price;
                totalSales += salePrice * item.quantity;
                totalCost += purchasePrice * item.quantity;
            }
        }

        const totalProfit = totalSales - totalCost;

        return res.status(200).json({
            date,
            totalSales,
            totalCost,
            totalProfit
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const monthlyProfit = async (req, res) => {
    const { month, year } = req.query;
    if (!month || !year) {
        return res.status(400).json({ message: "please provide month and year" });
    }
    try {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate('items.productId');

        let totalSales = 0;
        let totalCost = 0;

        for (let order of orders) {
            for (let item of order.items) {
                if (!item.productId) continue;
                const purchasePrice = item.productId.purchasePrice;
                const salePrice = item.price;
                totalSales += salePrice * item.quantity;
                totalCost += purchasePrice * item.quantity;
            }
        }

        const totalProfit = totalSales - totalCost;

        return res.status(200).json({
            month,
            year,
            totalSales,
            totalCost,
            totalProfit
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    dailyProfit,
    monthlyProfit,
    login
}