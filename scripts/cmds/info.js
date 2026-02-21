const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "info",
    version: "2.5.3",
    author: "ST | Sheikh Tamim (Fix by Sourav ahmed)",
    role: 0,
    countDown: 20,
    shortDescription: {
      en: "Owner & bot information"
    },
    longDescription: {
      en: "Show detailed information about the bot, owner, uptime and socials"
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {

    // OWNER INFO
    const ownerName = "Muhammad Sou Rav";
    const ownerAge = "17";
    const ownerFB = "https://www.facebook.com/MuhammadSourav10";
    const ownerNumber = "+88013XXXXXXX";
    const status = "Active";

    // BOT INFO
    const botName = global.GoatBot?.config?.nickNameBot || "GoatBot";
    const prefix = global.GoatBot?.config?.prefix || "/";
    const totalCommands = global.GoatBot?.commands?.size || 0;

    // GIF / VIDEO URL
    const images = [
      "https://files.catbox.moe/oaszt4.gif"
    ];
    const image = images[Math.floor(Math.random() * images.length)];

    // DATE & TIME
    const now = moment().tz("Asia/Dhaka");
    const date = now.format("MMMM Do YYYY");
    const time = now.format("h:mm:ss A");

    // UPTIME
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // SEND MESSAGE
    return message.reply({
      body: `
╔═《 ✨ 𝗢𝗪𝗡𝗘𝗥 & 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 ✨ 》═╗

⭓ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲   : 『 ${botName} 』
⭓ ☄️ 𝗣𝗿𝗲𝗳𝗶𝘅      : 『 ${prefix} 』
⭓ 🧠 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀    : 『 ${totalCommands} 』
⭓ ⚡ 𝗨𝗽𝘁𝗶𝗺𝗲      : 『 ${uptimeString} 』
⭓ 🗓️ 𝗗𝗮𝘁𝗲        : 『 ${date} 』
⭓ ⏰ 𝗧𝗶𝗺𝗲        : 『 ${time} 』

⭓ 👑 𝗢𝘄𝗻𝗲𝗿      : 『 -Rꫝғɪɪ 6x9 』
⭓ 🎂 𝗔𝗴𝗲        : 『 17+ 』
⭓ ❤️ 𝗦𝘁𝗮𝘁𝘂𝘀     : 『 ${status} 』
⭓ 📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽  : 『 01815843985 』
⭓ 🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸  : 『 id=61585437908438 』

───────────────
🔧 Fix by -Rꫝғɪɪ 6x9 
╚══════════════════════════╝
`,
      attachment: await global.utils.getStreamFromURL(image)
    });
  }
};
