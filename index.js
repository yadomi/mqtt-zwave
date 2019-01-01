const { difference, keys } = require('ramda')
const log = require('./src/log')

process.on('uncaughtException', error => {
  log('mqtt-zwave', 'error', error.message)
  if (process.env.DEBUG) console.error(error)

  process.exit(2)
})

const guard = () => {
  const required = ['ZWAVE_DEVICE', 'ZWAVE_NETWORK_KEY', 'MQTT_URL', 'MQTT_USERNAME', 'MQTT_PASSWORD']
  const unset = difference(required, keys(process.env))

  if (unset.length) {
    throw new Error(`Env variable ${unset.join(', ')} must be set`)
  }
}

guard()
require('./src/main')
