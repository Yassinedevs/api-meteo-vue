import express from 'express';
import { createServer } from 'http';
import fetch from 'node-fetch';

const app = express();
const server = createServer(app);

server.listen(4040);
console.log('Server is listening on port 4040');

const apiKey = '0f4e041a5101377b8a5c00b47acf3520';
const cache = {};

function renderWeather(weather) {
    return {
        cityName: weather.name,
        country: weather.sys.country,
        temperature: Math.round(weather.main.temp),
        description: weather.weather[0].description,
        lowTemp: Math.round(weather.main.temp_min),
        highTemp: Math.round(weather.main.temp_max),
        feelsLike: Math.round(weather.main.feels_like),
        humidity: Math.round(weather.main.humidity)
      };
}

function fetchWeather(city, res) {
  if (cache[city]) { // Vérifie si les données sont déjà en cache
    console.log('From cache:', cache[city]);
    renderWeather(cache[city]);
    return;
  }

  // Les données ne sont pas en cache, effectuer la requête à l'API Weather
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log('From API:', data);
      // Enregistrer les données dans le cache pour la prochaine fois
      cache[city] = data;
      renderWeather(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Erreur serveur');
    });
}

app.get('/:city', (req, res) => {
  const city = req.params.city;
  fetchWeather(city, res);
});
