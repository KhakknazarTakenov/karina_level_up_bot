// import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { commands, helloMsg, prepaymentMsg, thirdMsg, fourthMsg, fifthMsg } from './global.js';

import TelegramBot from 'node-telegram-bot-api';
import {logMessage} from "./logger/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

/*
* Implement Website/Bot functionality to configure bot content
* */
// const app = express();
// const PORT = process.env.PORT;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: {
        interval: 300,
        autoStart: true
    }
});

bot.setMyCommands(commands);

bot.on("polling_error", err => logMessage("error", "polling_error", err.data.error.message));

bot.onText(/\/start/, async msg => {
    try {
        await bot.sendMessage(msg.chat.id, helloMsg, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "💫 Instagram", url: "https://www.instagram.com/karina_kaiir?igsh=MTF4YTJlOXI3dHJ3eQ%3D%3D&utm_source=qr"}],
                    [{text: "💫 Телеграмм канал", url: "https://t.me/+I9jRi6BI_I81NjVi"}],
                    [{text: "💫 Купить миникурс за 15000 тг", callback_data: "mini_course"}],
                    [{text: "💫 Анкета предзаписи на программу максимум", callback_data: "anketa"}],
                ]
            },
        });
        setTimeout(async () => {
            await bot.sendMessage(msg.chat.id, thirdMsg, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Whatsapp", url: "https://wa.me/77753399949"}]
                    ]
                }
            });
        }, 3 * 60 * 60 * 1000);
        setTimeout(async () => {
            await bot.sendMessage(msg.chat.id, fourthMsg, { parse_mode: "HTML" });
        }, 6 * 60 * 60 * 1000);
        setTimeout(async () => {
            await bot.sendMessage(msg.chat.id, fifthMsg, { parse_mode: "HTML" });
        }, 24 * 60 * 60 * 1000);
    }
    catch(error) {
        logMessage("error", "Start message error", error)
    }
})

bot.on("callback_query", async ctx => {
    try {
        switch(ctx.data) {
            case "mini_course":
                await bot.sendMessage(ctx.message.chat.id, prepaymentMsg, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Whatsapp", url: "https://wa.me/77753399949"}]
                        ]
                    }
                })
                break;
        }
    }
    catch(error) {
        logMessage("error", "Callback Query error", error)
    }
})