'use strict'

const ENV = process.env.NODE_ENV || 'development';
const config = require(`./envs/${ENV}`)

module.exports = {
  PORT: 3000
}
