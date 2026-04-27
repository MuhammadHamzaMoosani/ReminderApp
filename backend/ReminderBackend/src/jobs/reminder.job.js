const cron = require("node-cron");
const Task = require("../models/task.model");
//const { sendWhatsApp } = require("../utils/whatsapp");
const { sendWhatsAppReminder } = require("../whatsApp/message");
const User = require("../models/user.model");
// const reminderJob = () => {
//   cron.schedule("* * * * *", async () => {
//     const now = new Date();
//     const dueTasks = await Task.find({
//       remindAt: { $lte: now },
//       reminded: false,
//       completed: false,
//     }).populate("user");

//     for (const task of dueTasks) {
//       if (!task.user.wantsTaskReminders) continue;

//       await sendWhatsApp(
//         task.user.phone,
//         `Reminder: ${task.title} is due at ${task.deadline}`
//       );

//       task.reminded = true;
//       await task.save();
//     }
//   });
// };

// module.exports = reminderJob;
// // workers/financialReminderWorker.js
// const User = require("../models/user.model");



async function financialReminderWorker() {
  const users = await User.find({ wantsFinancialReminders: true });
  const now = new Date();

  for (let user of users) {
    if (!user.financialReminderStart || !user.financialReminderFrequency) continue;

    let shouldRemind = false;
    const diffDays = Math.floor((now - user.financialReminderStart) / (1000 * 60 * 60 * 24));

    if (user.financialReminderFrequency === "daily" && diffDays >= 1) {
      shouldRemind = true;
    } else if (user.financialReminderFrequency === "weekly" && diffDays % 7 === 0) {
      shouldRemind = true;
    } else if (user.financialReminderFrequency === "monthly" && diffDays % 30 === 0) {
      shouldRemind = true;
    }

    if (shouldRemind) {
      sendWhatsAppReminder(user.phone, user.name);
    }
  }
}

function startFinancialReminderWorker() {
  // run every hour
  setInterval(financialReminderWorker, 1000 * 60 * 60);
}

module.exports = startFinancialReminderWorker;

