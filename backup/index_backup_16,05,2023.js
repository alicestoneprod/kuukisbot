const { ownKey, token, themes, time, trackToken } = require("./constants")

const weather = require("openweather-apis")
const axios = require("axios")

weather.setLang("ru")
weather.setUnits("metric")
weather.setAPPID(ownKey)

var fs = require(`fs`)

const TelegramBot = require("node-telegram-bot-api")
const { resolve } = require("path")

const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id

  bot.sendMessage(chatId, resp)
})

bot.on("message", (msg) => {
  const chatId = msg.chat.id
  if (msg.text == "Как дела?") {
    bot.sendMessage(chatId, "Хорошо!")
  } else if (
    msg.text.toLowerCase() == "кубик" ||
    msg.text.toLowerCase() == "/cube"
  ) {
    bot.sendDice(chatId)
  } else if (
    msg.text.toLowerCase() == "ару" ||
    msg.text.toLowerCase() == "ору"
  ) {
    bot.sendMessage(chatId, "Орут, когда ебут")
  } else if (
    msg.text.toLowerCase() == "монетка" ||
    msg.text.toLowerCase() == "/coin"
  ) {
    const i = Math.round(Math.random())
    if (i == 1) {
      bot.sendMessage(chatId, "Выпала Решка.")
    } else {
      bot.sendMessage(chatId, "Выпал Орёл.")
    }
  } else if (
    msg.text.toLowerCase() == "алиса помощь" ||
    msg.text.toLowerCase() == "/help" ||
    msg.text.toLowerCase() == "/start"
  ) {
    bot.sendMessage(
      chatId,
      `Список моих команд: 
      🪙 <b>Монетка</b>  - подбросить монетку
      🎲 <b>Кубик</b> - бросить кубик;
      ❓ <b>Алиса помощь </b> - открыть список доступных возможностей. (также доступно через /help);
      💵 <b>Доллар</b> - узнать курс доллара;
      💶 <b>Евро</b> - узнать курс евро;
      🪙 <b>Биткоин</b> - узнать курс биткоина;
      🆕😹 <b>Анекдот</b> - сгенерировать случайный анекдот;
      🆕😹 <b>Анекдот</b> <i>для друзей</i> - сгенерировать анекдот на тему "для друзей"; можно выбрать и любые другие доступные темы: <b>18+</b>, <b>про мента</b>, <b>4</b> (4 сборник), <b>для друзей</b>. Список будет пополняться!
      🆕⛅️ <b>Прогноз Москва</b> - узнать прогноз погоды в г.Москва, на месте параметра Москва может быть любой другой город, например, Санкт-Петербург;
      🆕☀️ <b>Погода Москва</b> - узнать температуру воздуха в г.Москва, на месте параметра Москва может быть любой другой город, например, Санкт-Петербург;
      🆕🍀 <b>Шанс</b> <i>текст</i> - узнать вероятность события от 1 до 100 в процентах.

      🔺Служебное:
      /chatid - узнать ID чата и логин пользователя`,
      { parse_mode: "HTML" }
    )
  } else if (msg.text.toLowerCase() == "/chatid") {
    bot.sendMessage(
      chatId,
      `ID чата: ${chatId} \nлогин пользователя: ${msg.chat.username}
      `
    )
  } else if (msg.text.toLowerCase().includes("прогноз")) {
    if (msg.text.toLowerCase() == "прогноз") {
      bot.sendMessage(chatId, "Пожалуйста, укажите город.")
    } else {
      let massiv = msg.text.split(" ")
      let cityName = massiv[1]
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            cityName
          )}&appid=550f3c04fdcb23cdcb3ad42f6392fd92`
        )
        .then((response) => {
          let forecastList = response.data.list

          let forecastText = `Прогноз погоды в г.${cityName} на 5 дней:\n\n`

          for (let i = 0; i < forecastList.length; i += 8) {
            let forecastDate = new Date(forecastList[i].dt * 1000)
            let forecastTemp =
              Math.round(forecastList[i].main.temp - 273.15) + 2
            let forecastDescription = forecastList[i].weather[0].description

            // Перевод описания погоды
            if (forecastDescription === "overcast clouds") {
              forecastDescription = "пасмурно"
            } else if (forecastDescription === "broken clouds") {
              forecastDescription = "облачно с прояснениями"
            } else if (forecastDescription === "light rain") {
              forecastDescription = "небольшой дождь"
            } else if (forecastDescription === "few clouds") {
              forecastDescription = "слегка облачно"
            } else if (forecastDescription === "scattered clouds") {
              forecastDescription = "переменная облачность"
            } else if (forecastDescription === "clear sky") {
              forecastDescription = "ясно"
            }

            forecastText += `${forecastDate.toLocaleDateString("ru-RU", {
              weekday: "short",
            })}: ${forecastTemp}°C, ${forecastDescription}\n`
          }

          bot.sendMessage(chatId, forecastText)
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            `Не удалось получить прогноз погоды для г.${cityName}. Убедитесь, что вы правильно указали город, либо попробуйте еще раз позднее.`
          )
        })
    }
  } else if (msg.text.toLowerCase().includes("погода")) {
    if (msg.text.toLowerCase() == "погода") {
      bot.sendMessage(chatId, "Пожалуйста, укажите город.")
    } else {
      let massiv = msg.text.split(" ")
      let cityName = massiv[1]
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            cityName
          )}&appid=550f3c04fdcb23cdcb3ad42f6392fd92`
        )
        .then((response) => {
          weather.setCity(cityName)
          weather.getTemperature(function (err, temp) {
            if (err) {
              bot.sendMessage(chatId, `Ошибка: ${err}`)
            } else {
              bot.sendMessage(
                chatId,
                `Температура воздуха в г.${cityName} = ${
                  Math.round(temp) + 2
                } °C`
              )
            }
          })
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            `Не удалось получить информацию о погоде для г.${cityName}. Попробуйте еще раз позднее.`
          )
        })
    }
  } else if (
    msg.text.toLowerCase() == "/btc" ||
    msg.text.toLowerCase() == "биткоин"
  ) {
    fetch("https://blockchain.info/ru/ticker")
      .then((response) => response.json())
      .then((data) => {
        const priceRUB = data.RUB.sell
        const priceUSD = data.USD.sell
        const priceEUR = data.EUR.sell

        const message = `\n<b>Стоимость BTC на настоящий момент</b>:
          <b>В рублях:</b> ${Math.round(priceRUB)} ₽
          <b>В долларах:</b> ${Math.round(priceUSD)} 💵
          <b>В евро:</b>  ${Math.round(priceEUR)} 💶`

        bot.sendMessage(chatId, message, { parse_mode: "HTML" })
      })
      .catch((error) => {
        console.error(error)
      })
  } else if (
    msg.text.toLowerCase() == "/usd" ||
    msg.text.toLowerCase() == "доллар"
  )
    fetch("https://www.cbr-xml-daily.ru/daily_json.js")
      .then((response) => response.json())
      .then((data1) => {
        const USD = data1.Valute.USD.Value
        bot.sendSticker(
          chatId,
          "CAACAgIAAxkBAAEI8ytkXSG-Btp4D_zdLdG2Brcb5na85gAC8QEAAladvQohKm5i6iYv7i8E"
        )
        bot.sendMessage(chatId, "Вычисляю курс доллара...")
        let msgId = msg.message_id + 2
        setTimeout(() => {
          bot.sendMessage(
            chatId,
            `Стоимость 1 💵 <b>Доллара</b> на текущий момент:\n ➤ ${USD.toFixed(
              2
            )} <b>рублей.</b>`,
            { parse_mode: "HTML" }
          )
        }, 3000)
        setTimeout(() => {
          bot.deleteMessage(chatId, msgId)
          bot.deleteMessage(chatId, msgId - 1)
        }, 3500)
      })
      .catch((error) => {
        console.error(error)
      })
  else if (msg.text.toLowerCase() == "/eur" || msg.text.toLowerCase() == "евро")
    fetch("https://www.cbr-xml-daily.ru/daily_json.js")
      .then((response) => response.json())
      .then((data1) => {
        const EUR = data1.Valute.EUR.Value
        bot.sendSticker(
          chatId,
          "CAACAgIAAxkBAAEI8ytkXSG-Btp4D_zdLdG2Brcb5na85gAC8QEAAladvQohKm5i6iYv7i8E"
        )
        bot.sendMessage(chatId, "Вычисляю курс евро...")
        let msgId = msg.message_id + 2
        setTimeout(() => {
          bot.sendMessage(
            chatId,
            `Стоимость 1 💶 <b>Евро</b> на текущий момент:\n ➤ ${EUR.toFixed(
              2
            )} <b>рублей.</b>`,
            { parse_mode: "HTML" }
          )
        }, 3000)

        setTimeout(() => {
          bot.deleteMessage(chatId, msgId)
          bot.deleteMessage(chatId, msgId - 1)
        }, 3500)
      })
      .catch((error) => {
        console.error(error)
      })
  else if (
    msg.text.toLowerCase() == "/anek_friend" ||
    msg.text.toLowerCase() == "анекдот для друзей"
  ) {
    fs.readFile("анекдоты_для_друзей.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      const jokes = data.split("* * *")

      const randomIndex = Math.floor(Math.random() * jokes.length)
      const resultanekdot = `${jokes[randomIndex]}`
      bot.sendMessage(chatId, resultanekdot)
    })
  } else if (
    msg.text.toLowerCase() == "/anek_ment" ||
    msg.text.toLowerCase() == "анекдот про мента"
  ) {
    fs.readFile("анекдоты_про_мента.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      const jokes = data.split("* * *")

      const randomIndex = Math.floor(Math.random() * jokes.length)
      const resultanekdot = `${jokes[randomIndex]}`
      bot.sendMessage(chatId, resultanekdot)
    })
  } else if (
    msg.text.toLowerCase() == "/anek_18+" ||
    msg.text.toLowerCase() == "анекдот 18+"
  ) {
    fs.readFile("анекдоты_18+.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      const jokes = data.split("* * *")

      const randomIndex = Math.floor(Math.random() * jokes.length)
      const resultanekdot = `${jokes[randomIndex]}`
      bot.sendMessage(chatId, resultanekdot)
    })
  } else if (
    msg.text.toLowerCase() == "/anek_4" ||
    msg.text.toLowerCase() == "анекдот 4"
  ) {
    fs.readFile("анекдоты_4.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      const jokes = data.split("\n")
      const randomIndex = Math.floor(Math.random() * jokes.length)
      const resultanekdot = `${jokes[randomIndex]}`
      bot.sendMessage(chatId, resultanekdot)
    })
  } else if (
    msg.text.toLowerCase() == "/anek" ||
    msg.text.toLowerCase() == "анекдот"
  ) {
    fs.readFile("анекдоты.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      const jokes = data.split("* * *")
      const randomIndex = Math.floor(Math.random() * jokes.length)
      const resultanekdot = `${jokes[randomIndex]}`
      bot.sendMessage(chatId, resultanekdot)
    })
  } else if (msg.text.toLowerCase() == "help") {
    bot.sendMessage(
      chatId,
      "Вероятно, вам необходима помощь? Тогда используйте команду /help."
    )
  } else if (msg.text.toLowerCase().includes("шанс")) {
    if (msg.text.toLowerCase() === "шанс") {
      bot.sendMessage(
        chatId,
        "Пожалуйста, введите событие, вероятность которого вы хотите узнать."
      )
    } else {
      const checkMsgChance = msg.text.split(" ")
      if (checkMsgChance[0] === "шанс" || checkMsgChance[0] === "Шанс") {
        // Генерация случайного числа от 1 до 100 с округлением:
        const randomChance = Math.floor(Math.random() * 100) + 1
        if (randomChance >= 85 && randomChance <= 100) {
          bot.sendMessage(chatId, `Все верно.`)
        } else {
          bot.sendMessage(chatId, `Вероятность события - ${randomChance}%. `)
        }
      }
    }
  }

  fs.appendFile(
    "logs.txt",
    `\nСообщение: '${
      msg.text
    }' было получено в ${time.getHours()}h ${time.getMinutes()}m - ${time.getDay()}.${time.getMonth()}.${time.getFullYear()} и написано пользователем @${
      msg.chat.username
    }`,
    (err) => {}
  )
})

bot.on("message", (msg) => {
  const chatId = msg.chat.id

  if (msg.text.toLowerCase() === "/report") {
    isReporting = true
    // writeReportIn(isReporting)
    bot.sendMessage(
      chatId,
      `🔧 Пожалуйста, опишите проблему, с которой вы столкнулись, и предоставьте все доступные подробности. Это поможет нам быстрее исправить ошибку.

📸 Вы также можете приложить скриншот к своему сообщению.

❗<b><i>Пожалуйста, не используйте команды бота (кроме /exit и слова отмена) во время отправки отчета, в этом нет смысла.</i></b>.

⚠️ В случае, если вы случайно сюда попали или передумали, пожалуйста, напишите слово <b>отмена</b> или введите команду <b>/exit</b>`,
      { parse_mode: "HTML" }
    )
  } else if (
    isReporting &&
    msg.text.toLowerCase() !== "отмена" &&
    msg.text.toLowerCase() !== "/exit"
  ) {
    bot.sendMessage(
      chatId,
      `✅📧 Сообщение было принято для обработки и успешно отправлено создателю бота.

🚀 Команда /start - просмотреть список доступных команд и продолжить взаимодействие с ботом.`
    )
    bot.sendMessage(-1001911341493, `<b>Поступил новый report:</b>`, {
      parse_mode: "HTML",
    })
    bot.forwardMessage(-1001911341493, chatId, msg.message_id)
    isReporting = false
    // writeReportIn(isReporting)
  } else if (
    isReporting &&
    (msg.text.toLowerCase() === "отмена" || msg.text.toLowerCase() === "/exit")
  ) {
    isReporting = false
    // writeReportIn(isReporting)
    bot.sendMessage(
      chatId,
      `⚠️ Вы вышли из меню отправки репорта.

📌 Если у вас возникли дополнительные вопросы или проблемы, не стесняйтесь обращаться.

📩 Вы можете отправить сообщение с описанием проблемы или вопроса, и мы постараемся вам помочь.

🔧 Спасибо за использование нашего бота!😊📮`
    )
  }
})

// const writeReportIn = function (isReporting) {
//   fs.writeFile("reportStatus.txt", isReporting.toString(), (err) => {
//     if (err) {
//       console.error("Ошибка при записи файла:", err)
//       return
//     }
//   })
// }

// const checkStatus = function () {
//   return new Promise((resolve, reject) => {
//     fs.readFile("reportStatus.txt", "utf-8", (err, data) => {
//       if (err) {
//         console.error("Ошибка!", err)
//         reject(err)
//       }

//       let isReported = data
//       resolve(isReported)
//     })
//   })
// }
