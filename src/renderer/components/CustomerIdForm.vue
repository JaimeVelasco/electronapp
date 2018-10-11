<template>
  <div class="container is-flex-tablet level">
    <section class="subscription levelitem">
      <div class="box">
        <div class="columns is-centered">
          <div class="column has-text-centered is-7">
            <img class="logo" src="~@/assets/logo.png" alt="mtrx logo" width="200px">
            <h1 class="subtitle has-text-centered">Enter Stripe's CustomerID to get the company info</h1>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-6">
            <div class="field">
              <p class="control has-icons-left">
                <input v-model="subid" v-on:keyup.enter="subsHandler" class="input" type="text" placeholder="Enter Stripe Customer ID" autofocus>
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
                <span v-if="valid === 'invalid'">
                  <p class="subtitle">Invalid Customer Id</p>
                </span>
                <span v-if="valid === 'searching'">
                  <p class="subtitle">Waiting for response</p>
                </span>
                <span v-if="valid === 'duplicates'">
                  <p class="subtitle">This Customer ID has more than one company associated with it</p>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="columns is-centered is-flex-desktop">
          <div class="column is-6">
            <div v-if="valid === 'valid'">
              <p class="title is-4">{{company.name}}</p>
              <p>Free Trial Signup Date: <span class="title is-6">{{dateCreated}}</span></p>
              <p>Date Last Used: <span class="title is-6">{{lastTimeUsed}}</span></p>
              <p>Total estimates ever created: <span class="title is-6">{{estimatesTotal}}</span></p>
              <p>Number of estimates created in last 7 days: <span class="title is-6"> {{sevenDayEstimatesTotal}}</span></p>
              <p>Most recent estimate created on: <span class="title is-6"> {{mostRecentEstimate}}</span></p>
              <p>Total number of invoices ever created: <span class="title is-6">{{invoicesTotal}}</span></p>
              <p>Number of Invoices created in last 7 days: <span class="title is-6">{{sevenDayInvoicesTotal}}</span></p>
              <p>Most recent invoice created on: <span class="title is-6"> {{mostRecentInvoice}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
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
      lastTimeUsed: '',
      mostRecentEstimate: '',
      mostRecentInvoice: ''
    }
  },
  created: function () {
    // console.log('created')
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
          if (sub.length === 0) return context.valid = 'invalid'
          if (sub.length > 1) return context.valid = 'duplicates'
          context.valid = 'valid'
          context.company = sub[0].toObject()
          context.dateCreated = format(new Date(context.company.dateCreated), 'MMMM Do YYYY')
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
          Invoices.find({ 'company': context.company._id })
            .sort({ createdAt: 1 })
            .limit(1).then(invoices => {
              context.mostRecentInvoice = format(new Date(invoices[0].dateCreated), 'MMMM Do YYYY')
            })
          Estimates.find({ 'company': context.company._id })
            .sort({ createdAt: 1 })
            .limit(1).then(estimates => {
              context.mostRecentEstimate = format(new Date(estimates[0].dateCreated), 'MMMM Do YYYY')
            })
          Sessions.find({ 'company': context.company._id })
            .sort({ createdAt: 1 })
            .limit(1).then(sessions => {
              context.lastTimeUsed = format(new Date(sessions[0].dateCreated), 'MMMM Do YYYY')
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

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .logo {
    margin: 1rem;
    display: flex;
    align-items: center;
  }

  .aligner {
    display: flex;

  }

  .subscription {
    margin: 1rem auto;
    width: 80vw;
    min-height: 50vh;
  }
</style>
