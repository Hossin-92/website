const validate = require('validate.js')
const _ = require('lodash')
const { openDemoAccount } = require('../services')

const openDemoAccountEURoute = async (req, res) => {
  // Validate Request
  const constraints = {
    firstName: {
      presence: true,
    },
    lastName: {
      presence: true,
    },
    email: {
      presence: true,
    },
    country: {
      presence: true,
    },
    phone: {
      presence: true,
    },
    platform: {
      presence: true,
      inclusion: ['MT4', 'MT5'],
    },
    leverage: {
      presence: true,
    },
    currency: {
      presence: true,
    },
  }

  const v = validate(req.body, constraints)
  if (v) {
    return res.status(400).json(v)
  }

  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const phonePrefix = req.body.phonePrefix
  const phone = req.body.phone
  const address = req.body.address
  const leverage = req.body.leverage
  const currency = req.body.currency
  const platform = req.body.platform

  const data = {
    first_name: firstName,
    last_name: lastName,
    email: _.trim(email),
    phone_prefix: _.trim(phonePrefix),
    phone_work: _.trim(phone),
    primary_address_country: address,
    leverage_c: leverage,
    base_currency_c: currency,
    platform_c: platform,
  }

  await openDemoAccount(res, data)
}

module.exports = { openDemoAccountEURoute }
