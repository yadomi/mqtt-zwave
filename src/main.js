const OZW = require('openzwave-shared')

const zwave = new OZW({
  Logging: process.env.DEBUG,
  ConsoleOutput: true,
  NetworkKey: process.env.ZWAVE_NETWORK_KEY
})

const mqtt = MQTT.connect(
  process.env.MQTT_URL,
  { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD }
)

mqtt.on('connect', () => {
  log('mqtt', 'success', 'Connected')
  mqtt.subscribe('zwave/set/#')
})

process.on('SIGINT', () => {
  log('mqtt-zwave', 'warning', 'Exiting...')
  zwave.disconnect(process.env.ZWAVE_DEVICE)
  process.exit(0)
})

mqtt.on('message', async (topic, message) => {
  console.log('message', topic, message)
})

zwave.on('driver ready', (...args) => {
  console.log('driver ready', args)
})
zwave.on('driver failed', (...args) => {
  console.log('driver failed', args)
})
zwave.on('node added', (...args) => {
  console.log('node added', args)
})
zwave.on('node ready', (...args) => {
  console.log('node ready', args)
})
zwave.on('value added', (...args) => {
  console.log('value added', args)
})
zwave.on('value changed', (...args) => {
  console.log('value changed', args)
})
zwave.on('scan complete', (...args) => {
  console.log('scan complete', args)
})
zwave.on('notification', (...args) => {
  console.log('notification', args)
})

start()
