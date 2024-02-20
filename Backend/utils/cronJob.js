const { CronJob } = require('cron');
const { Op } = require('sequelize');

const Archived_Messages = require('../models/archivedMessage');

const cronJob = CronJob.from({
    cronTime: '0 0 * * *',
    onTick: async function () {
        const Archived_Messages = await Message.findAll({
            where: {
                createdAt: {
                    [Op.lt]: new Date()
                }
            }
        })
        Archived_Messages.forEach(async message => {
            const data = message.toJSON();
            await Archived_Messages.create(data);
            message.destroy();
        })
    },
    start: true,
    timeZone: 'Asia/Kolkata'
})

module.exports = cronJob;

