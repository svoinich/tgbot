require('dotenv').config();
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { DiceRoller } = require('dice-roller-parser');

const bot = new Telegraf(process.env.BOT_TOKEN);

const diceRoller = new DiceRoller();

process.setMaxListeners(Infinity);

bot.start((ctx) => {
    let message = ` Please use the /help command to receive a new fact`
    ctx.reply(message)
});

bot.help((ctx) => {
    const message = `Visit this https://www.npmjs.com/package/dice-roller-parser.`
    ctx.reply(message)
});

bot.command('roll', async (ctx) => {
    try {
        var message = '';
        const dicesFromMessage = String(ctx.message.text.split(' ')[1]);
        const roll = diceRoller.roll(dicesFromMessage);
        if (roll.ops) {
            var rolls = roll.dice;
            rolls.forEach(function(dice) {
                if (dice.type === 'die') {
                    var semicolon = '',
                        count = '';
                    if (dice.count.value > 1) {
                        count = dice.count.value;
                    }
                    message += `${count}d${dice.die.value} [`;
                    var dices_semicolon = '';
                    dice.rolls.forEach(function(dice2, index){
                        if (index > 0) {
                            dices_semicolon = ', '
                        }
                        message+= `${dices_semicolon}${dice2.value}`;
                    });
                    message += `]\r\n`;
                }
            });
            rolls.forEach(function(dice, index) {
                if (dice.type === 'number') {
                    message += `Modification: ${roll.ops[index - 1]} ${dice.value}\r\n`;
                }
            });
            message += `Result: ${roll.value}`;
        }
        else
        {
            var semicolon = '',
                count = '';
            if (roll.count.value > 1) {
                count = roll.count.value;
            }
            message += `${count}d${roll.die.value} [`;
            const rolls = roll.rolls;
            rolls.forEach(function(dice, index) {
                if (index > 0) {
                    semicolon = ', ';
                }
                message += `${semicolon}${dice.value}`
            });
            message += `]\r\n`;
        }
        await ctx.telegram.sendMessage(ctx.message.chat.id, message);
    } catch (error) {
        console.log('error', error)
        // await ctx.telegram.sendMessage(ctx.message.chat.id, 'Крик верблюда зовущего на помощь')
    }
});


bot.launch().catch(e => {
    // polling has errored
});


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));