const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "1.6",
		author: "NTKhang",
		countDown: 3,
		role: 2, // Only Bot Admin/Owner
		shortDescription: "শুধু অ্যাডমিন বট ব্যবহার করার মোড চালু/বন্ধ করুন",
		longDescription: "অ্যাডমিন অনলি মোড চালু করলে বট অ্যাডমিন ছাড়া সাধারণ ইউজাররা বটের কোনো কমান্ড ব্যবহার করতে পারবে না।",
		category: "owner",
		guide: "{pn} [on | off]: এডমিন অনলি মোড অন বা অফ করতে\n{pn} noti [on | off]: ইউজারদের অ্যালার্ট মেসেজ পাঠানো চালু বা বন্ধ করতে"
	},

	langs: {
		bn: {
			turnedOn: "🔒 [ Diablo System ]\nএডমিন অনলি মোড **চালু** করা হলো! এখন থেকে কেবল বট অ্যাডমিনরা বট ব্যবহার করতে পারবে।",
			turnedOff: "🔓 [ Diablo System ]\nএডমিন অনলি মোড **বন্ধ** করা হলো! এখন থেকে সবাই বট ব্যবহার করতে পারবে।",
			turnedOnNoti: "🔔 [ Diablo System ]\nসাধারণ ইউজার কমান্ড দিলে অ্যাডমিন-অনলি নোটিফিকেশন দেখানো **চালু** করা হলো।",
			turnedOffNoti: "🔕 [ Diablo System ]\nসাধারণ ইউজার কমান্ড দিলে অ্যাডমিন-অনলি নোটিফিকেশন দেখানো **বন্ধ** করা হলো।"
		}
	},

	onStart: function ({ args, message, getLang }) {
		let isSetNoti = false;
		let value;
		let indexGetVal = 0;

		if (args[0]?.toLowerCase() == "noti") {
			isSetNoti = true;
			indexGetVal = 1;
		}

		const mode = args[indexGetVal]?.toLowerCase();

		if (mode == "on")
			value = true;
		else if (mode == "off")
			value = false;
		else
			return message.reply("⚠️ ব্যবহারের সঠিক নিয়ম:\n• /adminonly on/off (এডমিন অনলি মোড চালু/বন্ধ)\n• /adminonly noti on/off (নোটিফিকেশন চালু/বন্ধ)");

		if (isSetNoti) {
			if (!config.hideNotiMessage) config.hideNotiMessage = {};
			config.hideNotiMessage.adminOnly = !value;
			message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
		}
		else {
			if (!config.adminOnly) config.adminOnly = {};
			config.adminOnly.enable = value;
			message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		}

		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
	}
};
