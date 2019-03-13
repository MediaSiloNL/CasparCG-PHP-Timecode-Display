# CasparCG PHP Timecode Display
This tool displays the timecode of a clip currently running on a predefined channel and layer on a CasparCG Server using Node and Socket.io

As I was working on my custom made playout client system for CasparCG I came across the problem of displaying the runtime of an active movie.
In the first versions of the system I tried to display the timecode by starting a Javascript timer, it kind of worked but was off by multiple seconds in the end.
Because I didn't want to have program a C# or VB client and for every client to just run it in their browser I started to experiment with Node and Socket.io.

## Installation:
- Place the files from the "NodeJS" folder on the CasparCG in a folder which you can access from NodeJS
- Place or upload the files from the "Public" on your webserver (I'm running WAMP on the same server as CasparCG)
- Change NodeJS Server settings to your settings in: "CCG.SocketIO.Config.js"
- Change Client settings to your settings in: "Public/js/MS.NodeJS-CCG.js"
- Start NodeJS Application/Server (node CCG.SocketIO.Server.js)
- Go to index.php
- Voila!! Start media by pressing "Play"

## Updates:
- Completely reworked the server application
- Compatibility with the newest CasparCG releases (OSC has been changed)
- Updated all packages to the latest version
- Updated to Bootstrap 4.3.1
- Added Font Awesome for the web display
- Added media controls to to web display
- Reworked timing (different sorts of timing deliverance via SocketIO)
- Fixed timing display. (clears when disconnected or playing has stopped)

## Minimal Requirements
- Windows 7 / Linux Server with a running instance of CasparCG (I'm using Windows 10 + CasparCG Server 2.2)
- NodeJS installed on mentioned server
- Webserver or WAMP installation

## Node installation
- NodeJS needs to be fully installed.
- "ccg_node_socket.server.js" is the actual app but it needs the following dependencies (included in the NodeJS folder):
- "casparcg-connection": "^4.6.1"
- "dgram": "^1.0.1"
- "express": "^4.16.4"
- "osc-min": "^1.1.1"
- "request": "^2.88.0"
- "socket.io": "^2.2.0"
- "terminal-kit": "^1.27.0"
- "timexe": "^0.9.13"
- "tslib": "^1.9.3"

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
