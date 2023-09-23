const http = require('http')
const { exec } = require('child_process')

const port = 41420
const customScripts = [
    {trigger: "/tv_on", path: "/home/onhq/tvScripts/tv_on.sh"},
    {trigger: "/tv_off", path: "/home/onhq/tvScripts/tv_off.sh"}
]
const startupCommands = [
    `sudo echo 20 > /sys/class/gpio/export`,
    `sudo echo "out" > /sys/class/gpio/gpio20/direction`,
    `sudo echo 21 > /sys/class/gpio/export`,
    `sudo echo "out" > /sys/class/gpio/gpio21/direction`
]

const initialStartup = () => {
    startupCommands.forEach((command) => {
        execCommand(command)
    })
}

const execCommand = async (command) => {
    await exec(command, (err, stdout, stderr) => {
        if(err) {
            console.log('ERR: '+err.message)
            return
        }

        if(stderr) {
            console.log('STDERR: '+stderr)
            return
        }

        console.log(`Command executed successfuly: ${command}\n\nOUT: ${stdout}`)
        return
    })
}

const requestListener = (req, res) => {
    if(req.url === '/favicon.ico') return

    console.log(`\n\n----------------- ${req.url} -----------------\n`)

    const requestType = req.url.split(/[0-9]+/)[0];
    const pin = req.url.match(/\d+/);
    const state = req.url.match(/-(\d+)/)?.[1];

    switch(requestType) {
        case "/export":
            execCommand(`sudo echo ${pin} > /sys/class/gpio/export`)
            break

        case "/unexport":
            execCommand(`sudo echo ${pin} > /sys/class/gpio/unexport`)
            break

        case "/in":
            execCommand(`sudo echo "in" > /sys/class/gpio/gpio${pin}/direction`)
            break

        case "/out":
            execCommand(`sudo echo "out" > /sys/class/gpio/gpio${pin}/direction`)
            break

        case "/gpio":
            execCommand(`sudo echo ${state} > /sys/class/gpio/gpio${pin}/value`)
            break

        default: {
            const requestedScript = customScripts.find(item => item.trigger === req.url)
            execCommand("bash "+requestedScript.path)
        }
    }

    res.writeHead(200)
    res.end('OK')
}

const server = http.createServer(requestListener)
server.listen(port, () => {
    console.log(`\n\n\n----------------- SERVER IS RUNNING ON ${port} -----------------\n`)
    initialStartup()
})