<div align="center">

# ECS
Server that allows you to control GPIO and execute bash scripts remotely using URL requests<br>
**[Install Now »](https://github.com/onhq11/ExecCommandServer/releases)**<br><br><br>
</div><br><br>

## Requirements
- NodeJS preinstalled

## Installation
- Clone repository
- Enter to folder and execute ```npm i```
- Copy .env.example to .env file ```cp .env.example .env```
- Run server using ```node index.js```

## Configuration
- Open config.json file
- Configure port by changing ```port``` variable
- Configure startup commands according to pattern using ```startupCommands``` variable
- Configure scripts according to the pattern using ```customScripts``` variable
     - trigger: Request URL to execute
     - path: Path to your script

## URL Requests
- Export PIN ```/gpio/<PIN>/export```
- Unexport PIN ```/gpio<PIN>/unexport```
- Set PIN direction to out ```/gpio/<PIN>/out```
- Set PIN direction to in ```/gpio/<PIN>/in```
- Set GPIO state ```/gpio/<PIN>/<1/0>```

## Author
- [@onhq11](https://github.com/onhq11)
