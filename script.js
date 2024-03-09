// script.js

const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const temperature_chart = document.getElementById('temperature-chart');
const ambient_temperature = document.getElementById('ambient-temperature');

async function fetchMobileTemperature() {
    // Simulated function to fetch mobile temperature
    // Here, we generate a random temperature between 20°C and 40°C
    return Math.floor(Math.random() * (40 - 20 + 1)) + 20;
}

async function checkWeather(city) {
    const api_key = "6c422181bd9bc59854c3eec850aee89f";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(`${url}`).then(response => response.json());

    if (weather_data.cod === `404`) {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        console.log("error");
        return;
    }

    console.log("run");
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

    // Fetch mobile temperature
    const mobileTemperature = await fetchMobileTemperature();

    // Calculate ambient room temperature
    const localTemperature = Math.round(weather_data.main.temp - 273.15);
    const ambientRoomTemperature = (localTemperature + mobileTemperature) / 2;

    // Update UI with ambient room temperature
    ambient_temperature.innerHTML = `${ambientRoomTemperature}°C`;

    // Use Chart.js to plot local temperature and mobile temperature
    plotTemperatureChart(localTemperature, mobileTemperature);
}

function plotTemperatureChart(localTemperature, mobileTemperature) {
    const ctx = temperature_chart.getContext('2d');
    const temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Local Temperature', 'Mobile Temperature'],
            datasets: [{
                label: 'Temperature',
                data: [localTemperature, mobileTemperature],
                backgroundColor: [
                    'rgba(255, 255, 255, 0.2)', // White background for the graph
                    'rgba(255, 255, 255, 0.2)'// Blue for mobile temperature
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            weight: 'bold' // Bold font for y-axis labels
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            weight: 'bold' // Bold font for x-axis labels
                        }
                    }
                }
            }
        }
    });
}


searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// Initial fetch on page load (optional)
// Replace 'defaultCity' with your preferred default city
const defaultCity = 'London';
checkWeather(defaultCity);
