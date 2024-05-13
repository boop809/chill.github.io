<!DOCTYPE html>
<html>
<head>
    <title>IP Address, Location, and Time Zone</title>
</head>
<body>
    <h1>H2cked By Chill And Group Black Hawks / كرمال راشد العنزي</h1>
    
    <p id="ipAddress"></p>
    <p id="location"></p>
    <p id="timeZone"></p>

    <script>
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                document.getElementById("ipAddress").innerText = "Your IP Address: " + data.ip;
            });

        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                document.getElementById("location").innerText = "Your Location: " + data.city + ", " + data.region + ", " + data.country_name;
                document.getElementById("timeZone").innerText = "Your Time Zone: " + data.timezone;
            });
    </script>
</body>
</html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- For responsiveness --> 
    <title>H2ced By Grop Black Hawks</title>  <!-- Set title as H2ced By Grop Black Hawks -->  				     	         </head>  <body style="background: #000; color: white; font-family: Arial, sans-serif; text-align: center; padding: 50px 0;"><img src='https://media.discordapp.net/attachments/1138623769112485949/12397228473041556
