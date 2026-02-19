const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "namaj",
    version: "8.0.0",
    author: "milon |by fixed Gmini",
    countDown: 5,
    role: 0,
    shortDescription: "৮টি প্রধান জেলা এবং ছবির ভেতর সময়",
    category: "islam",
    guide: "{p}namaj list (৮টি জেলার তালিকার জন্য) অথবা {p}namaj [জেলার নাম]"
  },

  onStart: async function ({ api, event, args }) {
    // প্রধান ৮টি জেলা/বিভাগের তালিকা
    const districts = [
      "Dhaka", "Chattogram", "Barisal", "Khulna", "Rajshahi", "Rangpur", "Sylhet", "Mymensingh"
    ];

    let input = args[0] ? args[0].toLowerCase() : "";

    // যদি ইউজার 'list' লেখে
    if (input === "list") {
      let msg = "📜 **Available Districts List:**\n━━━━━━━━━━━━━━━━━━━━\n";
      districts.forEach((d, i) => {
        msg += `${i + 1}. ${d}\n`;
      });
      msg += "\n━━━━━━━━━━━━━━━━━━━━\n💡 Type: /namaj [District Name] to see timings.";
      return api.sendMessage(msg, event.threadID);
    }

    let city = args.join(" ");
    if (!city) return api.sendMessage("❌ Please provide a district name. Example: /namaj Dhaka\nTo see list, type: /namaj list", event.threadID);

    try {
      const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Bangladesh&method=1&school=1`);
      const t = res.data.data.timings;
      const date = res.data.data.date;
      const currentTime = moment.tz("Asia/Dhaka").format("hh:mm A");

      const imageUrl = "https://i.imgur.com/rGOj0I4.jpeg"; 
      const image = await loadImage(imageUrl);
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // --- ১ নম্বর বক্স (নামাজের সময়) ---
      let box1Y = image.height / 5.5; 
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; 
      ctx.fillRect(60, box1Y, image.width - 120, 310);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, box1Y, image.width - 120, 310);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px Arial"; 
      let startY = box1Y + 40;
      const times = [
        `✨ Fajr    : ${t.Fajr}`,
        `☀️ Dhuhr   : ${t.Dhuhr}`,
        `☁️ Asr     : ${t.Asr}`,
        `🌅 Maghrib : ${t.Maghrib}`,
        `🌙 Isha    : ${t.Isha}`,
        `🍱 Sehri   : ${t.Imsak}`,
        `🍱 Iftar   : ${t.Maghrib}`
      ];

      times.forEach(item => {
        ctx.fillText(item, 90, startY);
        startY += 40; 
      });

      // --- ২ নম্বর বক্স (জেলা ও সময় - মোটা ছোট লেখা) ---
      let box2Y = startY + 10;
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; 
      ctx.fillRect(60, box2Y, image.width - 120, 80);
      ctx.strokeStyle = "#FFD700";
      ctx.strokeRect(60, box2Y, image.width - 120, 80);

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#FFD700"; 
      ctx.fillText(`📍 District: ${city.toUpperCase()}`, 85, box2Y + 30);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`⌚ Time Now: ${currentTime}`, 85, box2Y + 60);

      const cachePath = path.join(__dirname, "cache", `namaj_${Date.now()}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));

      api.sendMessage({
        body: `🕌 Prayer timings for ${city.toUpperCase()} updated.`,
        attachment: fs.createReadStream(cachePath)
      }, event.threadID, () => fs.unlinkSync(cachePath));

    } catch (error) {
      api.sendMessage("❌ District not found. Check the list using: /namaj list", event.threadID);
    }
  }
};
