# CasparCG PHP Timecode Display
This tool displays the timecode of a clip currently running on a predefined channel and layer on a CasparCG Server using Node and Socket.io

As I was working on my custom made playout client system for CasparCG I came across the problem of displaying the runtime of an active movie.
In the first versions of the system I tried to display the timecode by starting a Javascript timer, it kind of worked but was off by multiple seconds in the end.
Because I didn't want to have program a C# or VB client and for every client to just run it in their browser I started to experiment with Node and Socket.io.

## Installation:
- Place the files from the "NodeJS" folder on the CasparCG in a folder which you can access from NodeJS
- Place or upload the files from the "Public" on your webserver (I'm running WAMP on the same server as CasparCG)
- Change NodeJS Server settings to your settings in: "ccg_node_socket.server.js"
- Change Client settings to your settings in: "Public/js/ms.ccg_node_socket.main.js"
- Start NodeJS Application/Server
- Go to index.php
- Voila!!

## Minimal Requirements
- Windows 7 / Linux Server with a running instance of CasparCG
- NodeJS installed on mentioned server
- Webserver or WAMP installation

## Node installation
- NodeJS needs to be fully installed.
- "ccg_node_socket.server.js" is the actual app but it needs the following dependencies (included in the NodeJS folder):
- "express": "~4.14.0"
- "socket.io": "^1.7.2"
- "caspar-cg": "0.1.0"
- "body-parser": "~1.15.2"

- Package.Json is included if you want to install it yourself

### Future Options
- XML Settings file
- Multiple channel/layer monitoring
- Monitoring page (clientside)

### Used Software packages
- CasparCG
- PHP
- NodeJS
- Socket.io
- Composer
- NPM


![alt tag](https://github.com/MediaSiloNL/CasparCG-PHP-Timecode-Display/blob/master/Readme/screenshot.png)
