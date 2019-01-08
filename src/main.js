const OZW = require('openzwave-shared')
const MQTT = require('mqtt')
const log = require('./log')
const { COMMAND_CLASS } = require('./constants')

const nodes = {}

const zwave = new OZW({
  Logging: process.env.DEBUG === 2,
  ConsoleOutput: true,
  NetworkKey: process.env.ZWAVE_NETWORK_KEY
})
const disconnect = () => zwave.disconnect(process.env.ZWAVE_DEVICE)

const mqtt = MQTT.connect(
  process.env.MQTT_URL,
  { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD }
)

mqtt.on('connect', () => {
  log('mqtt', 'success', 'Connected')
  mqtt.subscribe('zwave/set/#')
  zwave.connect(process.env.ZWAVE_DEVICE)
})

process.on('SIGINT', () => {
  log('mqtt-zwave', 'warning', 'Exiting...')
  disconnect()
  process.exit(0)
})

mqtt.on('message', async (topic, message) => {
  console.log('message', topic, message)
})

zwave.on('driver ready', function (homeid) {
  console.log(`Scanning ${homeid}`)
})

zwave.on('driver failed', function () {
  zwave.disconnect()
  process.exit()
})

zwave.on('node added', function (nodeId) {
  nodes[nodeId] = {}
})

zwave.on('node ready', (nodeId, nodeInfo) => {
  nodes[nodeId]['info'] = nodeInfo
})

zwave.on('value added', function (nodeId, classId, value) {
  const { value_id: valueId } = value
  nodes[nodeId][valueId] = value
  console.log(`Added value for node ${nodeId} with command classId ${classId}`)
})

zwave.on('value changed', (nodeId, classId, value) => {
  console.log('Value changed', nodeId, classId)
  const { value_id: valueId } = value
  nodes[nodeId][valueId] = value

  const update = {
    ...nodes[nodeId][valueId],
    class_name: COMMAND_CLASS[classId]
  }

  console.log({ update })

  mqtt.publish(`zwave/update/${nodeId}`, JSON.stringify(update))
})

zwave.on('scan complete', () => {
  console.log('complete')
})
