import TryCatch from "../middlewares/trycatch.js";
import User from "../models/User.js";
export const checkOut = TryCatch(async (req, res) => {
    const user_id = req.user?._id;
    if (!user_id) {
        return res.status(400).json({
            message: "No User Id",
        });
    }
    const { duration } = req.body;
    let amount;
    if (duration === 1) {
        amount = 299;
    }
    else {
        amount = 1499;
    }
    const fakeOrder = {
        id: "demo_order_" + Date.now(),
        amount,
        currency: "INR",
        duration,
        status: "created",
    };
    res.status(201).json({
        message: "Demo checkout created",
        order: fakeOrder,
    });
});
export const paymentVerification = TryCatch(async (req, res) => {
    const user = req.user;
    const { duration } = req.body;
    const now = new Date();
    let expiryDate;
    if (duration === 1) {
        expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    else {
        expiryDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    }
    const updatedUser = await User.findByIdAndUpdate(user?._id, { subscription: expiryDate }, { new: true });
    res.json({
        success: true,
        message: "Payment Successful (Demo Mode)",
        updatedUser,
    });
});
