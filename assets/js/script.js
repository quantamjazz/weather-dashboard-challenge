// OpenWeatherMap API URL and API Key
const apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "a500a862e98ae2fcf6749684aa8a6680"; 
let queryURL;

// DOM elements
const searchBtn = $('#search-button');
const todayWeather = $('#today');
const weatherForecast = $('#forecast');

let cityName;
let cityBtn;

// Array to store user's searched cities
let citiesArray = [];

// Function to handle user input
function getUserInput() {
    // Event listener for search button click
    searchBtn.on('click', function (event) {
        event.preventDefault();
        // Get the value of user input city name
        cityName = $('#search-input').val();
        // Validate user input
        if (!cityName) {
            alert("No city filled out in form! Please, add any city you'd like to check the weather forecast for");
            return;
        }

        // Check if the city name already exists in the array
        const isDuplicate = citiesArray.includes(cityName);

        // Fetch weather data for the selected city
        fetchData();

        // Clear the input field
        $('#search-input').val('');

        // Add city to the array and update UI only if it's not a duplicate
        if (!isDuplicate) {
            citiesArray.push(cityName);
            renderInput();
        }
    });
}

// Function to render user's search history
function renderInput(city) {
    // Clear the search history container
    $('#history').empty();
    // Iterate through the cities array and create buttons
    for (let i = 0; i < citiesArray.length; i++) {
        cityBtn = $('<button>');
        cityBtn.text(citiesArray[i]);
        cityBtn.addClass('list-group-item mb-2 city');
        // Append buttons to the search history container
        $('#history').append(cityBtn);

        // Event listener for city button click
        cityBtn.on('click', function() {
            const selectedCity = $(this).text();
            // Set the selected city as the current city and fetch data
            cityName = selectedCity;
            fetchData();
        });
    }
    // Store the updated city list in local storage
    storeCityList();
}

// Function to store the city list in local storage
function storeCityList() {
    localStorage.setItem('city-names', JSON.stringify(citiesArray));
}

// Function to convert and round temperature from Kelvin to Celsius
function kelvinToCelsius(tempK) {
    // Convert Kelvin to Celsius
    const tempC = tempK - 273.15;

    // Round the temperature
    const roundedCelsius = Math.round(tempC);
    return roundedCelsius;
}

// Function to round wind speed
function roundWindSpeed(windSpeed) {
    // Round the wind speed
    const roundedWindSpeed = Math.round(windSpeed);
    return roundedWindSpeed;
}

// Function to fetch weather data from OpenWeatherMap API
function fetchData() {
    // Clear today weather section 
    todayWeather.empty();
    /// Clear forecast weather section
    weatherForecast.empty();

    // Build the API query URL based on the user input value
    queryURL = apiURL +  cityName + "&appid=" + 'a500a862e98ae2fcf6749684aa8a6680';
    // Fetch data from the API
    fetch(queryURL)
    .then(response => response.json())
    .then(function (data) {
        console.log(data);

        // Populate today's weather
        const todayMain = $('<div>');
        todayMain.addClass('todayMain col-lg-12 col-md-9 col-sm-9 pb-2 mx-auto');

        const todayCardContainer = $('<div>');
        todayCardContainer.addClass('card shadow background-image');

        const todayCard = $('<div>');
        todayCard.addClass('card-body text-left');

        // Create City element as part of the title
        // Create data as a part of a title
        let dateTitleToday = data.list[0].dt_txt;
        dateTitleToday = dayjs().format('ddd, DD MMM');

        let icon = data.list[0].weather[0].icon;
        let iconURL = "https://openweathermap.org/img/w/" + icon + '.png';
        let iconImage = $('<img>');
        iconImage.attr('src', iconURL);

        let todayTitle = $('<h4>');
        todayTitle.text(cityName + " (" + dateTitleToday + ")");
        todayTitle.append(iconImage);
        console.log(todayTitle);

        let temp = kelvinToCelsius(data.list[0].main.temp);
        let p1 = $('<p>').text("Temperature: " + temp + " °C");
        let wind = roundWindSpeed(data.list[0].wind.speed);
        let p2 = $('<p>').text("Wind: " + wind + " KPH");
        let humidity = data.list[0].main.humidity;
        let p3 = $('<p>').text("Humidity: " + humidity + "%");

        todayCard.append(todayTitle);
        todayCard.append(p1, p2, p3);
        todayCardContainer.append(todayCard);
        todayMain.append(todayCardContainer);
        todayWeather.append(todayMain);