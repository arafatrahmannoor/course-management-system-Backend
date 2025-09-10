const Purchase = require('../model/purchase');
const Course = require('../model/courseModel');

// Purchase a course
exports.purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const purchase = new Purchase({
            userId: req.user._id,
            courseId: course._id,
            amount: course.price,
            date: new Date()
        });
        await purchase.save();
        res.status(201).json(purchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all purchased courses for a user
exports.getUserPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({ userId: req.user._id }).populate('courseId');
        res.json(purchases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
