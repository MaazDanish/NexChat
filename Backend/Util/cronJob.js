const { CronJob } = require('cron');
const { Op } = require('sequelize');

const Archived = require('../Models/ArchiedChats');
const Chat = require('../Models/chatModel');

const cronJob = CronJob.from({
    cronTime: '0 0 * * *',
    // cronTime: '*/1 * * * * ',
    onTick: async function () {
        const archivedchats = await Chat.findAll({
            where: {
                createdAt: {
                    [Op.lt]: new Date()
                }
            }
        })
        archivedchats.forEach(async message => {
            // console.log(message);
            console.log(message.toJSON(), 'cron job se ara hai bhaiiiiii----------');
            const data = message.toJSON();
            await Archived.create(data);
            message.destroy();
        })
    },
    start: true,
    timeZone: 'Asia/Kolkata'
})

module.exports = cronJob;

