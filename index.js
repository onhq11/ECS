const fs = require("fs")
const http = require('http')
const { exec } = require('child_process')
let customScripts

const init = () => {
    const config = readConfig()

    if(config.length > 0) {
        startServer(JSON.parse(config))
    }
}

const readConfig = () => {
    return fs.readFileSync("./config/config.json", "utf-8")
}

const startServer = (config) => {
    if(!config.port) {
        console.log(`\n\n\n----------------- CHECK CONFIG (PORT IS INVALID) -----------------\n`)
        return
    }

    const server = http.createServer(requestListener)
    server.listen(config.port, () => {
        console.log(`\n\n\n----------------- SERVER IS RUNNING ON ${config.port} -----------------\n`)

        if(config.startupCommands?.length > 0) {
            config.startupCommands.forEach((command) => {
                execCommand(command)
            })
        }

        if(config.customScripts?.length > 0) {
            customScripts = config.customScripts
        }
    })
}

const requestListener = (req, res) => {
    if(req.url === '/favicon.ico') return
    let error = false

    console.log(`\n----------------- ${req.url} -----------------\n`)

    let webUI = false
    switch (req.url) {
        case "/": {
            fs.readFile('./ui/webui.html', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(`{"status": "error", "details": "failed to open webui"}`);
                } else {
                    let htmlContent = data.toString()
                    if(customScripts?.length > 0) {
                        htmlContent = htmlContent.replace('"{{customScripts}}"', JSON.stringify(customScripts));
                    }

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(htmlContent);
                }
            });
            webUI = true
        }

        case "/light-theme.css":
        case "/dark-theme.css":
        case "/global.css": {
            fs.readFile(`./ui${req.url}`, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(`{"status": "error", "details": "failed to open webui"}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.end(data.toString());
                }
            });
            webUI = true
        }

        case "/iconify/sun.svg":
        case "/iconify/moon.svg": {
            fs.readFile(`./ui${req.url}`, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(`{"status": "error", "details": "failed to open webui"}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
                    res.end(data.toString());
                }
            });
            webUI = true
        }
    }
    if(webUI) return

    const requestBody = req.url.split("/")
    const type = requestBody[1]

    if(type === "gpio") {
        const pin = requestBody[2]
        const action = requestBody[3]

        switch(action) {
            case "export":
                execCommand(`sudo echo ${pin} > /sys/class/gpio/export`)
                break

            case "unexport":
                execCommand(`sudo echo ${pin} > /sys/class/gpio/unexport`)
                break

            case "in":
                execCommand(`sudo echo "in" > /sys/class/gpio/gpio${pin}/direction`)
                break

            case "out":
                execCommand(`sudo echo "out" > /sys/class/gpio/gpio${pin}/direction`)
                break

            case "1":
            case "0":
                execCommand(`sudo echo ${action} > /sys/class/gpio/gpio${pin}/value`)
                break

            default: {
                throwErr(res, `GPIO ACTION IS INVALID ${req.url}`, "gpio action is invalid")
                error = true
            }
        }
    } else {
        if(!customScripts?.length > 0) {
            throwErr(res, `ACTION NOT RECOGNIZED ${req.url}`, "action not recognized")
            return
        }

        const action = customScripts.find((item) => item.trigger === req.url)

        if(!action?.toString()?.length > 0) {
            throwErr(res, `ACTION NOT RECOGNIZED ${req.url}`, "action not recognized")
            return
        }

        execCommand(`bash ${action.path}`)
    }

    if(error) return
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('{"status": "ok"}')
}

const throwErr = (res, text, details) => {
    console.log(`----------------- ${text} -----------------\n`)
    error = true

    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(`{"status": "error", "details": "${details}"}`)
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

init()
