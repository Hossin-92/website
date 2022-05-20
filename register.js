const validate = require('validate.js')
const _ = require('lodash')
const { registerClient, registerClientContinue, registerEuClientFromScToEu } = require('../services/registerClient.service')

/* const registerClientRoute = async (req, res) => {
  const data = {}
  await registerClient(req, res)
} */

module.exports = function (app) {
  // registerClientRoute,
  app.use(function (req, res, next) {
    next()
  })

  app.post('/register', registerClient)

  app.post('/register/continue', registerClientContinue)
  app.post('/register/registerEuClientFromScToEu', registerEuClientFromScToEu)
}
