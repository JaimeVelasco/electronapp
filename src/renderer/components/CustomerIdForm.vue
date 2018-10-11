<template>
  <section class="subscription">
    <div class="columns is-centered is-flex-desktop">
      <div class="column is-4">
        <h1 class="title has-text-centered">Subscriptions</h1>
        <div class="field">
          <p class="control has-icons-left">
            <input v-model="subid" v-on:keyup.enter="subsHandler" class="input" type="text" placeholder="Enter Stripe Customer ID">
            <span v-if="valid === 'valid'">
              <span class="icon is-small is-left">
                <i class="fas fa-smile"></i>
              </span>
            </span>
            <span v-if="valid === 'invalid'">
              <span class="icon is-small is-left">
                <i class="fas fa-frown"></i>
              </span>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-success is-pulled-right" @click="subsHandler">
              Submit
            </button>
          </p>
        </div>
      </div>
    </div>
    <div class="columns is-centered is-flex-desktop">
      <div class="column is-3">
        <div v-if="valid === 'invalid'" class="info">
          <p class="subtitle">Invalid Subscription Id.</p>
        </div>
        <div v-if="valid === 'searching'" class="info">
          <p class="subtitle">looking for subs...</p>
        </div>
        <div v-if="valid === 'duplicates'" class="info">
          <p class="subtitle">This subscription has more than one company associated with it.</p>
        </div>
        <div v-if="valid === 'valid'">
          <h1 class="title info">{{company.stripe && company.stripe.customerID}}</h1>
          <p>Company Name: <span class="title is-5">{{company.name}}</span></p>
          <p>Stripe Subscription ID: <span class="title is-5">{{company.stripe && company.stripe.subscriptionID}}</span></p>
          <p>Free Trial Signup Date: <span class="title is-5">{{dateCreated}}</span></p>
          <p>Date Last Used: <span class="title is-5">{{lastTimeUsed}}</span></p>
          <p>Total estimates ever created: <span class="title is-5">{{estimatesTotal}}</span></p>
          <p>Number of estimates created in last 7 days: <span class="title is-5"> {{sevenDayEstimatesTotal}}</span></p>
          <p>Total number of invoices ever created: <span class="title is-5">{{invoicesTotal}}</span></p>
          <p>Number of Invoices created in last 7 days: <span class="title is-5">{{sevenDayInvoicesTotal}}</span></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Companies from './../../models/companies'
import Estimates from './../../models/estimates'
import Invoices from './../../models/invoices'
import Sessions from './../../models/sessions'
import { format, subDays } from 'date-fns'

export default {
  name: 'customer-id-form',
  data () {
    return {
      company: '',
      subid: '',
      dateCreated: '',
      valid: false,
      estimatesTotal: '',
      sevenDayEstimatesTotal: '',
      invoicesTotal: '',
      sevenDayInvoicesTotal: '',
      lastTimeUsed: ''
    }
  },
  created: function () {
    console.log('created')
  },
  methods: {
    subsHandler () {
      let context = this
      context.valid = 'searching'
      Companies.find({ 'stripe.customerID': context.subid })
        .catch(function (err) {
          context.valid = false
          console.log('error ' + err)
        })
        .then(function (sub) {
          console.log('hello')
          if (sub.length === 0) { context.valid = 'invalid' }
          if (sub.length > 1) { context.valid = 'duplicates' }
          context.valid = 'valid'
          context.company = sub[0].toObject()
          context.dateCreated = format(new Date(context.company.dateCreated), 'DD/MM/YYYY')
          Estimates.find({ 'company': context.company._id }).count(function (err, count) {
            if (err) console.log(err)
            context.estimatesTotal = count
          })
          Estimates.find({
            'company': context.company._id,
            'dateCreated': {
              '$gte': subDays(new Date(new Date()), 7)
            }
          }).count(function (err, count) {
            if (err) console.log(err)
            context.sevenDayEstimatesTotal = count
          })
          Invoices.find({ 'company': context.company._id }).countDocuments(function (err, count) {
            if (err) console.log(err)
            context.invoicesTotal = count
          })
          Sessions.find({ 'company': context.company._id })
            .sort({ createdAt: 1 })
            .limit(1).then(sessions => {
              context.lastTimeUsed = format(new Date(sessions[0].dateCreated), 'DD/MM/YYYY')
            })
          Invoices.find({
            'company': context.company._id,
            'dateCreated': {
              '$gte': subDays(new Date(new Date()), 7)
            }
          }).count(function (err, count) {
            if (err) console.log(err)
            context.sevenDayInvoicesTotal = count
          })
        })
    }
  }
}
</script>

<style scoped>
  /* .info {
    margin-top: 5rem;
  } */
</style>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
