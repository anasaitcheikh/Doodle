const express = require('express')
const api = express.Router()
const openController = require('./controller/openController')
const closeController = require('./controller/closeController')

// middleware that is specific to this api
api.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

api.use('/open', openController)

api.use('/close', closeController)

module.exports = api