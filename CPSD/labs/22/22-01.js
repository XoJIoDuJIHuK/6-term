const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('subscribers.db');
const bot = new Telegraf('6945470233:AAFFHPdrdBWwhrTYylEj6dw7rHNfA_VuRyE');
const weatherAPIKey = '830172a06879c2fab7e302c5a3dc0909';

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY
      )
    `);
  });

bot.start((ctx) => ctx.reply('Привет! Я бот, который отправляет случайные факты. Используйте команду /subscribe для подписки на ежедневные факты.'));

bot.hears(/привет/i, (ctx) => {
    ctx.replyWithSticker('CAACAgIAAxkBAAEE8K9mJ9plHSFOOw_83wQr5SB88SDiwAAC-RAAAhz6yUuaM5DK0jWSkjQE');
});

bot.hears(/пока/i, (ctx) => {
    ctx.replyWithSticker('CAACAgIAAxkBAAEE8KdmJ9npbNXIHOOQshJJ8EwP2qpyEAACuUAAApF3EUsEB18kdo9RAAE0BA');
});

bot.hears(/не\s+смешно/i, (ctx) => {
    ctx.replyWithSticker('CAACAgIAAxkBAAEE8KNmJ9jMA9UC0mHssDFsu_UjlPV4gwACXUwAAiUDMEmKFXfUT19szTQE');
});

bot.hears(/^(?!\/\w+)/, (ctx) => {
    const messageText = ctx.message.text;
    ctx.reply(`Вы написали: ${messageText}`);
});

bot.command('subscribe', (ctx) => {
    const userId = ctx.message.from.id;
    db.get('SELECT * FROM subscribers WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Error checking user subscription:', err);
            ctx.reply('Произошла ошибка при проверке подписки.');
        } else {
            if (user) {
                ctx.reply('Вы уже подписаны на ежедневные факты.');
            } else {
                db.run('INSERT INTO subscribers (id) VALUES (?)', [userId], (err) => {
                    if (err) {
                        console.error('Error subscribing user:', err);
                        ctx.reply('Произошла ошибка при подписке на ежедневные факты.');
                    } else {
                        ctx.reply('Вы подписались на ежедневные факты!');
                    }
                });
            }
        }
    });
});

bot.command('unsubscribe', (ctx) => {
    const userId = ctx.message.from.id;
    db.get('SELECT * FROM subscribers WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Error checking user subscription:', err);
            ctx.reply('Произошла ошибка при проверке подписки.');
        } else {
            if (user) {
                db.run('DELETE FROM subscribers WHERE id = ?', [userId], (err) => {
                    if (err) {
                        console.error('Error unsubscribing user:', err);
                        ctx.reply('Произошла ошибка при отписке от ежедневных фактов.');
                    } else {
                        ctx.reply('Вы отписались от ежедневных фактов.');
                    }
                });
            } else {
                ctx.reply('Вы не подписаны на ежедневные факты.');
            }
        }
    });
});

cron.schedule('*/1 * * * *', async () => {
    try {
        const subscribers = await getAllSubscribers();
        subscribers.forEach(async (subscriber) => {
            try {
                const randomFact = await getRandomFact();
                bot.telegram.sendMessage(subscriber.id, randomFact)
                    .then(() => console.log(`Сообщение отправлено подписчику ${subscriber.id}`))
                    .catch((error) => console.error(`Ошибка при отправке сообщения подписчику ${subscriber.id}: ${error.message}`));
            } catch (error) {
                console.error(`Ошибка при получении случайного факта: ${error.message}`);
            }
        });
    } catch (error) {
        console.error(`Ошибка при получении списка подписчиков из базы данных: ${error.message}`);
    }
});


  

bot.command('joke', async (ctx) => {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        const joke = response.data;
        ctx.reply(`${joke.setup}\n${joke.punchline}`);
    } catch (error) {
        console.error('Error fetching joke:', error);
        ctx.reply('Извините, не удалось получить случайную шутку.');
    }
});


bot.command('weather', async (ctx) => {
    const city = ctx.message.text.split(' ').slice(1).join(' '); 
    if (!city) {
        ctx.reply('Пожалуйста, укажите город в формате /weather [название_города]');
        return;
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}&units=metric`);

        const { main, wind, sys, weather } = response.data;
        const temperature = main.temp;
        const humidity = main.humidity;
        const pressure = main.pressure;
        const windSpeed = wind.speed;
        const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString('ru-RU');
        const sunset = new Date(sys.sunset * 1000).toLocaleTimeString('ru-RU');
        const duration = (sys.sunset - sys.sunrise) / 3600;

        ctx.reply(`Погода в городе ${city}:
        Температура: ${temperature}°C
        Влажность: ${humidity}%
        Давление: ${pressure} hPa
        Скорость ветра: ${windSpeed} м/с
        Время восхода солнца: ${sunrise}
        Время заката солнца: ${sunset}
        Продолжительность дня: ${duration.toFixed(1)} ч`);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        ctx.reply('Извините, не удалось получить информацию о погоде для указанного города.');
    }
});

bot.command('cat', async (ctx) => {
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const catImageUrl = response.data[0].url;
        await ctx.replyWithPhoto({ url: catImageUrl });
    } catch (error) {
        console.error('Error fetching cat image:', error);
        ctx.reply('Извините, не удалось получить изображение кота.');
    }
});

bot.command('besyanya', async (ctx) => {
    ctx.replyWithSticker('CAACAgIAAxkBAAEE8P5mJ-ZRcdwk260BgNBuD2ZNdO_sbQACzEEAAhwRqElVslhfKH4jCTQE');
});


async function getRandomFact() {
    try {
        const response = await axios.get('https://cat-fact.herokuapp.com/facts/random');
        const fact = response.data.text;
        return fact;
    } catch (error) {
        console.error('Error fetching random fact:', error);
        return 'Произошла ошибка при получении случайного факта.';
    }
}


async function getAllSubscribers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM subscribers', (err, rows) => {
            if (err) {
                console.error('Ошибка при получении подписчиков:', err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

bot.launch();
