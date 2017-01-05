<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/ms.ccg_node_socket.main.css" rel="stylesheet">
  </head>
  <body>
    <div title>


  <div class="container">
    <div class="jumbotron">
      <h1>CasparCG PHP Timecode Display</h1>
      <p>This example displays the timecode of a clip currently running on a predefined channel and layer on a CasparCG Server using Node and Socket.io</p>
    </div>
    <div class="well countdown">
      <h1 class="info">00:00:00:00 - 00:00:00:00</h1>

      <div class="progress">
        <div class="progress-bar notransition" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
          <span class="sr-only">0% Complete</span>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <hr>
    <div class="divider"></div>

    <div class="row">
      <div class="col-md-3"><a href="https://nodejs.org/en/" target="_blank"><img src="img/logo_nodejs.svg" width="75%"></a></div>
      <div class="col-md-3"><a href="http://php.net/" target="_blank"><img src="img/logo_php.svg" width="75%"></a></div>
      <div class="col-md-3"><a href="http://socket.io/" target="_blank"><img src="img/logo_socket.io.svg" width="75%"></a></div>
      <div class="col-md-3"><a href="http://www.casparcg.com/" target="_blank"><img src="img/logo_casparCG.svg" width="75%"></a></div>
    </div>
    <div class="divider"></div>
    <hr>
    <div class="divider"></div>
    <footer>
  <p>Created by: Jordi Floor || MediaSilo || 05-01-2017</p>
  <p>Contact information: <a href="mailto:info@mediasilo.nl">
  info@mediasilo.nl</a>.</p>
</footer>

  </div>


    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->

    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery-3.1.1.js"></script>
    <script src="js/socket.io.js"></script>
    <script src="js/ms.ccg_node_socket.main.js"></script>
  </body>
</html>
