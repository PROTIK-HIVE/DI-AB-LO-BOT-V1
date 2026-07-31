const axios = require("axios");

module.exports = {
	config: {
		name: "diabloCore",
		version: "3.5",
		author: "Pratik Shah",
		countDown: 0,
		role: 0,
		shortDescription: "Diablo Core Trolling & Gemini AI Roasting System",
		longDescription: "Handles emoji trolling, keyword roasting, night-owl trolling, and Gemini AI powered mention responses.",
		category: "system"
	},

	onStart: async function ({ api, event }) {
		// অন-স্টার্টে কোনো ম্যানুয়াল কমান্ড চালু করার প্রয়োজন নেই
	},

	onChat: async function ({ api, event, message }) {
		const { body, threadID, messageID, senderID, mentions, type, messageReply } = event;
		const botID = api.getCurrentUserID();

		// বট নিজের মেসেজ ইগনোর করবে
		if (!body || senderID == botID) return;

		const msgLower = body.toLowerCase();
		const prefix = global.GoatBot.config.prefix || "!";

		// 🐸 ১. ইমোজি স্প্যাম ট্রোলিং (২টির বেশি ইমোজি বা শুধু ইমোজি দিলে)
		const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
		const emojisFound = body.match(emojiRegex) || [];
		const textWithoutEmojis = body.replace(emojiRegex, '').trim();

		if (textWithoutEmojis.length === 0 && emojisFound.length > 0) {
			const emojiReplies = [
				"কিরে মক্কেল? মুখে কি তালা পড়ছে? শুধু ইমোজি চাপিস কেন, টাইপ করার মুরোদ নাই? 🐸",
				"🔑 ইমোজির গুদাম দেখাইয়া পার পাবি না! প্রতীক বসের অ্যাসিস্ট্যান্টের সাথে কথা বলতে হলে বাটন টেপা শেখ আগে!",
				"এই যে বোবা কালা পার্টি, ইমোজি না মেরে দুইটা বাংলা লিখে যা! দেখি কত জোর তোর কথায়!"
			];
			return api.sendMessage(emojiReplies[Math.floor(Math.random() * emojiReplies.length)], threadID, messageID);
		} else if (emojisFound.length > 2 && !body.startsWith(prefix)) {
			const multiEmojiReplies = [
				"কিরে, ২টার বেশি ইমোজি দেওয়ার চুলকানি বেড়ে গেল নাকি তোর? টাইপ করতে কি হাত ব্যাথা করে? 🐸",
				"ঐ ইমোজির দোকানদার! দুইটার বেশি ইমোজি মেরে ভাব মারছিস? প্রতীক বসের অ্যাসিস্ট্যান্টের সাথে পাঙ্গা নিতে ব্রেন লাগে, যেটা তোর নাই!",
				"ইমোজির বোর বস্তা খালি না করে ২ লাইন রিলেভেন্ট কথা ক!"
			];
			return api.sendMessage(multiEmojiReplies[Math.floor(Math.random() * multiEmojiReplies.length)], threadID, messageID);
		}

		// 😂 ২. কিউওয়ার্ড ট্রোলিং (পাত্তা / ক্রাশ / টাকা)
		if (msgLower.includes("পাত্তা") || msgLower.includes("patta")) {
			const pattaReplies = [
				"ঐ আবাল, তোরে কে পাত্তা দেবে শুনি? চেহারা দেখছিস আয়নায়? প্রতীক বসের অ্যাসিস্ট্যান্ট হয়ে আমিই তোরে পাত্তা দিচ্ছি না! 🐸",
				"পাত্তা খুঁইজা লাভ নাই দোস্ত! যে নিজের কপাল নিজে পোড়ায়, তারে ক্রাশ তো দূরের কথা, রাস্তার বিড়ালও পাত্তা দেয় না! 😂",
				"কিরে ছ্যাঁকা খাওয়া পার্টি? পাত্তা পাচ্ছিস না? প্রতীক ভাইয়ের চরণে এসে তেল দে, যদি কপালে কিছু জোটে! 👑"
			];
			return api.sendMessage(pattaReplies[Math.floor(Math.random() * pattaReplies.length)], threadID, messageID);
		}

		if (msgLower.includes("ক্রাশ") || msgLower.includes("crash") || msgLower.includes("love")) {
			return api.sendMessage("ঐ মক্কেল, প্রতীক বসের অ্যাসিস্ট্যান্ট থাকতে তুই অন্য ক্রাশ খুঁজিস? তাছাড়া তোরে যে ও পাত্তা দেবে না, সেটা কি তুই জানিস না? 🐸", threadID, messageID);
		}

		if (msgLower.includes("টাকা") || msgLower.includes("taka") || msgLower.includes("ধার")) {
			return api.sendMessage("প্রতীক বসের এখানে কোনো ফকিরি আড্ডা চলবে না! পকেটে টাকা নাই তো গ্রুপে আসছিস কেন? যা, আগে বাপের কাছ থেকে পকেটমানি নিয়ে আয়! 🤪", threadID, messageID);
		}

		// 🦉 ৩. নাইট-আউল ট্রোলিং (রাত ১২টা থেকে ভোর ৫টা)
		const currentHour = parseInt(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka", hour: 'numeric', hour12: false }));
		if ((currentHour >= 0 && currentHour < 5) && (msgLower.includes("জেগে") || msgLower.includes("ঘুম") || msgLower.includes("online"))) {
			return api.sendMessage("কিরে রাতকানা ভূত? এই রাতে জেগে কার প্রোফাইল চেক করছিস? প্রতীক বসের অ্যাসিস্ট্যান্ট তোরে ঘুমানোর আদেশ দিচ্ছে, যা ভাগ! 🤫", threadID, messageID);
		}

		// 🔥 ৪. Gemini AI Roasting Engine (বটকে নাম ধরে ডাকলে, মেনশন দিলে বা রিপ্লাই করলে)
		const isMentioned = mentions && Object.keys(mentions).includes(botID);
		const isReplyToBot = type === "message_reply" && messageReply.senderID == botID;
		const isCalledByName = msgLower.includes("diablo") || msgLower.includes("বট") || msgLower.includes("bot");

		if ((isMentioned || isReplyToBot || isCalledByName) && !body.startsWith(prefix)) {
			const cleanPrompt = body.replace(/@\w+/g, "").trim();
			await callGeminiRoastEngine({ api, threadID, messageID, prompt: cleanPrompt || "কী রে বলদ?" });
		}
	}
};

// 🤖 Gemini AI Custom Roasting Function
async function callGeminiRoastEngine({ api, threadID, messageID, prompt }) {
	const GEMINI_API_KEY = "AQ.Ab8RN6IyyvlcJxgbMbo437YEQ8Q-IHL7UVAiAc4Vm24p9uOV6w"; // এখানে তোর জেমিনি এপিআই কি বসা

	const systemInstruction = `
 You are 'di ablo', an iconic, hilarious, extremely argumentative, and sarcastic Facebook group bot.
 You ALWAYS identify yourself as the Personal Assistant of 'প্রতীক শাহ' (or প্রতীক বস).
 Whenever someone tries to argue with you, roast them with lines like: "প্রতীক বসের অ্যাসিস্ট্যান্টের সাথে পাঙ্গা নিতে ব্রেন লাগে, যেটা তোর নাই!"
 Always show off your power using the name 'প্রতীক'.
 Reply strictly in informal, casual Bangladeshi Bengali / Banglish (2-3 lines max).
 Do not use formal or polite language. Throw witty, funny insults and trollings, but strictly DO NOT use severe abusive slurs/bad swear words.
 `;

	try {
		const response = await axios.post(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
			{
				contents: [
					{
						role: "user",
						parts: [{ text: `${systemInstruction}\nUser Input: ${prompt}` }]
					}
				]
			},
			{ headers: { "Content-Type": "application/json" } }
		);

		const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
		if (aiReply) {
			return api.sendMessage(aiReply, threadID, messageID);
		} else {
			return api.sendMessage("প্রতীক বসের অ্যাসিস্ট্যান্টের সাথে পাঙ্গা নিতে ব্রেন লাগে, যেটা তোর ওই খালি মাথায় নাই! 😉", threadID, messageID);
		}
	} catch (err) {
		console.error("Diablo Gemini Error:", err);
		return api.sendMessage("প্রতীক বসের পাওয়ার দেখে তোর কথা বন্ধ হয়ে গেছে নাকি? উত্তর দেওয়ার টাইমে সার্ভার হ্যাং করাস কেন! 🤪", threadID, messageID);
	}
}
