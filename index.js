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
    const instLink = process.env.INSTAGRAM_URL;
    try {
        await bot.sendMessage(msg.chat.id, helloMsg, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "💫 Instagram", url: `${process.env.INSTAGRAM_LINK}`}],
                    [{text: "💫 Телеграмм канал", url: `${process.env.MAIN_TGK_LINK}`}],
                    [{text: "💫 Купить миникурс за 15000 тг", callback_data: "mini_course"}],
                    [{text: "💫 Анкета предзаписи на программу максимум", url: `${process.env.ANKETA_URL}`}],
                ]
            },
        });
        setTimeout(async () => {
            await bot.sendMessage(msg.chat.id, thirdMsg, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Whatsapp", url: process.env.WHATSAPP_LINK}]
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
                            [{text: "Whatsapp", url: process.env.WHATSAPP_LINK}]
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