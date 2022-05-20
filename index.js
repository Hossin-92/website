const { openDemoAccountEURoute } = require('./openAccount.routes')
const { sendMailRoute } = require('./sendMail.routes')
const { sendCareersMailRoute } = require('./sendCareersMail.routes')
const { registerIbRoute, registerAffiliateRoute } = require('./register.routes')
const { SendPrivacyPolicyAcceptedCookie } = require('./cookies.routes')
const { getRatesRoute } = require('./rates.routes')
const { getSymbols } = require('./mt5.routes')
const { registerTradingCentralRoute } = require('./tradingcentral.routes')
const { getTradingCentralRoute } = require('./gettradingcentral.routes')
const { registerClientRoute } = require('./registerClient.routes')
const { loginClientRoute } = require('./loginClient.routes')
const { getWpPostsRoute } = require('./tcwpposts.routes')

module.exports = {
  openDemoAccountEURoute,
  sendMailRoute,
  sendCareersMailRoute,
  registerIbRoute,
  registerAffiliateRoute,
  SendPrivacyPolicyAcceptedCookie,
  getRatesRoute,
  getSymbols,
  registerTradingCentralRoute,
  getTradingCentralRoute,
  registerClientRoute,
  loginClientRoute,
  getWpPostsRoute,
}
