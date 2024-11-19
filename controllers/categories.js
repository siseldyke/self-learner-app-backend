const express = require('express')
const router = express.Router()
const Category = require('../models/category')

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


router.get('/:categoryId', async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId)
        if (!category) {
            return res.status(404).json({ error: 'Category not found' })
        }
        res.status(200).json(category)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router
