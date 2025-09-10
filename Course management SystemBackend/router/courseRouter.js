const express = require('express');
const router = express.Router();
const { checkAdmin, checkAuth } = require('../middleware/checkAuth');
const { createCourse, getAllCourses, getCourseById, deleteCourse } = require('../controller/courseController');

// Admin: create course
router.post('/add', checkAdmin, createCourse);
// Admin: delete course
router.delete('/delete/:id', checkAdmin, deleteCourse);
// User: get all courses
router.get('/all', checkAuth, getAllCourses);
// User: get course by id
router.get('/:id', checkAuth, getCourseById);

module.exports = router;
