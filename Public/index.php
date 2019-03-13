<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CasparCG PHP Timecode Display</title>

    <!-- Add Bootstrap -->
    <link rel="stylesheet" href="./plugins/bootstrap/css/bootstrap.min.css">

    <!-- Add FontAwesome -->
    <link rel="stylesheet" href="./plugins/font-awesome/css/all.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="./css/ms.ccg_node_socket.main.css">
</head>
<body>

    <div class="container">
        <div class="jumbotron text-center">
            <h1 class="display-4">CasparCG PHP Timecode Display</h1>
            <p class="lead">This example displays the timecode of a clip currently running on a predefined channel and layer on a CasparCG Server using Node and Socket.io</p>
        </div>

        <div class="row justify-content-center">
            <div class="col-8">
                <div class="card" id="infobox">
                    <div class="card-body bg-light text-center">
                        <div class="row">
                            <div class="col-4" id="current">Current Time: <h1>00:00:00:00</h1></div>
                            <div class="col-4" id="remaining">Countdown: <h1>00:00:00:00</h1></div>
                            <div class="col-4" id="duration">Duration: <h1>00:00:00:00</h1></div>
                        </div>
                        <div class="progress mb-4">
                            <div class="progress-bar notransition" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;" id="progress"></div>
                        </div>
                        <div class="row">
                            <div class="col text-center">
                                <button id="uiAction" action="play"><i class="fas fa-play"></i> Play</button>
                                <button id="uiAction" action="pause"><i class="fas fa-pause"></i> Pause</button>
                                <button id="uiAction" action="stop"><i class="fas fa-stop"></i> Stop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>

        <hr class="mb-5">

        <div class="row text-center mb-5">
            <div class="col-3"><a href="https://nodejs.org/en/" target="_blank"><img src="img/logo_nodejs.svg" width="75%"></a></div>
            <div class="col-3"><a href="http://php.net/" target="_blank"><img src="img/logo_php.svg" width="75%"></a></div>
            <div class="col-3"><a href="http://socket.io/" target="_blank"><img src="img/logo_socket.io.svg" width="75%"></a></div>
            <div class="col-3"><a href="http://www.casparcg.com/" target="_blank"><img src="img/logo_casparCG.svg" width="75%"></a></div>
        </div>
        <hr class="mb-5">
        <footer>
            <p><b>Created by: Jordi Floor | MediaSilo</b><br>Contact information: <a href="mailto:info@mediasilo.nl">info@mediasilo.nl</a>.</p>
            <p>Created: 05-01-2017 | Updated: 13-03-2019</p>
        </footer>
    </div>    

    <!-- Core Libraries -->
    <script src="./plugins/jquery/jquery-3.3.1.js"></script>
    <script src="./plugins/bootstrap/js/bootstrap.min.js"></script>    
    <script src="./plugins/socket-io/socket.io.js"></script>

    <!-- Custom Script -->
    <script src="./js/MS.NodeJS-CCG.js"></script>
</body>
</html>