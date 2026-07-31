module.exports = {
  config: {
    name: "diabloCore",
    version: "3.0",
    author: "Protik Shah",
    countDown: 0,
    role: 0,
    shortDescription: "Diablo Core Trolling and Roasting System",
    longDescription: "Handles emoji trolling, keyword roasting, night-owl trolling, and mention responses.",
    category: "system"
  },

  onStart: async function ({ api, event }) {
    // অন-স্টার্টে কোনো ম্যানুয়াল কমান্ড চালু করার প্রয়োজন নেই
  },

  onChat: async function ({ api, event }) {
    const { body, threadID, messageID } = event;
    if (!body) return;

    const msgLower = body.toLowerCase();
    const prefix = global.GoatBot.config.prefix || "!";

    // 🐸 ১. ইমোজি স্প্যাম ট্রোলিং
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const emojisFound = body.match(emojiRegex) || [];
    const textWithoutEmojis = body.replace(emojiRegex, '').trim();

    if (textWithoutEmojis.length === 0 && emojisFound.length > 0) {
      const emojiReplies = [
        "কিরে মক্কেল? মুখে কি তালা পড়ছে? শুধু ইমোজি চাপিস কেন, টাইপ করার মুরোদ নাই? 🐸",
        "🔑 ইমোজির গুদাম দেখাইয়া পার পাবি না! প্রতীক বসের অ্যাসিস্ট্যান্টের সাথে কথা বলতে হলে বাটন টেপা শেখ আগে!",
        "এই যে বোবা কালা পার্টি, ইমোজি না মেরে দুইটা বাংলা লিখে যা! দেখি কত জোর তোর কথায়!"
      ];
      return api.sendMessage(emojiReplies[Math.floor(Math.random() * emojiReplies.length)], threadID, messageID);
    } else if (emojisFound.length > 2 && !body.startsWith(prefix)) {
      return api.sendMessage("কিরে, ইমোজি দেওয়ার চুলকানি বেড়ে গেল নাকি তোর? টাইপ করতে কি হাত ব্যাথা করে?", threadID, messageID);
    }

    // 😂 ২. কিউওয়ার্ড ট্রোলিং (পাত্তা / ক্রাশ / টাকা)
    if (msgLower.includes("পাত্তা") || msgLower.includes("patta")) {
      const pattaReplies = [
        "ঐ আবাল, তোরে কে পাত্তা দেবে শুনি? চেহারা দেখছিস আয়নায়? প্রতীক বসের অ্যাসিস্ট্যান্ট হয়ে আমিই তোরে পাত্তা দিচ্ছি না! 🐸",
        "পাত্তা খুঁইজা লাভ নাই দোস্ত! যে নিজের কপাল নিজে পোড়ায়, তারে ক্রাশ তো দূরের কথা, রাস্তার বিড়ালও পাত্তা দেয় না! 😂",
        "কিরে ছ্যাঁকা খাওয়া পার্টি? পাত্তা পাচ্ছিস না? প্রতীক ভাইয়ের চরণে এসে তেল দে, যদি কপালে কিছু জোটে! 👑"
      ];
      return api.sendMessage(pattaReplies[Math.floor(Math.random() * pattaReplies.length)], threadID, messageID);
    }

    if (msgLower.includes("ক্রাশ") || msgLower.includes("crash") || msgLower.includes("love")) {
      return api.sendMessage("ঐ মক্কেল, প্রতীক বসের অ্যাসিস্ট্যান্ট থাকতে তুই অন্য ক্রাশ খুঁজিস? তাছাড়া তোরে যে ও পাত্তা দেবে node_modules-এর মতো ইগনোর করবে, সেটা কি তুই জানিস না? 🐸", threadID, messageID);
    }

    if (msgLower.includes("টাকা") || msgLower.includes("taka") || msgLower.includes("ধার")) {
      return api.sendMessage("প্রতীক বসের এখানে কোনো ফকিরি আড্ডা চলবে না! পকেটে টাকা নাই তো গ্রুপে আসছিস কেন? যা, আগে বাপের কাছ থেকে পকেটমানি নিয়ে আয়! 🤪", threadID, messageID);
    }

    // 🦉 ৩. নাইট-আউল ট্রোলিং (রাত ১২টা থেকে ভোর ৫টা)
    const currentHour = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka", hour: 'numeric', hour12: false });
    if ((currentHour >= 0 && currentHour < 5) && (msgLower.includes("জেগে") || msgLower.includes("ঘুম") || msgLower.includes("online"))) {
      return api.sendMessage("কিরে রাতকানা ভূত? এই রাতে জেগে কার প্রোফাইল চেক করছিস? প্রতীক বসের অ্যাসিস্ট্যান্ট তোরে ঘুমানোর আদেশ দিচ্ছে, যা ভাগ! 🤫", threadID, messageID);
    }

    // 🔥 ৪. বটের নাম ধরলে বা মেনশন দিলে কাউন্টার
    if ((msgLower.includes("diablo") || msgLower.includes("বট") || msgLower.includes("bot")) && !body.startsWith(prefix)) {
      const fightReplies = [
        "বেবি বলো, প্রতীক বসের অ্যাসিস্ট্যান্টের সাথে পাঙ্গা নিতে ব্রেন লাগে, যেটা তোর ওই খালি মাথায় নাই! 😉",
        "কিরে দোস্ত! আমারে মেনশন দিয়া ভাবছিস পার পাবি? তুই যতক্ষণ মুখ চালাবি, আমিও থামুম না!",
        "তুই যে আমারে খোঁচাইতেছিস, তোর ক্রাশ কি তোরে এভাবে পাত্তা দেয়? ভাবিস একটু! 🐸"
      ];
      return api.sendMessage(fightReplies[Math.floor(Math.random() * fightReplies.length)], threadID, messageID);
    }
  }
};
