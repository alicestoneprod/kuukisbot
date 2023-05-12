const weather = require('openweather-apis');
const ownKey = '550f3c04fdcb23cdcb3ad42f6392fd92'
const axios = require('axios');



const express = require('express');
const app = express();

// Ручка для проверки доступности сервера
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');

  // Функция, отправляющая запрос каждые 5 минут
  function keepServerAlive() {
    // Используйте модуль http или axios для отправки запроса
    const http = require('http');
    const options = {
      host: 'localhost',
      port: 8080,
      path: '/'
    };

    const req = http.request(options, (res) => {
      console.log('Keep-alive request sent');
    });

    req.on('error', (err) => {
      console.error('An error occurred:', err.message);
    });

    req.end();
  }

  // Отправка первого запроса сразу при запуске сервера
  keepServerAlive();

  // Отправка запросов каждые 5 минут (300 000 миллисекунд)
  setInterval(keepServerAlive, 1500000);
});

let time = new Date();


weather.setLang('ru');
weather.setUnits('metric');
weather.setAPPID(ownKey);

var fs = require(`fs`);



const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5815916630:AAEiDTwGIYkxLVwLqp_ZPZTyIQFzpSrNvwc';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.

let themes = '18+, про мента, 4, для друзей'

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text == 'Как дела?') {
    bot.sendMessage(chatId, 'Хорошо!')
  } else if ((msg.text.toLowerCase() == 'кубик')||  (msg.text.toLowerCase() == '/cube')) {
    bot.sendDice(chatId)
  } else if ((msg.text.toLowerCase() == 'ару') || (msg.text.toLowerCase() == 'ору')){
    bot.sendMessage(chatId, 'Орут, когда ебут')
  }
  else if ((msg.text.toLowerCase() == 'решка') || (msg.text.toLowerCase() == 'орёл') || (msg.text.toLowerCase() == '/orel') || (msg.text.toLowerCase() == '/reshka') || (msg.text.toLowerCase() == 'орел')){
    const i = Math.round(Math.random());
    if (i == 1){
      bot.sendMessage(chatId, 'Выпала Решка')
    }
    else{
      bot.sendMessage(chatId, 'Выпал Орёл')
    }
      
    }
    else if ((msg.text.toLowerCase() == 'алиса помощь') || (msg.text.toLowerCase() == '/help') || (msg.text.toLowerCase() == '/start')){
      bot.sendMessage(chatId, `Список моих команд: 
      🪙 <b>Орёл/решка</b>  - бросить орла или решку;
      🎲 <b>Кубик</b> - бросить кубик;
      ❓ <b>Алиса помощь</b> - открыть список доступных возможностей;
      ⛅️ <b>Погода Москва</b> - узнать температуру воздуха в г.Москва, на месте параметра Москва может быть любой другой город, например, Санкт-Петербург.
      💵 <b>Доллар</b> - узнать курс доллара;
      💶 <b>Евро</b> - Узнать курс евро;
      🪙 <b>Биткоин</b> - Узнать курс биткоина;
      😹 <b>Анекдот</b> для друзей - сгенерировать анекдот на тему "для друзей"; можно выбрать и любые другие доступные темы: <b>18+</b>, <b>про мента</b>, <b>4</b> (4 сборник), <b>для друзей</b>. Список будет пополняться!



      🔺Служебное:
      /chatid - узнать ID чата и логин пользователя`, {parse_mode: 'HTML'})
    }
    else if ((msg.text.toLowerCase() == '/chatid')){
      bot.sendMessage(chatId, `ID чата: ${chatId} \nлогин пользователя: ${msg.chat.username}
      `)
    }
    


    else if (msg.text.toLowerCase().includes('погода')) {
      if (msg.text.toLowerCase() == 'погода') {
        bot.sendMessage(chatId, 'Пожалуйста, укажите город.');
      } else {
        let massiv = msg.text.split(' ');
        let cityName = massiv[1];
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=550f3c04fdcb23cdcb3ad42f6392fd92`)
          .then(response => {
            weather.setCity(cityName);
            weather.getTemperature(function(err, temp){
              if (err) {
                bot.sendMessage(chatId, `Ошибка: ${err}`);
              } else {
                bot.sendMessage(chatId, `Температура воздуха в г.${cityName} = ${Math.round(temp)+2} °C`);
              }
            });
            
          })
          .catch(error => {
            bot.sendMessage(chatId, `Не удалось получить информацию о погоде для г.${cityName}. Попробуйте еще раз позднее.`);
            
          });
      }
    }
    else if ((msg.text.toLowerCase() == '/btc') || (msg.text.toLowerCase() == 'биткоин')) {
      fetch('https://blockchain.info/ru/ticker')
        .then(response => response.json())
        .then(data => {
          const priceRUB = data.RUB.sell;
          const priceUSD = data.USD.sell;
          const priceEUR = data.EUR.sell;
          
          const message = `\n<b>Стоимость BTC на настоящий момент</b>:
          <b>В рублях:</b> ${Math.round(priceRUB)} ₽
          <b>В долларах:</b> ${Math.round(priceUSD)} 💵
          <b>В евро:</b>  ${Math.round(priceEUR)} 💶`;
    
          bot.sendMessage(chatId, message, {parse_mode: 'HTML'});
        })
        .catch(error => {
          console.error(error);
        });
    }
    else if ((msg.text.toLowerCase() == '/usd') || (msg.text.toLowerCase() == 'доллар'))
           fetch('https://www.cbr-xml-daily.ru/daily_json.js')
           .then(response => response.json())
           .then(data1 => {
            const USD = data1.Valute.USD.Value
            bot.sendSticker(chatId, 'CAACAgIAAxkBAAEI8ytkXSG-Btp4D_zdLdG2Brcb5na85gAC8QEAAladvQohKm5i6iYv7i8E')
            bot.sendMessage(chatId, 'Вычисляю курс доллара...')
            let msgId = (msg.message_id+2)
            setTimeout(() => {
              bot.sendMessage(chatId, `Стоимость 1 💵 <b>Доллара</b> на текущий момент:\n ➤ ${USD.toFixed(2)} <b>рублей.</b>`, {parse_mode: 'HTML'} )
            }, 3000);
            setTimeout(() => {
              bot.deleteMessage(chatId, msgId)
              bot.deleteMessage(chatId, msgId-1)
            }, 3500);
           })
           .catch(error => {
            console.error(error);
          });
    else if ((msg.text.toLowerCase() == '/eur') || (msg.text.toLowerCase() == 'евро'))
          fetch('https://www.cbr-xml-daily.ru/daily_json.js')
          .then(response => response.json())
          .then(data1 => {
           const EUR = data1.Valute.EUR.Value
           bot.sendSticker(chatId, 'CAACAgIAAxkBAAEI8ytkXSG-Btp4D_zdLdG2Brcb5na85gAC8QEAAladvQohKm5i6iYv7i8E')
           bot.sendMessage(chatId, 'Вычисляю курс евро...')
           let msgId = (msg.message_id+2)
           setTimeout(() => {
            bot.sendMessage(chatId, `Стоимость 1 💶 <b>Евро</b> на текущий момент:\n ➤ ${EUR.toFixed(2)} <b>рублей.</b>`, {parse_mode: 'HTML'})
           }, 3000);
           
           setTimeout(() => {
            bot.deleteMessage(chatId, msgId)
            bot.deleteMessage(chatId, msgId-1)
          }, 3500);
         })
          .catch(error => {
           console.error(error);
         });
         else if ((msg.text.toLowerCase() == '/anek_friend') || (msg.text.toLowerCase() == 'анекдот для друзей')){
          fs.readFile('анекдоты_для_друзей.txt', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
          
            // Разделяем содержимое файла на строки и сохраняем их в массив
            const jokes = data.split('* * *');
          
            // Генерируем случайный индекс в массиве анекдотов
            const randomIndex = Math.floor(Math.random() * jokes.length);
            const resultanekdot = `${jokes[randomIndex]}`
            bot.sendMessage(chatId, resultanekdot)
          })}
          else if ((msg.text.toLowerCase() == '/anek_ment') || (msg.text.toLowerCase() == 'анекдот про мента')){
            fs.readFile('анекдоты_про_мента.txt', 'utf8', (err, data) => {
              if (err) {
                console.error(err);
                return;
              }
            
              // Разделяем содержимое файла на строки и сохраняем их в массив
              const jokes = data.split('* * *');
            
              // Генерируем случайный индекс в массиве анекдотов
              const randomIndex = Math.floor(Math.random() * jokes.length);
              const resultanekdot = `${jokes[randomIndex]}`
              bot.sendMessage(chatId, resultanekdot)
            })}
            else if ((msg.text.toLowerCase() == '/anek_18+') || (msg.text.toLowerCase() == 'анекдот 18+')){
              fs.readFile('анекдоты_18+.txt', 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  return;
                }
              
                // Разделяем содержимое файла на строки и сохраняем их в массив
                const jokes = data.split('* * *');
              
                // Генерируем случайный индекс в массиве анекдотов
                const randomIndex = Math.floor(Math.random() * jokes.length);
                const resultanekdot = `${jokes[randomIndex]}`
                bot.sendMessage(chatId, resultanekdot)
              })}
              else if ((msg.text.toLowerCase() == '/anek_4') || (msg.text.toLowerCase() == 'анекдот 4')){
                fs.readFile('анекдоты_4.txt', 'utf8', (err, data) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                
                  // Разделяем содержимое файла на строки и сохраняем их в массив
                  const jokes = data.split('\n');
                
                  // Генерируем случайный индекс в массиве анекдотов
                  const randomIndex = Math.floor(Math.random() * jokes.length);
                  const resultanekdot = `${jokes[randomIndex]}`
                  bot.sendMessage(chatId, resultanekdot)
                })}
                else if ((msg.text.toLowerCase() == '/anek') || (msg.text.toLowerCase() == 'анекдот')){
                  bot.sendMessage(chatId, `Пожалуйста, укажите тему анекдота. Например, Анекдот для друзей. Доступные темы: ${themes}, этот же список можно получить при вводе команды /help.`)
                  }
          
              fs.appendFile('logs.txt', `\nСообщение: '${msg.text}' было получено в ${time.getHours()}h ${time.getMinutes()}m- ${time.getDay()}.${time.getMonth()}.${time.getFullYear()} и написано пользователем @${msg.chat.username}`, (err) => {})});

            
    
                