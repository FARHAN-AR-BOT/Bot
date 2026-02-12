const axios = require('axios');
const baseApiUrl = async () => {
    return "https://api.noobs-api.rf.gd/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit)
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
   
    if ([api.getCurrentUserID()].includes(event.senderID)) return;
  
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = ["😚", "Yes 😀, I am here", "What's up?", "Bolo jaan ki korte tomar jonno🤧😘", "কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺", "প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧", "হুদাই আমারে শয়তানে লারে-😝😑☹️", "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧", "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱", "বুকাচুদা আর কত বট বট করবি 🐸", "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗", "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻", "-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸", "চুমু খাওয়ার বয়স টা  চকলেট🍫খেয়ে উড়িয়ে দিলো রাফি বস 🥺🤗", "কালকে দেখা করিস তো একটু 😈", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣", "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺", "-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস রাফি এর মনটা ছাড়া-🥴😑😏", "ডাকো কেন 🥺 প্রেম করবা নাকি 😞", "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস রাফি কে দান করেন-🥱🐰🍒", "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস রাফি কে-🐸😾🔪", "—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস রাফি এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️", "Bot না জানু,বল 😘", "-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧", "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস রাফি এর সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗", "ডাকিস না, তুই পচা 😼", "-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸", "জান হাঙ্গা করবা-🙊😝🌻", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "মেয়ে হলে বস রাফি কে 𝐊𝐈𝐒𝐒 দে 😒", "-ইস কেউ যদি বলতো-🙂-আমার শুধু তোমাকেই লাগবে-💜🌸", "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻", "-ঝাং থুমালে আইলাপিউ পেপি-💝😽", "-ফেসবুকে একটা বিন নাই এজন্য রাফি বস ফেসবুকে নাগিনদের ধরতে পারছে না 🐸🐷🐍", "কি গো সোনা আমাকে ডাকছ কেনো", "কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻", "𝙏𝙪𝙢𝙖𝙧 BF 𝙣𝙖𝙞 ,𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤?😂😂😂", "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧", "রাফি কে দেখছো? 🥺 তাকে কোথাও খুজে পাচ্ছি না 😩", "আমাকে ডেকো না,আমি ব্যাস্ত আসি", "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇", "-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস রাফি এর মনটা ছাড়া-🥴😑😏", "🤬 তুই বট এরজন্য তোকে ব্যান করে দিলাম🤧", "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦", "- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস রাফি এর ইনবক্স চলে যাও-🙊🥱👅", "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧", "-তোর সাথে কথা নাই কারণ তুই অনেক লুচ্চা🐸💩", "য়ামরা কি ভন্দু হতে পারিহ?? নাহ্লে তার থেকে বেসি কিচু??😋", "-দেখা হলে থাপ্পড় দিমু তোরে..🤗", "আমি তোমাকে অনেক ভালোবাসি বাবু🥺💖", "কিরে নাগিনী এত ডাকিস কেন 😩😁", "𝙸 𝚂𝙰𝚈 𝙸 𝙻𝙾𝚅𝙴 𝚈𝙾𝚄 𝙵𝙾𝚁𝙴𝚅𝙴𝚁💝🐼", "𝐁𝐨𝐭 না জানু বলো কারন আমি সিংগেল 😌", "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱", "1-𝗨𝗳𝗳𝘀 𝗠𝗮𝘁𝗵𝗮 𝗚𝗼𝗿𝗼𝗺 𝗞𝗼𝗿𝗲 𝗗𝗶𝘀𝗼𝘀!😒", "-𝗧𝗼𝗺𝗮𝗿 𝗚𝗳 𝗞𝗲𝗺𝗻 𝗔𝗰𝗵𝗲?🤗", "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘", "Bolo , তুমি কি আমার রাফি বস কে ভালোবাসো? 🙈💋", "চুনা ও চুনা আমার বস রাফি'এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭", "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱", "𝗧𝘂𝗺𝗶 𝗧𝗼 𝗮𝗺𝗸𝗲 𝗶𝗴𝗻𝗼𝗿𝗲 𝗸𝗼𝗿𝗼_🙂", "এতক্ষণ পর মনে হইলো আমাকে?🙁", "এত ডাকো কেনো 😑", "𝗕𝗯𝘆 না জানু,বল 😌", "-এটায় দেখার বাকি সিলো_🙂🙂🙂", "আমাকে না ডেকে আমার বস রাফি কে একটা জি এফ দাও-😽🫶🌺", "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂"];
            if (!arr) {

                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
