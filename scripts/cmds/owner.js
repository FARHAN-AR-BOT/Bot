axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Milon Hasan",
    description: "ছবির সাথে ওনার এবং বটের তথ্য - Fixed Version",
    commandCategory: "info",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    // সরাসরি ইমেজের লিঙ্ক
    const imageUrl = "imag_link"; 
    
    // সময় ও আপটাইম ক্যালকুলেশন
    const uptime = process.uptime();
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((uptime % (60 * 60)) / 60);

    const infoMessage = `💠 𝗥𝗔𝗙𝗜 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 💠
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
 » 🤖 𝗕𝗼𝘁: 𝗥𝗔𝗙𝗜 𝗕𝗢𝗧
 » ☄️ 𝗣𝗿𝗲𝗳𝗶𝘅: 『 ? 』
 » 🧠 𝗖𝗺𝗱𝘀: 𝟭𝟳𝟯 𝗨𝗻𝗶𝘁𝘀
 » ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: ${days}𝗱 ${hours}𝗵 ${mins}𝗺

 ◈──────── OWNER ────────◈
 » 👤 𝗡𝗮𝗺𝗲: 𝗦𝗶𝘆𝗮𝗺 𝗔𝗵𝗺𝗲𝗱 𝗥𝗮𝗳𝗶
 » 🎂 𝗔𝗴𝗲: 𝟭𝟳+ 𝗬𝗲𝗮𝗿𝘀
 » 💬 𝗦𝘁𝗮𝘁𝘂𝘀: ꜱɪʟᴇɴᴄᴇ ɪꜱ ᴍʏ ᴀᴛᴛɪᴛᴜᴅᴇ
 » 🔗 𝗦𝗼𝗰𝗶𝗮𝗹: facebook.com/profile.php?id=61585437908438
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`;

    // ইমেজের জন্য ডিরেক্টরি পাথ
    const cachePath = path.join(__dirname, "cache", "owner_info.jpg");

    try {
      // ১. আগে চেক করবে cache ফোল্ডার আছে কিনা, না থাকলে বানাবে
      if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"));
      }

      // ২. ইমেজটি ডাউনলোড করে সেভ করবে
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(cachePath, Buffer.from(response.data, "utf-8"));

      // ৩. ইমেজসহ মেসেজ পাঠাবে
      return api.sendMessage({
        body: infoMessage,
        attachment: fs.createReadStream(cachePath)
      }, event.threadID, () => {
        // ৪. পাঠানোর পর ইমেজটি ডিলিট করে দিবে যাতে জায়গা নষ্ট না হয়
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
      }, event.messageID);

    } catch (error) {
      console.error("Owner info error:", error);
      // যদি ইমেজ ডাউনলোডে সমস্যা হয়, শুধু টেক্সট মেসেজ যাবে
      return api.sendMessage(infoMessage, event.threadID, event.messageID);
    }
  }
};
