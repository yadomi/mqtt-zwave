# mqtt-zwave

## ⚠️ No stable release are available yet

`mqtt-zwave` is a bridge layer that forward zwave events on a mqtt network.

It support both status advertising and setting values.

## Usage:

`mqtt-zwave` need environment variables to be set to run correctly, below are required variables:

| Variable            | Description                                                                                                  | Required |
| ------------------- | :----------------------------------------------------------------------------------------------------------- | :------: |
| `ZWAVE_DEVICE`      | Path to Zwave device supported by OpenZwave such as Aeon Lab Z-Stick, eg (`/dev/ttyUSB0`)                    |    ✅    |
| `ZWAVE_NETWORK_KEY` | Specify a key for secure devices that support it, such as door senors. See below for how to generate the key |    ✅    |
| `MQTT_URL`          | MQTT URL, must include protocol (such as `mqtt://`, `ws://`, `wss://` ect) and port.                         |    ✅    |
| `MQTT_USERNAME`     | MQTT username for authentication, if necessary.                                                              |          |
| `MQTT_PASSWORD`     | MQTT password for authentication, if necessary.                                                              |          |
| `DEBUG`             | Set to 1 to log stack trace on errors.                                                                       |          |

Here is an example one to start `mqtt-zwave`:

```bash
$ ZWAVE_DEVICE=/dev/ttyUSB0 \
ZWAVE_NETWORK_KEY="0xC3, 0x4A, 0x8B, 0xD5, 0x51, 0x89, 0x8B, 0xA2, 0xB9, 0x59, 0xB0, 0x13, 0xF8, 0xA3, 0x79, 0xA5" \
MQTT_URL=mqtt://localhost:1883 \
MQTT_USERNAME=mqttuser  \
MQTT_PASSWORD=mqttpassword \
yarn start
```

## How to generate a network key

```
cat /dev/urandom | tr -dc '0-9A-F' | fold -w 32 | head -n 1 | sed -e 's/\(..\)/0x\1, /g'
```

## Usage in Docker

`mqtt-zwave` have be coded with Docker in mind. There is an auto-builded image available at https://hub.docker.com/r/yadomi/mqtt-zwave.

This allow to run the application in a Docker container like so, by forwading the USB device:

```bash
docker run --rm -it \
    --device=/dev/USB0 \
    -e ZWAVE_DEVICE=/dev/ttyUSB0 \
    -e ZWAVE_NETWORK_KEY="0xC3, 0x4A, 0x8B, 0xD5, 0x51, 0x89, 0x8B, 0xA2, 0xB9, 0x59, 0xB0, 0x13, 0xF8, 0xA3, 0x79, 0xA5" \
    -e MQTT_URL=mqtt://localhost:1883 \
    -e MQTT_USERNAME=mqttuser  \
    -e MQTT_PASSWORD=mqttpassword \
    --name mqtt-zwave yadomi/mqtt-zwave:latest
```
