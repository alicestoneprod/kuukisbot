import weather from "openweather-apis"
const WeatherKey = "550f3c04fdcb23cdcb3ad42f6392fd92"

const cityName = "Москва"

weather.setLang("ru")
weather.setUnits("metric")
weather.setAPPID(WeatherKey)
weather.setCity("Moscow")

let weatherResult = new Object()

fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WeatherKey}`
)
  .then((response) => response.json())
  .then((data) => {
    weatherResult = data
    console.log(Температура в городе `weatherResult.main.temp, weatherResult.main.humidity`)
  })
