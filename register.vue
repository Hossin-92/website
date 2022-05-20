<template>
  <div class="register-now mt-0 py-0">
    <div class="container mt-0 px-0 py-0">
      <!---->
      <div class="row mt-0 py-0">
        <div class="col mt-0 py-0" style="padding: 0px 10px">
          <div class="container mt-0 py-0 registration-form">
            <div class="row align-center">
              <div class="max-680 col-sm-12 col-md-12 col-12 mx-auto py-0">
                <div class="contact-form-modal">
                  <div class="row align-center justify-center mb-4 pt-0 pb-2">
                    <div align="center" class="col-sm-8 col-md-8 col-8">
                      <a :href="$links.BASEDOMAIN">
                        <img
                          :src="'/img/register-now/' + ($isEU ? 'sqf-registration-logo-eu.svg' : 'sqf-registration-logo-sc.svg')"
                          width="470px"
                          class="img-fluid"
                        />
                      </a>
                    </div>
                    <div class="col-sm-4 col-md-4 col-4 text-right"><SimpleLanguageSwitcher /></div>
                  </div>
                  <b-form autocomplete="on" class="form-register-inline py-0" @submit.stop.prevent="submit">
                    <div class="row">
                      <div class="col-md-12">
                        <!-- User Type -->
                        <b-form-group>
                          <b-form-select v-model="form.clientType" class="form-control" @change="changeClientType">
                            <b-form-select-option value="Individual">
                              {{ $t('input.form.clientType.individual') }}
                            </b-form-select-option>

                            <b-form-select-option value="Corporate">
                              {{ $t('input.form.clientType.corporate') }}
                            </b-form-select-option>
                          </b-form-select>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <!-- First Name Input -->
                        <b-form-group
                          :class="{
                            'form-group--error': $v.form.firstName.$error || !isFirstLastName,
                          }"
                        >
                          <b-input-group
                            :class="{
                              'form-input-group-error': !isFirstLastName,
                              'form-input-group': isFirstLastName,
                            }"
                          >
                            <b-form-input
                              v-model="form.firstName"
                              :disabled="isAwaiting"
                              :placeholder="$t('generic.fullName')"
                              class="form-control"
                              autocomplete="on"
                              @input="handleFirstLastName()"
                              @blur="checkFirstLastName()"
                            />
                          </b-input-group>
                        </b-form-group>
                        <div class="inline-error">
                          <p v-if="!isFirstLastName && !$v.form.firstName.required">
                            {{ $t('input.error.requiredFirstLastName') }}
                          </p>
                          <p v-if="!isFirstLastName && form.firstName && form.clientType === 'Individual'">
                            {{ $t('input.error.existFirstLastName') }}
                          </p>
                          <p v-if="form.firstName && !$v.form.firstName.latinOnly">
                            {{ $t('input.error.latinOnly') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <!-- Country Of Residence -->
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-group :class="{ 'form-group--error': $v.form.country.$error }">
                          <b-dropdown class="form-control mb-3 pt-0 country-dropdown" variant="light">
                            <template v-if="!country" v-slot:button-content>
                              {{ $t('generic.selectCountryOfResidence') }}
                            </template>
                            <template v-if="country" v-slot:button-content>
                              <img :src="`/flags/${country.code.toLowerCase()}.png`" :alt="country.code" height="20" width="30" />
                              {{ country.name }}
                            </template>
                            <div>
                              <span v-show="ResCountry.length > 0" class="Residenceicon" @click="clearField"
                                ><font-awesome-icon icon="times"
                              /></span>
                              <b-form-input
                                ref="refCountrySearch"
                                v-model="ResCountry"
                                class="countryInput"
                                :placeholder="$t('input.form.select_country')"
                              >
                              </b-form-input>
                            </div>
                            <b-dropdown-item v-for="country in filterCountry" :key="country.code" @click="changeCountry(country)">
                              <img
                                :src="`/flags/${country.code.toLowerCase()}.png`"
                                :alt="country.code"
                                height="20"
                                width="30"
                                class="country-image"
                              />
                              {{ country.name }}
                            </b-dropdown-item>
                          </b-dropdown>
                          <!-- Phone Number Input -->

                          <!--CountryInput v-model="form.country" class="form-control mb-3" @click="checkRegion(form.country)" /-->
                        </b-form-group>
                        <!--div class="inline-error">
                          <p v-if="!isPhoneNumber && !$v.form.phoneNumber.required">
                            {{ $t('input.form.error.phoneNumberRequired') }}
                          </p>
                        </div-->
                      </div>
                    </div>
                    <!-- Phone Number -->
                    <div class="row">
                      <div class="col-md-12">
                        <!-- Phone Number Input -->
                        <b-form-group :class="{ 'form-group--error': $v.form.phoneNumber.$error }">
                          <TradeNowPhoneInput
                            v-show="true"
                            ref="phoneInput"
                            v-model="form.phoneNumber"
                            :placeholder="$t('input.form.phoneNumber')"
                            :show-country-code="true"
                            autocomplete="on"
                            @input="handlePhoneNumber()"
                            @blur="checkPhoneNumber()"
                          />
                        </b-form-group>
                        <div class="inline-error">
                          <p v-if="!isPhoneNumber && !$v.form.phoneNumber.required">
                            {{ $t('input.form.error.phoneNumberRequired') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <!--div class="row">
                      <div class="col-md-12">
                        <b-form-group :class="{ 'form-group--error': $v.form.phoneNumber.$error }">
                          <TradeNowPhoneInput
                            v-show="true"
                            ref="phoneInput"
                            v-model="form.phoneNumber"
                            :placeholder="$t('input.form.phoneNumber')"
                            :show-country-code="true"
                            autocomplete="on"
                            @input="handlePhoneNumber()"
                            @blur="checkPhoneNumber()"
                          />
                        </b-form-group>
                        <div class="inline-error">
                          <p v-if="!isPhoneNumber && !$v.form.phoneNumber.required">
                            {{ $t('input.form.error.phoneNumberRequired') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-group :class="{ 'form-group--error': $v.form.country.$error }">
                          <b-dropdown class="form-control mb-3 country-dropdown" variant="light">
                            <template v-if="!country" v-slot:button-content>
                              {{ $t('generic.selectCountryOfResidence') }}
                            </template>
                            <template v-if="country" v-slot:button-content>
                              <img :src="`/flags/${country.code.toLowerCase()}.png`" :alt="country.code" height="20" width="30" />
                              {{ country.name }}
                            </template>
                            <b-dropdown-item v-for="country in countryCodes" :key="country.code" @click="changeCountry(country)">
                              <img
                                :src="`/flags/${country.code.toLowerCase()}.png`"
                                :alt="country.code"
                                height="20"
                                width="30"
                                class="country-image"
                              />
                              {{ country.name }}
                            </b-dropdown-item>
                          </b-dropdown>
                        </b-form-group>
                      </div>
                    </div-->

                    <!--div class="row">
                      <div class="col-md-12">
                        <b-form-group :class="{ 'form-group--error': $v.form.language.$error }">
                          <LanguageInput v-model="form.language" :disabled="isAwaiting" class="form-control" />
                        </b-form-group>
                      </div>
                    </div-->
                    <div class="row">
                      <div class="col-md-12">
                        <!-- Email Input -->
                        <b-form-group :class="{ 'form-group--error': $v.form.email.$error }">
                          <b-input-group
                            :class="{
                              'form-input-group-error': !isEmail,
                              'form-input-group': isEmail,
                            }"
                          >
                            <b-form-input
                              v-model="form.email"
                              :disabled="isAwaiting"
                              :placeholder="$t('generic.email')"
                              class="form-control"
                              autocomplete="on"
                              @input="handleEmail()"
                              @blur="checkEmail()"
                            />
                          </b-input-group>
                        </b-form-group>
                        <div class="inline-error">
                          <p v-if="!isEmail && !$v.form.email.required">
                            {{ $t('input.form.error.emailRequired') }}
                          </p>
                          <p v-if="!isEmail && !$v.form.email.email">
                            {{ $t('input.form.error.emailValid') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <!-- Email Input -->
                        <b-form-group :class="{ 'form-group--error': $v.form.password.$error }">
                          <b-input-group
                            :class="{
                              'form-input-group-error': !isPassword,
                              'form-input-group': isPassword,
                            }"
                          >
                            <b-form-input
                              v-model="form.password"
                              :type="showPassword ? 'text' : 'password'"
                              :disabled="isAwaiting"
                              class="form-control form-control-password"
                              :placeholder="$t('input.form.password')"
                              @input="handlePassword()"
                              @blur="checkPassword()"
                            />
                            <b-input-group-append class="input-group-append-white-bg" @click="() => (showPassword = !showPassword)">
                              <span class="input-group-text">
                                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                              </span>
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                        <div class="inline-error">
                          <p v-if="!isPassword" v-html="isPasswordText" />
                          <p v-if="form.password && $v.form.password.valid && !$v.form.password.minLength">
                            {{ $t('input.error.passwordMin') }}
                          </p>
                          <p v-if="form.password && !$v.form.password.maxLength">
                            {{ $t('input.error.passwordMax') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-if="$isSC" class="row">
                      <div class="col-md-12">
                        <!-- Referral Code -->
                        <b-form-group>
                          <b-form-checkbox v-model="hasReferrer" @click="hasReferrer = !hasReferrer">
                            {{ $t('input.form.referrerOptional') }}
                          </b-form-checkbox>
                        </b-form-group>
                      </div>
                    </div>
                    <div v-if="hasReferrer" class="row">
                      <div class="col-md-12">
                        <!-- Referral Code -->
                        <b-form-group>
                          <b-input-group
                            :class="{
                              'form-input-group-error': !isReferrer,
                              'form-input-group': isReferrer,
                            }"
                          >
                            <b-form-input
                              v-model="form.referrer"
                              :disabled="isAwaiting"
                              :placeholder="$t('input.form.referrer')"
                              class="form-control"
                              @input="handleReferrer()"
                              @blur="checkReferrer()"
                            />
                          </b-input-group>
                        </b-form-group>
                        <div class="inline-error">
                          <p v-if="!isReferrer && !$v.form.referrer.numeric">
                            {{ $t('input.form.error.referrerValid') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <b-modal id="modal-redirect" centered hide-footer hide-header>
                      <div class="text-center">
                        <h3 class="mt-0 mb-0 px-0 pt-0 pb-0">
                          You have been Registered under the <br />SquaredFinancial ({{ portals[portal] }}) Ltd Entity
                        </h3>
                        <h3 class="mt-0 mb-0 px-0 pt-0 pb-0">Redirecting to <br />SquaredFinancial ({{ portals[portal] }}) Ltd</h3>
                        <div class="login-loader mx-auto">
                          <div id="loader" class="mx-auto"><span></span><span></span><span></span></div>
                        </div>
                      </div>
                    </b-modal>
                    <div class="row">
                      <div class="col-md-12">
                        <div v-if="$v.$error" class="text-center h5 mt-lg-3 form-error-message">
                          {{ $t('input.errors.fillAllFields') }}
                        </div>
                        <div
                          v-if="formResponseError != null"
                          class="text-center h5 mt-lg-3 form-error-message"
                          v-html="formResponseError"
                        ></div>
                        <b-button
                          :disabled="isWaitingForResponse || isDisabled"
                          type="submit"
                          :class="isDisabled ? 'btn-green-disabled' : 'btn-green'"
                          class="cta-btn-green-full mt-1 mx-auto btn-block"
                        >
                          <!--b-spinner v-if="isAwaiting" />
                          <span v-if="isAwaiting" class="sr-only">Loading...</span-->
                          <span>{{ $t('input.form.ctaText') }}</span>
                        </b-button>
                      </div>
                    </div>
                    <div class="row my-0 py-0">
                      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my-0 py-0 text-justify">
                        <div class="form-terms-conditions mt-0 mb-0 px-0 py-2">
                          {{ $t('input.form.confirmation') }}
                          <a
                            :href="'https://' + ($isEU ? 'www' : 'sc') + '.squaredfinancial.com/about/terms-and-conditions'"
                            target="_blank"
                            >{{ $t('input.form.termsAndConditions') }}</a
                          >
                        </div>
                      </div>
                    </div>
                    <div class="row my-0 py-0">
                      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 my-0 py-0 text-justify">
                        <div class="form-bottom-note mt-0 mb-0 font-size-12 px-3 py-3">
                          {{ $region === 'sc' ? $t('input.form.termsSC') : $t('input.form.terms') }}
                        </div>
                      </div>
                    </div>
                  </b-form>
                  <b-modal id="modal-select-restricted-country" centered hide-footer hide-header size="lg" content-class="gradient-border">
                    <div
                      v-if="
                        (countryData.entity === 'NA' && excludedCountries.includes(form.country)) ||
                        (restrictionEuCountryScRegion.includes(form.country) && region === 'sc')
                      "
                    >
                      <div class="row m-0 p-0">
                        <div class="col-sm-11 mx-0 px-0">
                          <p class="text-center" v-html="$t('components.regionPopup.noLicenseForCountry', { country: countryData.name })" />
                        </div>
                        <div class="col-sm-1 text-right mx-0 px-0">
                          <a class="btn btn-light m-0 p-1" @click="$bvModal.hide('modal-select-restricted-country')">
                            <font-awesome-icon icon="times" height="16" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <!--div v-if="countryData.entity !== 'NA'">
                      <p v-html="$t(`components.regionPopup.${$region}.countryOfResidenceExclusion`)" />
                      <div class="row">
                        <div v-if="$region === 'eu'" class="col-sm-3"></div>
                        <div v-if="$region === 'sc'" class="col-sm-6">
                          <b-button variant="primary" block @click="hideCountryModal">
                            {{ $t(`components.regionPopup.${$region}.ctaContinue`) }}
                          </b-button>
                        </div>
                        <div class="col-sm-6">
                          <b-button :href="$region === 'eu' ? $links['SC'] : $links['EU']" variant="primary" block>
                            {{ $t(`components.regionPopup.${$region}.ctaVisit`) }}
                          </b-button>
                        </div>
                        <div v-if="$region === 'eu'" class="col-sm-3"></div>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <p class="small mt-3">
                            {{ $t(`components.regionPopup.${$region}.cta1Desc`) }}
                          </p>
                        </div>
                        <div class="col-sm-6">
                          <p class="small mt-3">
                            {{ $t(`components.regionPopup.${$region}.cta2Desc`) }}
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-12 text-center">
                          <a
                            :href="'https://' + ($region === 'sc' ? 'www' : 'sc') + '.squaredfinancial.com/about/terms-and-conditions'"
                            target="_blank"
                            >{{ $t('input.form.termsAndConditions') }}</a
                          >
                        </div>
                      </div>
                    </div-->
                  </b-modal>
                  <b-modal id="modal-registered-invalid-region" centered hide-footer hide-header size="lg" content-class="gradient-border">
                    <p v-html="$t(`components.regionPopup.${$region}.countryOfResidenceExclusion`)" />
                    <div class="row">
                      <div v-if="$region === 'sc'" class="col-sm-6">
                        <!-- View Content Button -->
                        <b-button variant="primary" block @click="continueRegisterModal">
                          {{ $t(`components.regionPopup.${$region}.ctaContinue`) }}
                        </b-button>
                        <p class="small mt-3">
                          {{ $t(`components.regionPopup.${$region}.cta1Desc`) }}
                        </p>
                      </div>
                      <div v-if="$region === 'eu'" class="col-sm-3"></div>
                      <div class="col-sm-6">
                        <!-- Start Trading Button -->
                        <b-button v-if="$region === 'sc'" variant="primary" block @click="registerEuClientFromScToEuModal">
                          {{ $t(`components.regionPopup.${$region}.ctaRegister`) }}
                        </b-button>
                        <b-button v-if="$region === 'eu'" variant="primary" block @click="continueRegisterModal">
                          {{ $t(`components.regionPopup.${$region}.ctaRegister`) }}
                        </b-button>
                        <p v-if="$region === 'sc'" class="small mt-3">
                          {{ $t(`components.regionPopup.${$region}.cta2Desc`) }}
                        </p>
                      </div>
                      <div v-if="$region === 'eu'" class="col-sm-3"></div>
                      <div v-if="$region === 'eu'" class="col-sm-12">
                        <p class="small mt-3">
                          {{ $t(`components.regionPopup.${$region}.cta2Desc`) }}
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 text-center">
                        <a
                          :href="'https://' + ($region === 'sc' ? 'www' : 'sc') + '.squaredfinancial.com/about/terms-and-conditions'"
                          target="_blank"
                          >{{ $t('input.form.termsAndConditions') }}</a
                        >
                      </div>
                    </div>
                  </b-modal>
                  <b-modal
                    id="modal-blacklisted-country-registration"
                    centered
                    hide-footer
                    hide-header
                    size="lg"
                    content-class="gradient-border"
                  >
                    <div v-if="countryData.entity === 'NA' || (region === 'sc' && restrictionEuCountryScRegion.includes(form.country))">
                      <div class="row m-0 p-0">
                        <div class="col-sm-11 mx-0 px-0">
                          <p class="text-center" v-html="$t(`components.regionPopup.${$region}.noLicenseForCountry`)" />
                        </div>
                        <div class="col-sm-1 text-right mx-0 px-0">
                          <a class="btn btn-light m-0 p-1" @click="$bvModal.hide('modal-blacklisted-country-registration')">
                            <font-awesome-icon icon="times" height="16" />
                          </a>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-4">
                          <br />
                        </div>
                        <div class="col-sm-4">
                          <p class="text-center">
                            <b-button variant="primary" block :href="$links.BASEDOMAIN">
                              {{ $t(`components.regionPopup.ctaBack`) }}
                            </b-button>
                          </p>
                        </div>
                        <div class="col-sm-4">
                          <br />
                        </div>
                      </div>
                    </div>
                  </b-modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <RegionPopup />
  </div>
</template>
<script>
import forEach from 'lodash/forEach'
import startsWith from 'lodash/startsWith'
import { required, email, numeric, minLength, maxLength, helpers } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
// import InvestingItalianInlineForm from '~/components/forms/InvestingItalianInlineForm'
import { CRMType } from '~/components/forms/enums'
// import CountryInput from '~/components/countryInput/CountryInput'
// import LanguageInput from '~/components/countryInput/LanguageInput'
// import SimpleLanguageSwitcher from '~/components/SimpleLanguageSwitcher'
// import TradeNowPhoneInput from '~/components/phoneInput/TradeNowPhoneInput'
// import RegionPopup from '~/components/modals/RegionPopup'
import CountryCodes from '~/components/countryInput/CountryCodes'
const Cookies = require('js-cookie')
const countries = require('../assets/data/countries.json')
const excludedCountries = require('../assets/data/excludedCountries.json')

const SimpleLanguageSwitcher = () => import('~/components/SimpleLanguageSwitcher')
const TradeNowPhoneInput = () => import('~/components/phoneInput/TradeNowPhoneInput')
const RegionPopup = () => import('~/components/modals/RegionPopup')
// const CountryCodes = () => import('~/components/countryInput/CountryCodes')

// const mustBeChecked = (value) => value
const latinOnly = helpers.regex('alpha', /^[a-z\sA-Z]*$/)
// eslint-disable-next-line
// const existsName = (value) => value.length > 0
// const existsNameFirstLast = (value) => value.split(' ').length >= 2 && value.split(' ')[0].length > 0 && value.split(' ')[1].length > 0
// let clientType = 'Individual'
let globalClientType = 'Individual'

// const termsAccepted = (value) => value === 'accepted'
export default {
  components: {
    SimpleLanguageSwitcher,
    // CountryInput,
    // LanguageInput,
    TradeNowPhoneInput,
    RegionPopup,
    // InvestingItalianInlineForm,
    // ContactUsForm,
  },
  mixins: [validationMixin],
  props: {
    formType: {
      type: String,
      default: 'contact',
    },
  },
  layout: 'simple',
  /* asyncData({ query }) {
    return {
      region: (this.$isSC)? 'sc': 'eu',
      crm: this.$isSC === 'sc' ? CRMType.FXB_SC : CRMType.FXB_EU,
    }
  }, */
  data() {
    return {
      /* isSC: this.getSC(),
      isEU: this.getEU(), */
      isAwaiting: false,
      isSubmited: false,
      showScrollToTop: false,
      utmParams: null,
      isScrolled: false,
      region: CRMType.FXB,
      crm: CRMType.FXB,
      isFirstLastName: true,
      isPassword: true,
      isPasswordText: '',
      showPassword: false,
      isPhoneNumber: true,
      isEmail: true,
      isReferrer: true,
      hasReferrer: false,
      formResponseError: null,
      isWaitingForResponse: false,
      receiveMarketingEmailsCheck: 'yes',
      portal: CRMType.FXB,
      portals: { fxbeu: 'CY', fxbsc: 'Seychelles' },
      country: null,
      countryData: { entity: 'NA' },
      excludedCountries,
      restrictedCountryPopup: false,
      registerResult: {},
      ResCountry: '',
      restrictionEuCountryScRegion: [
        'IT',
        'ES',
        'AT',
        'BE',
        'BG',
        'HR',
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
        'SE',
      ],
      form: {
        clientType: globalClientType,
        firstName: null,
        phoneNumber: null,
        language: this.$i18n.locale,
        country: null,
        email: null,
        password: null,
        referrer: null,
      },
    }
  },
  computed: {
    currentLang() {
      return this.$i18n.locale
    },
    isDisabled() {
      // console.log('isDisabled: globalClientType', globalClientType)
      return this.$v.$invalid
    },
    countryCodes() {
      return CountryCodes
    },
    filterCountry() {
      return this.countryCodes.filter((country) => country.name.toLowerCase().includes(this.ResCountry.toLowerCase()))
    },
  },
  mounted() {
    if (process.browser) {
      // console.log('window.location.pathname', window.location.pathname)
      // console.log('document.referrer', document.referrer)
      // console.log('document.referrer domain: ' + document.referrer.split('/')[2])
    }
  },
  created() {
    // console.log('created: globalClientType', globalClientType)
    this.region = this.$isSC ? 'sc' : 'eu'
    this.crm = this.$isSC ? CRMType.FXB_SC : CRMType.FXB_EU

    const params = this.$route.query
    if (params.lid) {
      this.hasReferrer = true
      this.form.referrer = params.lid
    }

    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      const body = document.getElementById('layout-wrapper')
      body.classList.add('hero-bg')
      body.classList.add('hero-bg-register-now')

      const countryCode = this.$topLevelDomain === 'cn' ? 'CN' : Cookies.get('country') ? Cookies.get('country') : null
      if (countryCode) {
        this.country = CountryCodes.find((country) => country.code === countryCode)
        this.form.country = this.country.code
        this.countryData = countries[this.country.code]
      }
    }
    /* const region = this.$route.query.region ? this.$route.query.region : 'eu'
    Cookies.set('license', region, { expires: 365 })
    this.$store.commit('setLicense', region)
    this.isEU = region === 'eu'
    this.isSC = region === 'sc' */
  },
  destroyed() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      const body = document.getElementById('layout-wrapper')
      body.classList.remove('hero-bg')
      body.classList.remove('hero-bg-register-now')
    }
  },
  middleware: ['MStoreAndCookies'],
  methods: {
    /* validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    }, */
    /* getSC() {
      return this.$store.state.license === 'sc'
    },
    getEU() {
      return this.$store.state.license === 'eu'
    }, */
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.submitStatus = 'PENDING'
        await this.register()
      }
    },
    async register() {
      // console.log('SUCCESS result 111111')
      const crm = this.crm
      const urlParams = this.$route.query
      let utmParams = ''

      if (urlParams !== null) {
        forEach(urlParams, function (value, key) {
          if (startsWith(key, 'utm_')) {
            utmParams += `${key}=${value}&`
          }
        })
        // Removes last & character
        utmParams = utmParams.substring(0, utmParams.length - 1)

        if (urlParams.lid) {
          this.form.referrer = urlParams.lid
        }
      }

      let formErrors = ''
      this.formResponseError = null
      const _this = this
      // eslint-disable-next-line
      // console.log('_this.form', _this.form)
      // if (process.env.NODE_ENV === 'production') {
      if (Cookies.get('country')) {
        const country = countries[_this.form.country]
        if (
          (country.entity !== 'EU' && country.entity !== 'EUSC' && this.region === 'eu') ||
          ((country.entity === 'EU' || country.entity === 'EUSC') && this.region === 'sc') ||
          country.entity === 'NA'
        ) {
          // alert('you are in the wrong website')
          // return
          // console.log('invalid country')
        }
      }
      // }
      // return
      // const countrySelected = countries[_this.form.country]
      _this.isWaitingForResponse = true
      await this.$axios
        .$post('/api/v1/register', {
          form: _this.form,
          utmParams,
          campaign: _this.$store.state.campaign,
          crm,
          receiveMarketingEmails: _this.receiveMarketingEmailsCheck,
        })
        .then(function (result) {
          // console.log('SUCCESS result 1', result)
          if (result.success === true) {
            _this.formResponseError = null
            _this.portal = result.crm
            _this.gtmSendLead()
            // alert('here 2')
            // if (_this.crm !== result.crm) {
            // console.log('countrySelected', countrySelected)
            if (
              (_this.countryData.entity !== 'EU' && _this.countryData.entity !== 'EUSC' && _this.region === 'eu') ||
              ((_this.countryData.entity === 'EU' || _this.countryData.entity === 'EUSC') && _this.region === 'sc') ||
              _this.countryData.entity === 'NA' ||
              (_this.region === 'sc' && _this.restrictionEuCountryScRegion.includes(_this.form.country))
            ) {
              // alert('here 1')
              // console.log('SUCCESS result 2')
              // console.log('this.countryData.entity', _this.countryData.entity)
              _this.registerResult = result
              // _this.$bvModal.show('modal-redirect')
              // _this.$bvModal.show('modal-registered-invalid-region')
              if (
                _this.countryData.entity === 'NA' ||
                (_this.region === 'sc' &&
                  _this.restrictionEuCountryScRegion.includes(_this.form.country) &&
                  (urlParams === null || (!urlParams.lid && !urlParams.pid)))
              ) {
                _this.$bvModal.show('modal-blacklisted-country-registration')
                // return
              } else {
                _this.$bvModal.show('modal-registered-invalid-region')
                // return
              }
              /* setTimeout(function () {
                _this.redirectToPortal(result.url)
              }, 6000) */
            } else {
              _this.redirectToPortal(result.url)
            }
          } else {
            if (typeof result.errors !== 'undefined') {
              Object.keys(result.errors).forEach(function (keyA) {
                if (typeof result.errors[keyA].errors !== 'undefined') {
                  Object.keys(result.errors[keyA].errors).forEach(function (keyB) {
                    formErrors += `${result.errors[keyA].errors[keyB]} <br>`
                  })
                }
              })
            }

            if (
              _this.countryData.entity === 'NA' ||
              (_this.region === 'sc' &&
                _this.restrictionEuCountryScRegion.includes(_this.form.country) &&
                (urlParams === null || (!urlParams.lid && !urlParams.pid)))
            ) {
              _this.$bvModal.show('modal-blacklisted-country-registration')
              // return
            }

            if (result.message) {
              formErrors = result.message
            }
            // console.log('result error', result)
            // Fallback
            if (!formErrors) {
              formErrors = 'We apologize. Something went wrong.<br/> Please check your phone number and email are unique'
              // formErrors = 'We apologize. Something went wrong.<br/>' + result.error.message
            }
          }
          _this.isWaitingForResponse = false
          _this.formResponseError = formErrors
        })
        .catch(function (error) {
          _this.isWaitingForResponse = false
          // formErrors = 'We apologize. Something went wrong.<br/>' + error
          formErrors = 'We apologize. Something went wrong.<br/>' + error
          _this.formResponseError = formErrors
        })
    },
    redirectToPortal(url) {
      this.$nextTick(function () {
        window.location.href = url
      })
    },
    gtmSendLead() {
      this.$nextTick(function () {
        window.dataLayer = window.dataLayer || []

        window.dataLayer.push({
          formSatus: 'sent',

          event: 'new_subscriber',
        })
      })
    },
    async onSubmit() {
      const _this = this
      _this.$v.form.$touch()
      if (_this.$v.form.$anyError) {
        return
      }
      _this.isAwaiting = true

      _this.form.formType = _this.formType

      await _this.$axios
        .post('/api/v1/send-mail', _this.form)
        .then(() => {
          _this.$bvToast.toast(this.$t('helpCenter.emailSentContent'), {
            toaster: 'b-toaster-top-center',
            title: this.$t('helpCenter.emailSentTitle'),
            autoHideDelay: 5000,
            variant: 'success',
          })

          _this.form = {
            firstName: null,
            email: null,
            phone: null,
            password: null,
            country: null,
            language: null,
          }
          _this.isAwaiting = false
          _this.isSubmited = true
        })
        .catch(() => {
          _this.$bvToast.toast('Something went wrong', {
            toaster: 'b-toaster-top-center',
            title: 'Error',
            autoHideDelay: 5000,
            variant: 'danger',
          })
          _this.isAwaiting = false
        })
    },
    changeClientType() {
      globalClientType = this.form.clientType
      // console.log('changeClientType: globalClientType', globalClientType)
      if (!this.form.firstName) {
        this.isFirstLastName = false
        return this.isFirstLastName
      }
      if (this.form.clientType === 'Individual') {
        // validations.form.firstName.exists = existsNameFirstLast
        // existsNameFirstLast = (value) => value.split(' ').length >= 2 && value.split(' ')[0].length > 0 && value.split(' ')[1].length > 0
        if (this.form.firstName) {
          // this.$v.form.$touch()
          this.form.firstName = this.form.firstName.replace(/\s\s+/g, ' ')
          const firstNameArray = this.form.firstName.split(' ')
          if (firstNameArray.length >= 2 && firstNameArray[0].length > 0 && firstNameArray[1].length > 0) {
            this.isFirstLastName = true
            return true
          } else {
            this.isFirstLastName = false
            return false
          }
        }
      } else {
        // this.validations.form.firstName.exists = existsName
        // existsNameFirstLast = (value) => value.length > 0
        this.isFirstLastName = true
        return this.isFirstLastName
      }
    },
    handleFirstLastName() {
      if (!this.form.firstName.length) {
        this.isFirstLastName = false
        return this.isFirstLastName
      }
      if (this.form.firstName.length > 2) {
        if (this.form.clientType === 'Individual') {
          // existsNameFirstLast = (value) => value.split(' ').length >= 2 && value.split(' ')[0].length > 0 && value.split(' ')[1].length > 0
          this.form.firstName = this.form.firstName.replace(/\s\s+/g, ' ')
          const firstNameArray = this.form.firstName.split(' ')
          if (firstNameArray.length >= 2 && firstNameArray[0].length > 0 && firstNameArray[1].length > 0) {
            this.isFirstLastName = true
            return true
          } else {
            this.isFirstLastName = false
            return false
          }
        } else {
          // existsNameFirstLast = (value) => value.length > 0
          this.isFirstLastName = true
          return true
        }
      }
    },
    checkFirstLastName() {
      if (!this.form.firstName) {
        this.isFirstLastName = false
        return this.isFirstLastName
      }

      this.form.firstName = this.form.firstName.trim()
      this.form.firstName = this.form.firstName.replace(/\s\s+/g, ' ')
      const firstNameArray = this.form.firstName.split(' ')
      if (this.form.clientType === 'Individual') {
        // existsNameFirstLast = (value) => value.split(' ').length >= 2 && value.split(' ')[0].length > 0 && value.split(' ')[1].length > 0
        if (firstNameArray.length >= 2 && firstNameArray[0].length > 0 && firstNameArray[1].length > 0) {
          this.isFirstLastName = true
          return true
        } else {
          this.isFirstLastName = false
          return false
        }
      } else {
        // existsNameFirstLast = (value) => value.length > 0
        this.isFirstLastName = true
        return true
      }
    },
    handlePassword() {
      if (!this.form.password.length) {
        this.isPasswordText = '<p>' + this.$t('input.error.passwordRequired') + '</p>'
        this.isPassword = false
        return this.isPassword
      }

      if (this.form.password.length > 3) {
        const containsUppercase = /[A-Z]/.test(this.form.password)
        this.isPasswordText = !containsUppercase ? '<p>' + this.$t('input.error.passwordUppercase') + '</p>' : ''

        const containsLowercase = /[a-z]/.test(this.form.password)
        this.isPasswordText += !containsLowercase ? '<p>' + this.$t('input.error.passwordLowercase') + '</p>' : ''

        const containsNumber = /[0-9]/.test(this.form.password)
        this.isPasswordText += !containsNumber ? '<p>' + this.$t('input.error.passwordNumber') + '</p>' : ''

        const containsSpecial = /[#?!@$%^&*-]/.test(this.form.password)
        this.isPasswordText += !containsSpecial ? '<p>' + this.$t('input.error.passwordSpecialCharacter') + '</p>' : ''

        this.isPassword = containsUppercase && containsLowercase && containsNumber && containsSpecial

        return this.isPassword
      }
    },
    checkPassword() {
      if (!this.form.password) {
        this.isPasswordText = '<p>' + this.$t('input.error.passwordRequired') + '</p>'
        this.isPassword = false
        return this.isPassword
      }

      this.form.password = this.form.password.trim()
      const containsText = this.form.password.length > 0
      this.isPasswordText = !containsText ? '<p>' + this.$t('input.error.passwordRequired') + '</p>' : ''
      // console.log('this.form.password.length', this.form.password.length)

      const containsUppercase = /[A-Z]/.test(this.form.password)
      this.isPasswordText += !containsUppercase ? '<p>' + this.$t('input.error.passwordUppercase') + '</p>' : ''

      const containsLowercase = /[a-z]/.test(this.form.password)
      this.isPasswordText += !containsLowercase ? '<p>' + this.$t('input.error.passwordLowercase') + '</p>' : ''

      const containsNumber = /[0-9]/.test(this.form.password)
      this.isPasswordText += !containsNumber ? '<p>' + this.$t('input.error.passwordNumber') + '</p>' : ''

      const containsSpecial = /[#?!@$%^&*-]/.test(this.form.password)
      this.isPasswordText += !containsSpecial ? '<p>' + this.$t('input.error.passwordSpecialCharacter') + '</p>' : ''

      this.isPassword = containsText && containsUppercase && containsLowercase && containsNumber && containsSpecial

      return this.isPassword
    },
    handlePhoneNumber() {
      // this.form.phoneNumber.number = Number(this.form.phoneNumber.number)
      this.isPhoneNumber = true
      if (!this.form.phoneNumber.length && !this.$v.form.phoneNumber.required) {
        this.isPhoneNumber = false
        return this.isPhoneNumber
      } else {
        this.form.phoneNumber.number = Number(this.form.phoneNumber.number)
        // console.log('this.form.phoneNumber', this.form.phoneNumber)
        // this.isPhoneNumber = true
        return this.isPhoneNumber
      }
    },
    checkPhoneNumber() {
      // alert('telephone here 2')
      // this.form.phoneNumber.number = Number(this.form.phoneNumber.number)
      if (!this.form.phoneNumber) {
        this.isPhoneNumber = false
        return this.isPhoneNumber
      } else {
        this.form.phoneNumber.number = Number(this.form.phoneNumber.number)
        // console.log('this.form.phoneNumber', this.form.phoneNumber)
        // this.isPhoneNumber = true
        return this.isPhoneNumber
      }
    },
    handleEmail() {
      this.isEmail = true
      if (!this.form.email.length && !this.$v.form.email.required) {
        this.isEmail = false
        return this.isEmail
      }
    },
    checkEmail() {
      if (!this.form.email) {
        this.isEmail = false
        return this.isEmail
      }
      if (!this.$v.form.email.email) {
        this.isEmail = false
        return this.isEmail
      }
    },
    handleReferrer() {
      this.isReferrer = true
      if (!this.$v.form.referrer.numeric) {
        this.isReferrer = false
        return this.isReferrer
      }
    },
    checkReferrer() {
      if (!this.$v.form.referrer.numeric) {
        this.isReferrer = false
        return this.isReferrer
      }
    },
    /* checkRegion(mycountry) {
      alert(this.form.country.name)
      // if (process.env.NODE_ENV === 'production') {
      if (Cookies.get('country')) {
        const country = countries[this.form.country]
        if ((country.entity !== 'EU' && this.region === 'eu') || (country.entity === 'EU' && this.region === 'sc')) {
          alert('you are in the wrong website')
          // return
        }
      }
      // }
    }, */
    changeCountry(country) {
      console.log('changed the country')
      this.country = country
      this.form.country = country.code
      console.log('this.country', this.country)

      // if (process.env.NODE_ENV === 'production') {
      this.countryData = countries[this.country.code]

      if (this.countryData.entity === 'NA' && excludedCountries.includes(this.form.country)) {
        // this.isWaitingForResponse = true
        this.$bvModal.show('modal-select-restricted-country')
        // this.country = null
        // this.form.country = null
      } else {
        // this.isWaitingForResponse = false
      }

      const urlParams = this.$route.query
      // let utmParams = ''

      if (urlParams === null && this.restrictionEuCountryScRegion.includes(this.form.country) && this.region === 'sc') {
        this.$bvModal.show('modal-select-restricted-country')
      } else if (urlParams !== null) {
        if (!urlParams.lid && !urlParams.pid && this.restrictionEuCountryScRegion.includes(this.form.country) && this.region === 'sc') {
          this.$bvModal.show('modal-select-restricted-country')
        }
      }

      if (this.countryData.entity === 'NA' && excludedCountries.includes(this.form.country)) {
        // this.isWaitingForResponse = true
        this.$bvModal.show('modal-select-restricted-country')
        // this.country = null
        // this.form.country = null
      } else {
        // this.isWaitingForResponse = false
      }

      /* if (
        (this.countryData.entity !== 'EU' && this.countryData.entity !== 'EUSC' && this.region === 'eu') ||
        ((this.countryData.entity === 'EU' || this.countryData.entity === 'EUSC') && this.region === 'sc') ||
        (this.countryData.entity === 'NA' && excludedCountries.includes(this.form.country))
      ) { */
      if (this.countryData.entity === 'NA' && excludedCountries.includes(this.form.country)) {
        this.$bvModal.show('modal-select-restricted-country')
        // alert('you are in the wrong website')
        // return
      }
    },
    hideCountryModal() {
      this.$bvModal.hide('modal-select-restricted-country')
    },
    async continueRegisterModal() {
      const urlParams = this.$route.query

      console.log('here continueSubmitInvalidRegionModal')
      if (
        this.countryData.entity === 'NA' ||
        (this.region === 'sc' &&
          this.restrictionEuCountryScRegion.includes(this.form.country) &&
          (urlParams === null || (!urlParams.lid && !urlParams.pid)))
      ) {
        this.$bvModal.show('modal-blacklisted-country-registration')
        // return
      }

      const crm = this.crm
      // let formErrors = ''
      this.formResponseError = null
      const _this = this
      _this.isWaitingForResponse = true
      await this.$axios
        .$post('/register/continue', {
          data: _this.form,
          crm,
          registerData: _this.registerResult,
        })
        .then(function (result) {
          // alert('here continueSubmitInvalidRegionModal 1')
          if (result.success === true) {
            // alert('here continueSubmitInvalidRegionModal 2')
            console.log('/register/continue result', result)
            _this.formResponseError = null
            _this.portal = result.crm
            _this.$bvModal.hide('modal-registered-invalid-region')
            _this.redirectToPortal(result.url)
          }
        })
        .catch(() => {
          // alert('ERROR HEREH 123')
        })
    },
    async registerEuClientFromScToEuModal() {
      // alert('here continueSubmitInvalidRegionModal')
      const urlParams = this.$route.query

      if (
        this.countryData.entity === 'NA' ||
        (this.region === 'sc' &&
          this.restrictionEuCountryScRegion.includes(this.form.country) &&
          (urlParams === null || (!urlParams.lid && !urlParams.pid)))
      ) {
        this.$bvModal.show('modal-blacklisted-country-registration')
        // return
      }
      const crm = this.crm
      // let formErrors = ''
      this.formResponseError = null
      const _this = this
      _this.isWaitingForResponse = true
      await this.$axios
        .$post('/register/registerEuClientFromScToEu', {
          data: _this.form,
          crm,
          registerData: _this.registerResult,
        })
        .then(function (result) {
          // alert('here continueSubmitInvalidRegionModal 1')
          if (result.success === true) {
            // alert('here continueSubmitInvalidRegionModal 2')
            // console.log('/register/registerEuClientFromScToEu result', result)
            _this.formResponseError = null
            _this.portal = result.crm
            _this.$bvModal.hide('modal-registered-invalid-region')
            _this.redirectToPortal(result.url)
          }
        })
    },
    clearField() {
      this.ResCountry = ''
    },
  },
  head() {
    return {
      title: this.$t('seo.registerNow.title'),
      meta: [
        { hid: 'og:title', property: 'og:title', name: 'og:title', content: this.$t('seo.registerNow.title') },
        { hid: 'description', name: 'description', content: this.$t('seo.registerNow.desc') },
        { hid: 'og:description', property: 'og:description', name: 'og:description', content: this.$t('seo.registerNow.desc') },
        { hid: 'og:image', property: 'og:image', name: 'og:image', content: '/img/preview-img.jpg' },
      ],
    }
  },
  validations: {
    form: {
      clientType: {
        required,
      },
      firstName: {
        required,
        // exists: globalClientType === 'Corporate' ? existsName : existsNameFirstLast,
        latinOnly,
      },
      phoneNumber: {
        required,
      },
      country: {
        required,
      },
      language: {},
      email: {
        required,
        email,
      },
      password: {
        required,
        valid(value) {
          const containsUppercase = /[A-Z]/.test(value)
          const containsLowercase = /[a-z]/.test(value)
          const containsNumber = /[0-9]/.test(value)
          const containsSpecial = /[#?!@$%^&*-]/.test(value)
          return containsUppercase && containsLowercase && containsNumber && containsSpecial
        },
        minLength: minLength(8),
        maxLength: maxLength(16),
      },
      referrer: {
        numeric,
      },
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/colors';
@import '~/assets/scss/variables.scss';

.btn-light {
  background-color: white !important;
}

.contact-form-modal {
  position: relative;
  display: -webkit-box;
  display: grid;
  -webkit-box-align: center;
  align-items: center;
  margin: 30px auto;
  position: relative;
  box-sizing: border-box;
  color: #000;
  background: #fff;
  background-clip: padding-box;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 30px;

  /* &:before {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    z-index: -1;
    border-radius: inherit;
    @include gradient-background;
  } */

  .b-calendar .btn:disabled,
  .b-calendar .btn.disabled,
  .b-calendar .btn[aria-disabled='true'] {
    font-size: 14px;
  }

  .form-control {
    // border-color: #dfe6e9 !important;
  }
}

.register-now {
  .max-680 {
    margin: 0px auto 0px auto !important;
    max-width: 680px;
    @media (min-width: 1200px) {
      margin: 50px auto 0px auto !important;
      max-width: 680px;
    }
    @media (max-width: 992px) {
      margin: 0px auto 0px auto !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    @media (max-width: 768px) {
      margin: -15px auto 0px auto !important;
      max-width: 100% !important;
      width: 100% !important;
    }
  }

  .lang-switcher {
    img {
      margin-bottom: 5px;
    }
  }
  .lang-switcher {
    .nav-item {
      .nav-link {
        color: black !important;
      }
    }
  }

  .nav-item .nav-link {
    color: white !important;
  }

  .li {
    &:focus {
      outline: none;
    }
  }
}

li.lang-switcher {
  list-style-type: none !important;
  margin: -5px 0px 0px 0px;
  padding: 0;
  border-radius: 0px !important;
  img {
    border-radius: 0px;
  }
  a {
    img {
      border-radius: 0px;
    }
  }
}

form {
  @media (max-width: 600px) {
    width: 100% !important;
  }
  .form-group {
    .form-control {
      background-color: rgba(255, 255, 255, 1);
      border: 1px solid silver;
      font-size: 18px;
      line-height: 25px;
      height: 45px;
      color: #000;
      margin-bottom: 20px;

      &::placeholder {
        color: #000;
      }

      &:focus {
        background-color: white;
        border: 0;
        color: #000;
        font-weight: 600;
      }
    }

    &.form-group--error {
      label,
      .custom-checkbox {
        color: $red;
      }
      .form-control,
      .vue-tel-input-wrapper .vue-tel-input {
        color: black;
        border-color: $red !important;
        background-color: white;
      }
    }
  }
  a {
    color: #189bff;
    font-weight: 600;
    text-decoration: none;
  }
  a:hover {
    color: #189bff;
    text-decoration: underline;
  }

  a.btn-outline-light {
    text-decoration: none;
  }

  .form-header {
    margin-bottom: 20px;
    @media (max-width: 1200px) {
      // display: none !important;
    }
  }

  .form-header-left-text {
    font-size: 24px;
  }

  .form-header-right-text {
    font-size: 20px;
  }
  .custom-control-label {
    @media (max-width: 600px) {
      font-size: 12px;
    }
  }
  .input-group-append-white-bg {
    margin: 0px 0px 0px -1px;
    height: 45px !important;
    background: white !important;
  }

  .input-group-append {
    .input-group-text {
      display: flex;
      align-items: center;
      padding: 0.375rem 0.75rem;
      margin-bottom: 0;
      font-size: 1.125rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      text-align: center;
      white-space: nowrap;
      background-color: #fff;
      border-top: 1px solid silver;
      border-bottom: 1px solid silver;
      border-left: 0px solid #fff;
      border-right: 1px solid silver;
      border-top-left-radius: 0px;
      border-top-right-radius: 0.25rem;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0.25rem;
    }
  }

  .form-control-password {
    border-top: 1px solid silver;
    border-bottom: 1px solid silver;
    border-left: 1px solid silver;
    border-right: 0px solid silver !important;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0px;
    height: 45px;
    margin-bottom: 20px;
  }

  .form-bottom-note {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    font-size: 12px;
    @media (max-width: 600px) {
      font-size: 12px;
    }
  }
  .form-terms-conditions {
    font-size: 15px !important;
  }

  .inline-error {
    margin: -10px 0px 0px 0px;
    color: red;
    font-weight: 600;
    font-size: 14px;
    // background: rgba(255, 0, 0, 1);
    // color: white;
    width: 100%;
    padding: 5px 5px;
    border-radius: 3px;
    border-left: 0px solid #ff7faa;
    border-bottom: 0px solid #ff7faa;
    border-top: 0px solid #ff7faa;
  }
  .form-error-message {
    color: $red;
  }
}

.btn:not(.btn-sm) {
  padding: 0px;
}

.form-input-group-error {
  border: 0px solid $red !important;
  .form-control {
    border: 1px solid $red !important;
    height: 45px;
    margin-bottom: 20px;
    border-radius: 5px;
  }

  .form-control-password {
    border-top: 1px solid $red;
    border-bottom: 1px solid $red;
    border-left: 1px solid $red;
    border-right: 0px solid $red !important;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0px;
    height: 45px;
    margin-bottom: 20px;
  }

  .input-group-append {
    .input-group-text {
      display: flex;
      align-items: center;
      padding: 0.375rem 0.75rem;
      margin-bottom: 0;
      font-size: 1.125rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      text-align: center;
      white-space: nowrap;
      background-color: #fff;
      border-top: 1px solid $red;
      border-bottom: 1px solid $red;
      border-left: 0px solid $red;
      border-right: 1px solid $red;
      border-top-left-radius: 0px;
      border-top-right-radius: 0.25rem;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0.25rem;
    }
  }
}

.form-input-group {
  border: 0px solid transparent !important;
  height: 45px;
  margin-bottom: 20px;
  border-radius: 5px;
}
.Residenceicon {
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
}

html[lang='ar-AE'] {
  .input-group-append {
    .input-group-text {
      display: flex;
      align-items: center;
      padding: 0.375rem 0.75rem;
      margin-bottom: 0;
      font-size: 1.125rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      text-align: center;
      white-space: nowrap;
      background-color: #fff;
      border-top: 1px solid silver;
      border-bottom: 1px solid silver;
      border-left: 1px solid silver;
      border-right: 0px solid white;
      border-top-right-radius: 0px;
      border-top-left-radius: 0.25rem;
      border-bottom-right-radius: 0px;
      border-bottom-left-radius: 0.25rem;
    }
  }

  form {
    .form-control-password {
      border-top: 1px solid silver;
      border-bottom: 1px solid silver;
      border-left: 0px solid silver;
      border-right: 1px solid silver !important;
      border-top-left-radius: 0px;
      border-top-right-radius: 0.25rem;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0.25rem;
      height: 45px;
      margin-bottom: 20px;
    }
  }

  form {
    .form-input-group-error {
      .form-control-password {
        border-top: 1px solid #c40233;
        border-bottom: 1px solid #c40233;
        border-left: 0px solid #c40233 !important;
        border-right: 1px solid #c40233 !important;
        border-top-left-radius: 0px;
        border-top-right-radius: 0.25rem;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0.25rem;
        height: 45px;
        margin-bottom: 20px;
      }
      .input-group-append {
        .input-group-text {
          background-color: #fff;
          border-top: 1px solid #c40233;
          border-bottom: 1px solid #c40233;
          border-left: 1px solid #c40233;
          border-right: 0px solid #c40233;
          border-top-right-radius: 0px;
          border-top-left-radius: 0.25rem;
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0.25rem;
        }
      }
    }
  }
}
</style>
