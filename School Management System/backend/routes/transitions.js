const express = require('express')
const router = express.Router()

const fund = require('../models/fund')
const transition = require('../models/transition')
const students = require('../models/students')
const teacher = require('../models/teacher')
const admin = require('../models/admin')

const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware')
router.use(adminAuthMiddleware)


const schoolFundName = 'school'



/// update all students outstanding fee order by it's monthly fee
// update all teachers pending salary order by it's salary
// update all admins pending salary order by it's salary
router.put('/update-month', async (req, res) => {

    try {
        if (req.auth.position !== 'principal')
            return res.status(403).json('Without principal admin can not change month.')


        students.find((err, studs) => {
            if (err)
                throw 'Error'
            studs.forEach(stud => {
                stud.outstandingFees += stud.fees
                stud.save()
            })
        })

        teacher.find((err, techs) => {
            if (err)
                throw 'Error'
            techs.forEach(tech => {
                tech.pendingSalary += tech.salary
                tech.save()
            })
        })

        admin.find((err, adms) => {
            if (err)
                throw 'Error'
            adms.forEach(adm => {
                adm.pendingSalary += adm.salary
                adm.save()
            })
        })


        return res.json('new month updated.')

    } catch (e) {
        return res.status(500).json(e)
    }

})




/// recieve student fee by it's it 
router.post('/get-student-fee/:id', async (req, res) => {

    try {

        const stud = await students.findOne({ _id: req.params.id })
        const schoolFund = await fund.findOne({ name: schoolFundName })

        if (!schoolFund)
            return res.status(404).json('School Fund not found.')

        if (!stud)
            return res.status(404).json('Student not found.')


        if (req.body.total > stud.outstandingFees)
            return res.status(406).json('Money Overflow.')


        //Create a new transition
        const newTransition = await new transition({
            type: 'Student Fee',
            payerId: req.params.id,
            payerName: stud.name,
            amount: req.body.total
        })

        const newTrans = await newTransition.save()


        stud.outstandingFees -= newTrans.amount
        stud.transitions = [...stud.transitions, newTrans._id]


        schoolFund.total += newTrans.amount
        schoolFund.transitions = [...schoolFund.transitions, newTrans._id]


        await schoolFund.save()
        const savedStudent = await stud.save()

        // console.log(savedStudent)

        res.json({
            msg: `Payment recieved amount ${newTrans.amount}`,
            user: {

                _id: savedStudent._id,
                currentClass: savedStudent.currentClass,
                fees: savedStudent.fees,
                outstandingFees: savedStudent.outstandingFees
            }
        })

    } catch (e) {
        res.status(500).json(e)
    }
})


module.exports = router