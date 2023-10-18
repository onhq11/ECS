<div align="center">

<img src="https://github.com/onhq11/ECS/blob/main/ui/img/banner.png?raw=true" style="border-radius: 20px"><br><br>

# ECS
Server that allows you to control GPIO and execute bash scripts remotely using URL requests<br>
**[Install Now »](https://github.com/onhq11/ECS/releases)**<br><br><br>
</div><br><br>

## Requirements
### Local installation
- NodeJS preinstalled
### Docker container
- Make (optional)

## Installation
### Local installation
- Clone repository
- Enter to folder and execute ```npm i```
- Prepare config.json from config folder according to pattern or [Configuration](#configuration) section
- Run server using ```node index.js```
- Open browser and type [http://localhost:<YOUR_WEBSERVER_PORT>](http://localhost:8080) or execute chosen command from [URL Requests](#url-requests) section and enjoy!
### Docker container
- Clone repository
- Enter to folder and copy .docker.env.example as .docker.env ```cp .docker.env.example .docker.env```
- Open .docker.env file ```nano .docker.env``` and choose your webserver port and config volume (path on local machine)
- Prepare config.json from config folder according to pattern or [Configuration](#configuration) section
- Copy config.json to your config volume
- Run container:
  - If you have make installed run ```make up```
  - In other scenarios run ```docker compose --env-file .docker.env up -d```
- Open browser and type [http://localhost:<YOUR_WEBSERVER_PORT>](http://localhost:8080) or execute chosen command from [URL Requests](#url-requests) section and enjoy!
- Available commands for docker container if you have make installed:
  - ```make up``` - Create container
  - ```make down``` - Remove container
  - ```make start``` - Start container
  - ```make stop``` - Stop container

## Configuration
- Open config.json file
- Configure port by changing ```port``` variable
- Configure startup commands according to pattern using ```startupCommands``` variable
- Configure scripts according to the pattern using ```customScripts``` variable
     - trigger: Request URL to execute
     - path: Path to your script

## URL Requests
- Export PIN ```/gpio/<PIN>/export```
- Unexport PIN ```/gpio/<PIN>/unexport```
- Set PIN direction to out ```/gpio/<PIN>/out```
- Set PIN direction to in ```/gpio/<PIN>/in```
- Set GPIO state ```/gpio/<PIN>/<1/0>```

## Author
- [@onhq11](https://github.com/onhq11)
