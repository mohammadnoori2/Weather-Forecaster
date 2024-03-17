 $(document).ready(function () {
    $.ajax({
        type: "GET",
        url: 'js/cities.csv', // Update the URL to point to the cities.csv file in the same folder
        dataType: "text",
        success: function (data) {
            console.log("Data received:", data);
            processData(data);
        },
        error: function () {
            console.log('Error loading the cities.csv file');
        }
    }); 
    // Event listener for city selection
    $('#citySelect').on('change', function() {
        var selectedCity = $(this).val();
        console.log("Selected city:", selectedCity);
        
        // Call function to fetch weather data for the selected city
        fetchWeather(selectedCity);
    });
});
function processData(data) {
    var cities = data.split('\n');
    
    // Skip the first line as it contains column headers
    for (var i = 1; i < cities.length; i++) {
        var cityData = cities[i].split(',');
        var cityName = cityData[2]; // City name is at index 2 in the line
        
        $('#citySelect').append('<option value="' + cityName + '">' + cityName + '</option>');
    }
}
// Function to fetch weather data for a given city
function fetchWeather(city) {
    // Read the CSV file to get longitude and latitude for the selected city
    $.ajax({
        type: "GET",
        url: "js/cities.csv", // Update the URL to point to your CSV file
        dataType: "text",
        success: function (data) {

            processData1(city, data); // Call function to process CSV data and fetch weather
        },
        error: function () {
            console.log('Error loading the cities.csv file');
        }
    });
}

function processData1(city, csvData) {
    // Split CSV data into rows
    var rows = csvData.split('\n');
    
    // Find the row corresponding to the selected city
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i].split(',');
        var cityName = row[2];
        
        if (cityName === city) {
            var lon = row[1];
            var lat = row[0];
            
            // Fetch weather data using lon and lat
            $.ajax({
                type: "GET",
                url: "http://www.7timer.info/bin/api.pl",
                data: {
                    lon: lon,
                    lat: lat,
                    product: "civillight",
                    output: "json"
                },
                dataType: "json",
                success: function (data) {
                    console.log("Weather data for " + city + ":", data);
                    displayWeather(city, data); // Call function to display weather data
                },
                error: function () {
                    console.log('Error fetching weather data for ' + city);
                }
            });
            
            break; // Stop searching for the city once found
        }
    }
}


// Function to display weather data on the webpage
function displayWeather(city, weatherData) {
    // Clear previous weather information
    $('#weatherInfo').empty();

    // Iterate over forecast data for the next 7 days
    for (var i = 0; i < weatherData.dataseries.length; i++) {
        var forecast = weatherData.dataseries[i];
        var dateStr = forecast.date.toString(); // Convert numerical date to string
        
        // Extract year, month, and day components
        var year = dateStr.substring(0, 4);
        var month = dateStr.substring(4, 6);
        var day = dateStr.substring(6, 8);

        // Construct formatted date string with slashes
        var formattedDate = year + '/' + month + '/' + day;

        var weather = forecast.weather;
        var maxTemperature = forecast.temp2m.max;
        var minTemperature = forecast.temp2m.min;
        
        // Create HTML elements for displaying forecast data
        var weatherInfoHTML = '<div class="weather-card">' +
                                '<div class="weather-parameter"><span class="parameter-label">Date:</span> <span class="parameter-value">' + formattedDate + '</span></div>' +
                                '<div class="weather-parameter"><span class="parameter-label">City:</span> <span class="parameter-value">' + city + '</span></div>' +
                                '<div class="weather-parameter"><span class="parameter-label">Max Temperature:</span> <span class="parameter-value">' + maxTemperature + '°C</span></div>' +
                                '<div class="weather-parameter"><span class="parameter-label">Min Temperature:</span> <span class="parameter-value">' + minTemperature + '°C</span></div>' +
                                '<div class="weather-parameter"><span class="parameter-label">Weather:</span> <span class="parameter-value">' + weather + '</span></div>' +
                                '<img src="images/' + weather + '.png" alt="Weather Icon">' + // Include the image based on weather condition
                              '</div>';

        // Append the forecast information to the weather section
        $('#weatherInfo').append(weatherInfoHTML);
    }

    // Show the weather section
    $('.weather-part').show();
}
