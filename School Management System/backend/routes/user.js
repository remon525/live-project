const express = require('express')
const router = express.Router()

// middlewares
const studentAuthMiddleware = require('../middlewares/studentAuthMiddleware')
const teacherAuthMiddleware = require('../middlewares/teacherAuthMiddleware')
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware')
const userMiddleware = require('../middlewares/userMiddleware')

///
const admins = require('../models/admin')
const teachers = require('../models/teacher')
const students = require('../models/students')
const uniqueKey = require('../models/uniqueKey')
const admin = require('../models/admin')

// get student user information
router.get('/st-user', studentAuthMiddleware, (req, res) => {
    try {


        const { auth } = req

        const user = {
            type: 'Student',
            id: auth._id,
            name: auth.name,
            currentClass: auth.currentClass,
            dateOfBirth: auth.dateOfBirth,
            email: auth.email,
            fees: auth.fees,
        }

        res.json(user)
    }
    catch (e) {
        res.status(500).json(e)
    }

})

// get teacher information
router.get('/tech-user', teacherAuthMiddleware, (req, res) => {
    try {

        const { auth } = req

        const user = {
            type: 'Teacher',
            id: auth._id,
            name: auth.name,
            subject: auth.subject,
            dateOfBirth: auth.dateOfBirth,
            gender: auth.gender || 'Male',
            email: auth.email,
            salary: auth.salary,
        }

        res.json(user)

    } catch (e) {
        res.status(500).json(e)
    }

})

router.get('/admin-user', adminAuthMiddleware, (req, res) => {

    try {

        const { auth } = req

        const user = {
            type: 'Admin',
            id: auth._id,
            name: auth.name,
            position: auth.position,
            dateOfBirth: auth.dateOfBirth,
            gender: auth.gender || 'Male',
            email: auth.email,
            salary: auth.salary,
        }

        res.json(user)

    } catch (e) {
        res.status(500).json(e)
    }
})


// get total teachers
router.get('/teachers', userMiddleware, async (req, res) => {
    try {
        const totalTeachers = await teachers.find({}, {
            password: 0
        })
        return res.json(totalTeachers)

    } catch (e) {
        res.status(500).json(e)
    }
})

//get total admins
router.get('/admins', userMiddleware, async (req, res) => {
    try {
        const totalAdmins = await admins.find({}, {
            password: 0
        })
        return res.json(totalAdmins)
    } catch (e) {
        res.status(500).json(e)
    }
})

///
router.delete('/student/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await students.findByIdAndDelete(req.params.id, {
            password: 0
        }).exec()
        await uniqueKey.deleteOne({ email: result.email })
        res.json(result)

    } catch (e) {
        res.status(500).json(e)
    }
})

// delete a teacher by id when you are admin as principal
router.delete('/teachers/:id', adminAuthMiddleware, async (req, res) => {
    try {

        if (req.auth.possition !== 'principal')
            return res.status(403).json('forbidden')

        const result = await teachers.findByIdAndDelete(req.params.id, {
            password: 0
        }).exec()
        await uniqueKey.deleteOne({ email: result.email })
        res.json(result)

    } catch (e) {
        res.status(500).json(e)
    }
})




//get total student as an admin or a teacher

router.get('/total-students', userMiddleware, async (req, res) => {
    try {

        if (req.type === 'Student')
            return res.status(403).json('Forbidded')

        const result = await students.find({}, {
            password: 0
        })

        return res.json(result)

    } catch (e) {
        return res.status(500).json(e)
    }
})


/// get all student of a class
router.post('/class-students', userMiddleware, async (req, res) => {
    try {
        if (req.type === 'Student') {
            if (req.auth.currentClass !== req.body.className)
                return res.status(401).json('You cannot get data of other classes')
        }

        const result = await students.find({ currentClass: req.body.className }, {
            password: 0
        })

        return res.status(200).json(result)

    } catch (e) {
        return res.status(500).json(e)
    }
})





module.exports = router