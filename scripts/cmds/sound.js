const A = require("axios");
const B = require("fs-extra");
const C = require("path");

const JSN = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "sound",
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    category: "media"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID: t, messageID: m } = event;
    const q = args.join(" ");
    if (!q) return api.sendMessage("• Please provide a sound name.", t, m);

    api.setMessageReaction("⏳", m, () => {}, true);

    try {
      const D = await A.get(JSN);
      const E = D.data.api;

      const r = await A.get(`${E}/soundmeme?q=${encodeURIComponent(q)}`);
      const d = r.data.results[0];

      if (!d || !d.sound) throw new Error();

      const p = C.join(__dirname, "cache", `snd_${Date.now()}.mp3`);
      await B.ensureDir(C.dirname(p));

      const au = await A.get(d.sound, { responseType: "arraybuffer" });
      B.writeFileSync(p, Buffer.from(au.data));

      api.setMessageReaction("✅", m, () => {}, true);

      await api.sendMessage({
        body: `🎵 𝗦𝗼𝘂𝗻𝗱: ${d.title}`,
        attachment: B.createReadStream(p)
      }, t, () => B.unlinkSync(p), m);

    } catch (e) {
      api.setMessageReaction("❌", m, () => {}, true);
      return api.sendMessage("• Sound not found.", t, m);
    }
  }
};
