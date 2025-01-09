datalogger.onLogFull(function () {
    full = true
    while (full) {
        logger.sendBuffer(_full)
        basic.showString("F")
        if (input.buttonIsPressed(Button.A)) {
            logger.sendBuffer(_empty)
            control.reset()
        }
    }
})
radio.onReceivedBuffer(function (receivedBuffer) {
    if (logger.parseIncomingData(receivedBuffer) == 0) {
        basic.showString("T")
        receivedTempLevel = logger.storeTemp(receivedBuffer)
        logMessage = "Temp received"
        datalogger.log(datalogger.createCV("Message", logMessage))
    } else if (logger.parseIncomingData(receivedBuffer) == 1) {
        basic.showString("L")
        receivedLightLevel = logger.storeLight(receivedBuffer)
        logMessage = "Light received"
        datalogger.log(datalogger.createCV("Message", logMessage))
    } else {
        message = receivedBuffer
    }
})
let logMessage = ""
let full = false
let error = ""
let startSent = false
let waiting = false
let notReady = false
let receivedLightLevel = ""
let receivedTempLevel = ""
let message: Buffer = null
let _empty: Buffer = null
let _full: Buffer = null
let watchdogLimit = 600000
let lastActionTime = input.runningTime()
let _request = logger.stringToBuffer("request")
_full = logger.stringToBuffer("full")
_empty = logger.stringToBuffer("empty")
message = logger.none()
receivedTempLevel = logger.none()
receivedLightLevel = logger.none()
let _ready = logger.stringToBuffer("ready")
let _start = logger.stringToBuffer("start")
let _ack = logger.stringToBuffer("ack")
radio.setGroup(23)
radio.setTransmitPower(7)
let _req = logger.stringToBuffer("request")
while (true) {
    notReady = true
    waiting = true
    if (!(startSent)) {
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _request)) {
            logger.sendBuffer(_ready)
            startSent = true
        }
        if (input.buttonIsPressed(Button.AB)) {
            logger.sendBuffer(_start)
            startSent = true
            lastActionTime = input.runningTime()
            basic.showString("S")
            basic.clearScreen()
        } else {
            continue;
        }
    }
    while (notReady) {
        basic.pause(100)
        if (message != logger.none() && logger.compareBuffers(message, _request)) {
            logger.sendBuffer(_ack)
        }
        if (message != logger.none() && logger.compareBuffers(message, _ready)) {
            basic.showString("R")
            basic.clearScreen()
            notReady = false
            logger.sendBuffer(_ack)
            lastActionTime = input.runningTime()
            while (waiting) {
                basic.pause(100)
                if (message != logger.none() && logger.compareBuffers(message, _request)) {
                    logger.sendBuffer(_ack)
                }
                if (receivedTempLevel != logger.none() && receivedLightLevel != logger.none()) {
                    datalogger.log(
                    datalogger.createCV("Temperature", receivedTempLevel),
                    datalogger.createCV("Light", receivedLightLevel)
                    )
                    waiting = false
                    lastActionTime = input.runningTime()
                    basic.showString("D")
                    basic.clearScreen()
                }
            }
        }
        if (input.runningTime() - lastActionTime > watchdogLimit) {
            error = "Ready Timeout"
            datalogger.log(datalogger.createCV("Error", error))
        }
        while (input.runningTime() - lastActionTime > watchdogLimit) {
            logger.sendBuffer(_request)
            basic.pause(5000)
            if (message != logger.none() && logger.compareBuffers(message, _ready)) {
                lastActionTime = input.runningTime()
            }
        }
    }
    control.waitMicros(600000000)
    message = logger.none()
    receivedTempLevel = logger.none()
    receivedLightLevel = logger.none()
    lastActionTime = input.runningTime()
    if (input.runningTime() - lastActionTime > watchdogLimit) {
        error = "EOL Timeout"
        datalogger.log(datalogger.createCV("Error", error))
    }
    while (input.runningTime() - lastActionTime > watchdogLimit) {
        logger.sendBuffer(_request)
        basic.pause(5000)
        if (message != logger.none() && logger.compareBuffers(message, _ready)) {
            lastActionTime = input.runningTime()
        }
    }
}
