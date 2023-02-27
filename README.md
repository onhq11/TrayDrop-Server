<div align="center">


<img src="https://github.com/onhq11/TrayDrop/blob/main/img/banner.jpg?raw=true"><br><br>

# TrayDrop Server
Server for Traydrop clipboard synchronization.<br>
**[Install now »](https://github.com/onhq11/TrayDrop-Server#Installation)**<br><br><br>
**[PC Client](https://github.com/onhq11/TrayDrop) · [Docker Container](https://hub.docker.com/r/onhq/traydrop) · [TrayDrop Server](https://github.com/onhq11/TrayDrop-Server) · [Mobile App](https://github.com/onhq11/TrayDrop-Mobile)**

</div><br><br>



## About
TrayDrop is an open-source program that combines clipboard synchronization with fast peer-to-peer data transfer to improve the quaity of the pc-phone ecosystem. For peer-to-peer file transfer, the application uses the already existing [PairDrop](https://github.com/schlagmichdoch/PairDrop) service, and for the clipboard synchronization, its own [TrayDrop Server](https://github.com/onhq11/TrayDrop-Server), which is based on the MongoDB database.

## Features
- Cross-platform clipboard synchronization
- Peer-To-Peer file sharing in background - [PairDrop](https://github.com/schlagmichdoch/PairDrop)
- Option to integrate your own PairDrop server instead of public one - [pairdrop.net](pairdrop.net)
- Auto open the PairDrop window when file received

## Roadmap
- Add other databases than mongodb
- Encryption of clipboard data being sent
- Add compatibility for Linux and Mac OS

## Requirements
- Pre-installed MongoDB (for now, until I complete the first point of the [roadmap](https://github.com/onhq11/TrayDrop-Server#Roadmap))
- Node.js or Docker
- Git

## Installation
- Node.js
    - Clone github repository
        ```
        git clone https://github.com/onhq11/TrayDrop-Server
        ```

    - Rename .env-sample file to .env and change some settings if you want
        ```
        WEBSERVER_PORT - port on which the webserver will run
        DATABASE_TYPE - leave by default
        DATABASE_URL - set your MongoDB URL
        ```

    - Install all required dependencies using npm in terminal
        ```
        npm install
        ```
    
    - Start webserver
        ```
        node index.js
        ```

    - Check if webserver is running
        - Go to http://<server_ip>:8080 and if you got the returned text: "Cannot GET /" server is running, if not check the [Troubleshooting](https://github.com/onhq11/TrayDrop-Server) tab<br><br>

    - If you want to start sever on startup I prefer to use pm2 package, type these commands into the terminal and follow instructions
        ```
        npm install pm2 -g
        pm2 start index.js -n TrayDrop
        pm2 startup
        ```

- Docker
    - Pull Docker image
        ```
        docker pull onhq/traydrop
        ```

    - Run Docker image
        - Default environment
            ```
            docker run -d --name traydrop -p 8080:8080 onhq/traydrop
            ```

        - Custom environment variables (put your data in <>)
            ```
            docker run -d --name traydrop -e DATABASE_URL=<mongodb_url> -p <server_port>:8080 onhq/traydrop
            ```

    - Check if container is running
        - Go to http://<server_ip>:8080 and if you got the returned text: "Cannot GET /" server is running, if not check the [Troubleshooting](https://github.com/onhq11/TrayDrop-Server) tab

## Troubleshooting
- Invalid value (...)<br>
    - This means that the .env file has been incorrectly completed, make sure the .env file looks similar to this
        ```
        WEBSERVER_PORT = 8080

        DATABASE_TYPE = mongodb
        DATABASE_URL = mongodb://192.168.1.90:27017/traydrop
        ```
- [MongoDB] Cannot connect to database: (...)
    - Most often it means that the webserver cannot connect to the database, check if the mongodb database is available from the machine where the server will be running using a Mongo Shell program for example, but also check the logs below this message<br><br>

- [WEBSERVER] Cannot start: (...)
    - Check logs under this line in terminal and google it

## Contributors
The project needs contributors to test the application in terms of privacy, vulnerability and bugs. If so, feel free to [open an issue](https://github.com/onhq11/TrayDrop-Server/issues) or [pull request](https://github.com/onhq11/TrayDrop-Server/pulls) after reading the [Contributing Guidelines](https://github.com/onhq11/TrayDrop-Server/blob/main/CONTRIBUTING.md)

## Authors
- [@onhq11](https://github.com/onhq11)