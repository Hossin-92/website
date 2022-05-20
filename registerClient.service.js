const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const axios = require('axios').default
const _ = require('lodash')
const Cookies = require('cookies')
const CRED = require('../credentials')
const config = require('../../nuxt.config')

const euList = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CH',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
]

const blackList = ['BZ', 'CA', 'IL', 'IR', 'KP', 'KR', 'US']

const registerClient = async (req, res) => {
  // eslint-disable-next-line no-console
  /* consola.log('HERE: registerClient')
  return res.json({
    success: false,
    message: 'HERE all required fields are valid',
  }) */
  const cookies = new Cookies(req, res, {
    keys: ['lid', 'i18n_redirected', 'pid'],
  })

  const refererUrl = req.headers.referer
  const utmParams = req.body.utmParams
  const url = new URL(refererUrl)
  // const url = new URL('https://www.squaredfinancial.cn/register')
  // const testurl = new URL('https://www.squaredfinancial.cn/register')

  // let tldParts = testurl.hostname.split('.')
  // let tld = tldParts[tldParts.length-1]

  // console.log('tld', tld)

  const formData = req.body.form
  const _crmType = req.body.crm
  // const campaign = req.body.campaign
  let receiveMarketingEmails = req.body.receiveMarketingEmails

  const clientType = formData.clientType
  let firstName = formData.firstName
  let lastName = formData.lastName ? formData.lastName : ''

  if (formData.lastName) {
    lastName = formData.lastName
  } else if (clientType === 'Individual') {
    lastName = firstName.split(' ').slice(1).join(' ')

    firstName = firstName.split(' ')[0]
    if (lastName.length === 0) {
      lastName = '-'
    }
  } else if (clientType === 'Corporate') {
    if (lastName.length === 0) {
      lastName = '-'
    }
  }

  const email = formData.email
  const password = formData.password ? formData.password : ''
  const country = formData.country ? formData.country : formData.phoneNumber.countryCode ? formData.phoneNumber.countryCode : '-'
  const language = formData.language // cookies.get('i18n_redirected')
  const phoneNumber = _.replace(formData.phoneNumber.number, /\s/g, '')
  const phoneCode = _.replace(formData.phoneNumber.dialCode, /\s/g, '')
  const ageCheck = formData.ageCheck
  const managerId = formData.managerId
  // const referralLinkId = formData.referrer
  const subToMailChimpList = formData.subToMailChimpList
  const crmTag = formData.crmTag
  const isWorkshop = formData.isWorkshop || false

  const marketingLinkId = cookies.get('mlid')
  const referralLinkId = formData.referrer || cookies.get('lid')
  const partnerId = formData.partnerId || cookies.get('pid')

  /* if (url.pathname === '/trade-now') {
    formData.lastName = '-'
    if (!firstName || !email || !phoneNumber || !password) {
      return res.json({
        success: false,
        message: 'Not all required fields are valid 22',
      })
    }
  } else if (url.pathname === '/10000plus-instruments') {
    formData.lastName = '-'
    if (!firstName || !email || !phoneNumber || !country) {
      return res.json({
        success: false,
        message: 'Not all required fields are valid',
      })
    }
  } else */

  if (!firstName || !email || !phoneNumber || !password) {
    return res.json({
      success: false,
      message: 'Not all required fields are valid',
    })
  }

  const tags = []

  if (crmTag) {
    tags.push(crmTag)
  }

  let isLead =
    _crmType === 'fxbeu' ? !euList.includes(country.toUpperCase()) : _crmType === 'fxbsc' ? !!euList.includes(country.toUpperCase()) : true

  if (blackList.includes(country.toUpperCase())) {
    tags.push('blacklist_country')
    receiveMarketingEmails = 'no'
    isLead = true
    // empty(tags)
  }

  if (_crmType === 'fxbsc' && euList.includes(country.toUpperCase())) {
    tags.push('Client Website Disclaimer Declined')
    // empty(tags)
  }

  if (_crmType === 'fxbeu' && !euList.includes(country.toUpperCase())) {
    // empty(tags)
  }

  const _data = {
    clientType,
    firstName,
    lastName,
    country,
    email,
    password,
    phone: `${phoneCode + phoneNumber}`,
    referralLinkId,
    lead: isLead,
    managerId: managerId || null,
    // sendWelcomeEmail: true,
    referrer: refererUrl,
    tags,
    isWorkshop,
    utmParams: utmParams || false,
    receiveMarketingEmails,
    // subToMailChimpList,
    customFields: {
      custom_receive_marketing_emails: receiveMarketingEmails === 'yes' ? 'Yes' : 'No',
    },
    language,
  }

  if (marketingLinkId) {
    _data.marketingLinkId = marketingLinkId
  }
  if (referralLinkId && _.isNumber(_.toInteger(referralLinkId))) {
    _data.referralLinkId = referralLinkId
  }
  if (partnerId) {
    _data.partnerId = partnerId
  }
  // consola.log('_data', _data)
  // consola.log('_crmType', _crmType)
  /* return res.json({
    success: false,
    message: 'Testing',
  }) */
  await registerFXB(res, _data, _crmType, url)
}

const registerFXB = async function (res, data, crm, url, isInvalidRegion = 0) {
  // console.log('START registerFXB')
  if (crm === 'fxbeu' && !euList.includes(data.country.toUpperCase()) && !blackList.includes(data.country.toUpperCase())) {
    crm = 'fxbsc'
    isInvalidRegion = 1
  }
  // console.log('crm', crm, 'isInvalidRegion', isInvalidRegion)

  const apiBaseUrl = crm === 'fxbeu' ? 'https://portal-eu.squaredfinancial.com/rest/' : 'https://portal-sc.squaredfinancial.com/rest/'
  // console.log('apiBaseUrl', apiBaseUrl, 'isInvalidRegion', isInvalidRegion)
  const apiUrl =
    crm === 'fxbeu'
      ? 'https://portal-eu.squaredfinancial.com/rest/users/new?version=1.0.0'
      : 'https://portal-sc.squaredfinancial.com/rest/users/new?version=1.0.0'
  // console.log('apiUrl', apiUrl, 'isInvalidRegion', isInvalidRegion)
  const acceptDocuments = crm === 'fxbeu' ? ['69'] : ['68']
  // const acceptDocuments = crm === 'fxbeu' ? ['11', '12', '13', '29', '30', '31', '32', '39', '50', '51'] : ['2', '3', '4', '56']
  /* const acceptDocuments =
      crm === 'fxbeu'
        ? [11,12,13,29,30,31,32,39,50,51]
        : [2,3,4] */
  // consola.log('registerFXB data', data)
  // consola.log('registerFXB apiUrl', apiUrl)

  await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      Authorization: CRED.FXB_AUTH_TOKEN,
      'Content-Type': 'application/json',
    },
    data,
  })
    .then(function (response) {
      // consola.log('registerFXB response SUCCESS')
      // consola.log('registerFXB response', response)

      if (response.status === 200) {
        // consola.log('registerFXB response.data', response.data)
        if (data.receiveMarketingEmails === 'yes') {
          const defaultList = 'b5fc7e6238'
          const arabicList = '1dbfca9bd4'

          addToMailchimp(
            data.firstName,
            data.lastName,
            data.email,
            data.phone,
            data.language === 'ar' || data.country === 'SA' ? arabicList : defaultList
          )
        }
        if (typeof data.subToMailChimpList !== 'undefined') {
          addToMailchimp(data.firstName, data.lastName, data.email, data.phone, data.subToMailChimpList)
        }

        // accept legal agreements
        // consola.log('acceptDocuments', acceptDocuments)

        if (
          (isInvalidRegion === 0 &&
            !blackList.includes(data.country.toUpperCase()) &&
            crm === 'fxbeu' &&
            euList.includes(data.country.toUpperCase())) ||
          (crm === 'fxbsc' && !euList.includes(data.country.toUpperCase()))
        ) {
          // console.log('registerFXB isInvalidRegion 0')
          callbackCreateAccount(res, response.data, crm, apiBaseUrl, data, url)
            .then(function (response) {})
            .catch(function (error) {})
          callbackFXBAcceptDocuments(res, crm, apiBaseUrl, response.data.id, acceptDocuments)
            .then(function (response) {})
            .catch(function (error) {})

          // eslint-disable-next-line no-console
          const urlParams = new URLSearchParams(data.referrer)
          const utm_source = urlParams.get('utm_source')

          if (utm_source) {
            if (utm_source === 'investing') {
              const afp = urlParams.get('afp')
              if (afp) {
                if (afp.length) {
                  // consola.log('utm_source callbackFBXGeneral HERE')
                  callbackInvesting(res, response.data.id, afp)
                  return callbackFBXGeneral(res, crm, apiBaseUrl, response.data.id, data, url, response.data)
                }
              }
            }
          }

          // if (url.pathname === '/trade-now') {
          // consola.log('/trade-now = callbackFBXGeneral HERE')
          return callbackFBXGeneral(res, crm, apiBaseUrl, response.data.id, data, url, response.data)
        }

        if (
          isInvalidRegion === 1 ||
          (crm === 'fxbsc' && euList.includes(data.country.toUpperCase())) ||
          (crm === 'fxbeu' && !euList.includes(data.country.toUpperCase())) ||
          blackList.includes(data.country.toUpperCase())
        ) {
          // console.log('registerFXB isInvalidRegion 1')
          const acceptDocumentsInvalidRegion = crm === 'fxbeu' ? ['69'] : ['68']

          if (!blackList.includes(data.country.toUpperCase())) {
            // console.log('callbackFXBAcceptDocuments')
            callbackFXBAcceptDocuments(res, crm, apiBaseUrl, response.data.id, acceptDocumentsInvalidRegion)
              .then(function (response) {
                // console.log('callbackFXBAcceptDocuments SUCCESS')
              })
              .catch(function (error) {})
          }

          // console.log('registerFXB isInvalidRegion 2', response.data, data, crm, url, 1)
          // console.log('registerFXB isInvalidRegion 22222')
          // crm = crm === 'fxbeu' ? 'fxbsc' : 'fxbeu'
          // response.data.crm = crm === 'fxbeu' ? 'fxbsc' : 'fxbeu'
          return res.json({
            success: true,
            isInvalidRegion: true,
            formData: data,
            responseData: response.data,
            crm,
            apiBaseUrl,
            data,
            url,
            message: 'Account created under different entity',
          })
        }

        // }

        // sendVerifyEmail(response.data.id, crm)
        return res.json({ success: true })
      } else {
        return res.json({
          success: false,
          message: 'We apologize. Something went wrong. registerFXB',
        })
      }
    })
    .catch(function (error) {
      // console.log(error)
      // consola.log('registerFXB error', error)
      // consola.log('registerFXB error')
      if (typeof error.response !== 'undefined') {
        // consola.log('registerFXB error 2')
        let errors = error.response.data.errors

        if (error.response.data.errors.children) {
          errors = error.response.data.errors.children
        }

        // if is workshop and email exists and is the only error send welcome email
        if (data.isWorkshop) {
          let errorsText = ''
          Object.keys(errors).forEach(function (keyA) {
            if (typeof errors[keyA].errors !== 'undefined') {
              Object.keys(errors[keyA].errors).forEach(function (keyB) {
                errorsText += `${errors[keyA].errors[keyB]}`
              })
            }
          })

          if (errorsText === 'This email is already registered') {
            return res.json({
              success: true,
            })
          } else {
            // consola.log('registerFXB error 4')
            return res.json({
              success: false,
              errors,
            })
          }
        } else {
          // consola.log('registerFXB error 3')
          // consola.log('registerFXB error 3', errors)
          return res.json({
            success: false,
            errors,
          })
        }
        // consola.log('registerFXB ERROR', error.response.data.errors.children)
        if (!_.isEmpty(error.response.data.errors.children.country) && isInvalidRegion === 0) {
          if (
            (crm === 'fxbsc' && euList.includes(data.country.toUpperCase())) ||
            (crm === 'fxbeu' && !euList.includes(data.country.toUpperCase()))
          ) {
            // console.log('registerFXB Wrong Country exception')

            if (crm === 'fxbsc' && euList.includes(data.country.toUpperCase())) {
              // console.log('registerFXB: website SC -  Country EU')
            }

            if (crm === 'fxbeu' && !euList.includes(data.country.toUpperCase())) {
              // console.log('registerFXB: website EU -  Country SC')
            }

            crm = crm === 'fxbeu' ? 'fxbsc' : 'fxbeu'
            // console.log('registerFXB isInvalidRegion 1')
            registerFXB(res, data, crm, url, 1)
          }
        } else {
          // console.log('fxb errors', error)
          return res.json({
            success: false,
            errors,
          })
        }
        return res.json({
          success: false,
          errors,
        })
      } else {
        return res.json({
          success: false,
          error,
        })
      }
    })
}

const callbackInvesting = async function (res, user_id, afp) {
  const apiUrl =
    'https://us-central1-madrid-investing.cloudfunctions.net/PostbackCloudFunciton/?token=YWR2ZXJpc2VyX2FmZmlsYXRpb25fdXJs&advertiser=Squared%20Financial&brand=Squared%20Financial&model=CPL&affiliate_id=16542&offer_id=&user_id=' +
    user_id +
    '&event_type=Lead&subID=' +
    afp
  await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      Authorization: 'YWR2ZXJpc2VyX2FmZmlsYXRpb25fdXJs',
      'Content-Type': 'application/json',
    },
    data: { user_id, subID: afp },
  })
    .then(function (response) {})
    .catch(function (error) {
      return res.json({
        success: false,
        message: 'We apologize. Something went wrong. callbackInvesting',
      })
    })
}

const callbackFBXGeneral = async function (res, crm, apiBaseUrl, user_id, data, url, responseData) {
  /* callbackUpdate(res, crm, apiBaseUrl, user_id)
      .then(function(result) {})
      .catch(function() {}) */
  // consola.log('callbackFBXGeneral SUCCESS')
  // callbackCovertToLead(res, crm, apiBaseUrl, user_id)
  callbackDirectLogin(res, crm, apiBaseUrl, user_id, data, url, responseData)
    .then(function (result) {})
    .catch(function () {})
}

const callbackDirectLogin = async function (res, crm, apiBaseUrl, user_id, data, url, responseData) {
  const tldParts = url.hostname.split('.')
  const tld = tldParts[tldParts.length - 1]

  const dataSent = {
    user: user_id,
    locale: data.language,
    logoutUrl:
      'https://' +
      (crm === 'fxbeu' ? 'www' : 'sc') +
      '.' +
      'squaredfinancial.' +
      (data.language === 'zh' || tld === 'cn' ? 'cn/' : 'com/') +
      (data.language !== 'en' ? data.language + '/' : '') +
      'login',
  }

  // console.log('dataSent', dataSent)
  /* console.log(
    'register/callbackDirectLogin : logoutUrl',
    'https://' +
      (crm === 'fxbeu' ? 'www' : 'sc') +
      '.' +
      'squaredfinancial.' +
      (data.language === 'zh' || tld === 'cn' ? 'cn/' : 'com/') +
      (data.language !== 'en' ? data.language + '/' : '') +
      'login'
  ) */
  await axios({
    method: 'post',
    url: apiBaseUrl + 'user/direct_login?version=1.0.0',
    headers: {
      Authorization: CRED.FXB_AUTH_TOKEN,
      'Content-Type': 'application/json',
    },
    data: {
      user: user_id,
      locale: data.language,
      logoutUrl:
        'https://' +
        (crm === 'fxbeu' ? 'www' : 'sc') +
        '.' +
        'squaredfinancial.' +
        (data.language === 'zh' || tld === 'cn' ? 'cn/' : 'com/') +
        (data.language !== 'en' ? data.language + '/' : '') +
        'login',
    },
  })
    .then(function (response) {
      // console.log('callbackDirectLogin response.data.url:', response.data.url)
      // sendVerifyEmail(user_id, crm)
      // consola.log('callbackDirectLogin SUCCESS', data.language === 'zh' ? response.data.url.replace('.com', '.cn') : response.data.url)
      return res.json({
        success: true,
        url: data.language === 'zh' ? response.data.url.replace('.com', '.cn') : response.data.url,
        crm,
        responseData,
      })
    })
    .catch(function (error) {
      // console.log('error callbackDirectLogin', error)
      return res.json({
        success: false,
        message: 'We apologize. Something went wrong. callbackDirectLogin',
      })
    })
}

const callbackCreateAccount = async function (res, responseData, crm, apiBaseUrl, data, url, readonly = false) {
  const tldParts = url.hostname.split('.')
  const tld = tldParts[tldParts.length - 1]

  // console.log('callbackCreateAccount euList', euList)
  // console.log('callbackCreateAccount url', url)
  // console.log('callbackCreateAccount url.searchParams', url.searchParams)

  if (url.searchParams.has('lid') && url.searchParams.has('pid')) {
    // console.log('SUCCESS: No Account required', url.searchParams.has('lid'), url.searchParams.has('pid'))
    return {
      success: true,
      message: 'No Account required',
    }
  }

  const accountType = crm === 'fxbeu' ? (tld === 'cn' ? '250' : '245') : tld === 'cn' ? '240' : '242'
  const leverage = crm === 'fxbeu' ? '30' : '500'

  // console.log('apiBaseUrl apiBaseUrl', apiBaseUrl)
  // console.log('callbackCreateAccount crm', crm)
  // console.log('callbackCreateAccount accountType', accountType)

  let currency = 'USD'

  if (responseData.country === 'GB') {
    currency = 'GBP'
  } else if (euList.includes(responseData.country)) {
    currency = 'EUR'
  }

  if (tld === 'cn') {
    currency = 'USD'
  }

  const myObj = {
    user: responseData.id,
    accountType,
    currency,
    leverage,
    initialBalance: 0,
    notifyDisable: false,
    readOnly: readonly || crm === 'fxbeu',
    password: data.password,
  }

  // consola.log('callbackCreateAccount data', myObj)

  await axios({
    method: 'post',
    url: apiBaseUrl + 'squared/accounts/new?version=1.0.0',
    headers: {
      Authorization: CRED.FXB_AUTH_TOKEN,
      'Content-Type': 'application/json',
    },
    data: {
      user: responseData.id,
      accountType,
      currency,
      leverage,
      initialBalance: 0,
      notifyDisable: false,
      readOnly: readonly || crm === 'fxbeu',
      password: data.password,
    },
  })
    .then(function (response) {
      // console.log('callbackCreateAccount SUCCESS data',response.data)
    })
    .catch(function (error) {
      // consola.log('callbackCreateAccount FAIL error', JSON.stringify(error))
      // consola.log('callbackCreateAccount FAIL error')
      /* return res.json({
        success: false,
        message: 'We apologize. Something went wrong. callbackCreateAccount: ' + JSON.stringify(error),
      }) */
      return res.json({
        success: false,
        message: 'We apologize. Something went wrong. callbackCreateAccount',
      })
    })
}

const callbackFXBAcceptDocuments = async function (res, crm, apiBaseUrl, user_id, acceptDocuments) {
  // consola.log('data sent',{user: user_id, companyDocuments: acceptDocuments })
  await axios({
    method: 'post',
    url: apiBaseUrl + 'user/company-documents/accept-batch?version=1.0.0',
    headers: {
      Authorization: CRED.FXB_AUTH_TOKEN,
      'Content-Type': 'application/json',
    },
    data: {
      user: user_id,
      companyDocuments: acceptDocuments,
    },
  })
    .then(function (response) {
      // consola.log('callbackFXBAcceptDocuments SUCCESS')
      // consola.log('callbackFXBAcceptDocuments result',response.data)
    })
    .catch(function (error) {
      consola.log('error callbackFXBAcceptDocuments', error)
      return res.json({
        success: false,
        message: 'We apologize. Something went wrong. callbackFXBAcceptDocuments',
      })
    })
}

const addToMailchimp = function (firstName, lastName, email, phone, list = null) {
  // const API_KEY = CRED.MAILCHIMP.API_KEY_SC
  const defaultListId = 'b5fc7e6238'
  const listId = list || defaultListId

  axios({
    method: 'post',
    url: `https://us4.api.mailchimp.com/3.0/lists/${listId}/members`,
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: 'username', // Accepts any string
      password: CRED.MAILCHIMP.API_KEY_SC,
    },
    data: {
      email_address: email,
      status: 'subscribed',
      merge_fields: { FNAME: firstName, LNAME: lastName, PHONE: phone },
    },
  }).catch(function (error) {
    // eslint-disable-next-line no-console
    // console.log(error)
  })
  return true
}

const registerClientContinue = async (req, res) => {
  const data = req.body.data
  const registerData = req.body.registerData
  // console.log('req.body', req.body)

  // console.log('registerClientContinue data 111', data)
  // console.log('registerClientContinue registerData 111', registerData)
  // console.log('registerData.crm', registerData.crm)
  // console.log('data.country', data.country)

  // registerData.url = new URL(registerData.url)
  registerData.url = new URL('https://www.squaredfinancial.com/')

  if (registerData.crm === 'fxbsc' && euList.includes(data.country.toUpperCase())) {
    // console.log('registerData.crm === fxbsc Client EU')
    const userData = {}
    userData.user = registerData.responseData.id
    userData.lead = false
    userData.tags = []
    registerData.responseData.user = registerData.responseData.id
    registerData.responseData.lead = false
    registerData.responseData.tags = []

    // console.log('CONTINUE fxbsc EU country : userData', userData)
    // console.log('CONTINUE fxbsc EU country : registerData.responseData', registerData.responseData)

    const apiUrl =
      registerData.crm === 'fxbeu' ? 'https://portal-eu.squaredfinancial.com/rest/' : 'https://portal-sc.squaredfinancial.com/rest/'
    await axios({
      method: 'post',
      url: apiUrl + 'users/update?version=1.0.0',
      headers: {
        Authorization: CRED.FXB_AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
      data: {
        user: registerData.responseData.id,
        tags: ['Client Website Disclaimer Accepted'],
        lead: true,
      },
    })
      .then(function (response) {
        // console.log('users/update SUCCESS', response)
        // console.log('users/update NEXT')
        // console.log('users/update NEXT', { user: registerData.responseData.id, lead: false })

        axios({
          method: 'post',
          url: apiUrl + 'convert_lead_to_client?version=1.0.0',
          headers: {
            Authorization: CRED.FXB_AUTH_TOKEN,
            'Content-Type': 'application/json',
          },
          data: {
            ids: [registerData.responseData.id],
            sendWelcomeEmail: true,
          },
        })
          .then(function (response) {
            // console.log('convert_lead_to_client response', response)

            const testArr = {
              'registerData.responseData': registerData.responseData,
              'registerData.crm': registerData.crm,
              'registerData.apiBaseUrl': registerData.apiBaseUrl,
              'registerData.data': registerData.data,
              'registerData.url': registerData.url,
              true: true,
            }

            // console.log('callbackCreateAccount testArr', testArr)

            return callbackCreateAccount(
              res,
              registerData.responseData,
              registerData.crm,
              registerData.apiBaseUrl,
              registerData.data,
              registerData.url,
              true
            )
              .then(function (response) {
                // console.log('callbackCreateAccount')
                return callbackDirectLogin(
                  res,
                  registerData.crm,
                  registerData.apiBaseUrl,
                  registerData.responseData.id,
                  registerData.data,
                  registerData.url,
                  registerData.responseData
                )
                  .then(function (result) {
                    // console.log('callbackDirectLogin')
                    return result
                  })
                  .catch(function () {
                    // eslint-disable-next-line no-console
                    // console.log(error)
                  })
              })
              .catch(function (error) {
                // eslint-disable-next-line no-console
                // console.log(error)
              })
          })
          .catch(function (error) {
            // eslint-disable-next-line no-console
            // console.log('GET USER FAILED')
            // eslint-disable-next-line no-console
            // console.log(error)
          })
      })
      .catch(function (error) {
        // eslint-disable-next-line no-console
        // console.log(error)
      })
  }

  // registerData.crm = 'fxbeu'

  // console.log('registerData.crm 22', registerData.crm)
  // console.log('data.country 22', data.country)

  if (registerData.crm === 'fxbsc' && !euList.includes(data.country.toUpperCase())) {
    // console.log('registerData.crm === fxbeu Client SC')
    // console.log('registerData 22', registerData)
    // console.log('registerData.responseData 22', registerData.responseData)
    registerData.crm === 'fxbsc'
    // registerData.responseData.crm === 'fxbsc'
    const userData = {}
    userData.user = registerData.responseData.id
    userData.lead = false
    userData.tags = []
    // userData.tags = ['Client Website Disclaimer Accepted']
    // code hitting here
    registerData.responseData.user = registerData.responseData.id
    registerData.responseData.lead = false
    registerData.responseData.tags = []
    // registerData.responseData.tags = ['Client Website Disclaimer Accepted']

    // console.log('CONTINUE fxbsc NOT EU country : userData', userData)
    // console.log('CONTINUE fxbsc NOT EU country : registerData.responseData', registerData.responseData)

    const apiUrl = 'https://portal-sc.squaredfinancial.com/rest/'
    await axios({
      method: 'post',
      url: apiUrl + 'users/update?version=1.0.0',
      headers: {
        Authorization: CRED.FXB_AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
      data: {
        user: registerData.responseData.id,
        tags: [],
        lead: true,
        // tags: ['Client Website Disclaimer Accepted'],
      },
    })
      .then(function (response) {
        // console.log('users/update')

        axios({
          method: 'post',
          url: apiUrl + 'convert_lead_to_client?version=1.0.0',
          headers: {
            Authorization: CRED.FXB_AUTH_TOKEN,
            'Content-Type': 'application/json',
          },
          data: {
            ids: [registerData.responseData.id],
            sendWelcomeEmail: true,
          },
        })
          .then(function (response) {
            // console.log('convert_lead_to_client response SUCCESS')

            const testArr = {
              'registerData.responseData': registerData.responseData,
              'registerData.crm': registerData.crm,
              'registerData.apiBaseUrl': registerData.apiBaseUrl,
              'registerData.data': registerData.data,
              'registerData.url': registerData.url,
              true: true,
            }

            // console.log('callbackCreateAccount testArr', testArr)
            // console.log('callbackCreateAccount testArr')
            // console.log('callbackCreateAccount data', data)
            return callbackCreateAccount(res, registerData.responseData, registerData.crm, apiUrl, data, registerData.url, false)
              .then(function (response) {
                // console.log('callbackCreateAccount success')
                // console.log('callbackCreateAccount success registerData', registerData)
                return callbackDirectLogin(
                  res,
                  registerData.crm,
                  apiUrl,
                  registerData.responseData.id,
                  data,
                  registerData.url,
                  registerData.responseData
                )
                  .then(function (result) {
                    // console.log('callbackDirectLogin SUCCESS')
                    // console.log('callbackDirectLogin result', result)
                    return result
                  })
                  .catch(function (error) {
                    // eslint-disable-next-line no-console
                    // console.log('callbackDirectLogin FAIL')
                    // eslint-disable-next-line no-console
                    console.log(error)
                  })
              })
              .catch(function (error) {
                // console.log('callbackCreateAccount ERROR')
                // eslint-disable-next-line no-console
                console.log(error)
              })
          })
          .catch(function (error) {
            // eslint-disable-next-line no-console
            // console.log(error)
          })
      })
      .catch(function (error) {
        // eslint-disable-next-line no-console
        // console.log(error)
      })
  }

  /* return res.json({
    success: true,
    message: 'We apologize. Something went wrong. callbackFXBAcceptDocuments',
  }) */
}

const registerEuClientFromScToEu = async (req, res) => {
  const data = req.body.data
  const registerData = req.body.registerData

  // console.log('registerEuClientFromScToEu data')
  // console.log('registerEuClientFromScToEu data', data)
  // console.log('registerEuClientFromScToEu registerData', registerData)
  // registerData.url = new URL(registerData.url)
  registerData.url = new URL('https://www.squaredfinancial.com/')

  // console.log('registerData.crm === fxbsc Client EU')
  registerData.data.lead = false
  registerData.data.tags = ['Client Website Disclaimer Declined']
  // registerData.responseData.user = registerData.responseData.id
  registerData.responseData.lead = false
  registerData.responseData.tags = ['Client Website Disclaimer Declined']
  delete registerData.data.referralLinkId
  delete registerData.data.partnerId

  // console.log('registerData.data NEW MODIFIED', registerData.data)
  // console.log('registerData.responseData', registerData.responseData)

  let apiUrl =
    registerData.crm === 'fxbeu' ? 'https://portal-eu.squaredfinancial.com/rest/' : 'https://portal-sc.squaredfinancial.com/rest/'

  await axios({
    method: 'delete',
    url: apiUrl + 'users/' + registerData.responseData.id + '?version=1.0.0',
    headers: {
      Authorization: CRED.FXB_AUTH_TOKEN,
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      // console.log('users/delete')
      registerData.crm = registerData.crm === 'fxbeu' ? 'fxbsc' : 'fxbeu'
      apiUrl =
        registerData.crm === 'fxbeu' ? 'https://portal-eu.squaredfinancial.com/rest/' : 'https://portal-sc.squaredfinancial.com/rest/'

      registerData.apiBaseUrl =
        registerData.crm === 'fxbeu' ? 'https://portal-eu.squaredfinancial.com/rest/' : 'https://portal-sc.squaredfinancial.com/rest/'

      axios({
        method: 'post',
        url: apiUrl + 'users/new?version=1.0.0',
        headers: {
          Authorization: CRED.FXB_AUTH_TOKEN,
          'Content-Type': 'application/json',
        },
        data: registerData.data,
      })
        .then(function (response) {
          // console.log('users/new')
          // console.log('users/new response', response)
          registerData.responseData = response.data

          return callbackCreateAccount(
            res,
            registerData.responseData,
            registerData.crm,
            registerData.apiBaseUrl,
            registerData.data,
            registerData.url,
            true
          )
            .then(function (response) {
              // console.log('callbackCreateAccount')
              return callbackDirectLogin(
                res,
                registerData.crm,
                registerData.apiBaseUrl,
                registerData.responseData.id,
                registerData.data,
                registerData.url,
                registerData.responseData
              )
                .then(function (result) {
                  // console.log('callbackDirectLogin')
                  return result
                })
                .catch(function (error) {
                  // eslint-disable-next-line no-console
                  console.log(error)
                })
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error)
            })
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    })
    .catch(function (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}

module.exports = {
  registerClient,
  registerClientContinue,
  registerEuClientFromScToEu,
}
