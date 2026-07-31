const { getTime } = global.utils;

module.exports = {
	config: {
		name: "user",
		version: "1.5",
		author: "NTKhang",
		countDown: 3,
		role: 2, // Only Bot Admin/Owner
		shortDescription: "ইউজার ব্যান বা আনব্যান করুন",
		longDescription: "বট সিস্টেমে ইউজারদের ব্যান, আনব্যান বা সার্চ করার জন্য অ্যাডমিন কমান্ড।",
		category: "owner",
		guide: "{pn} [find | -f | search] <নাম>: নাম দিয়ে ইউজার খুঁজুন\n{pn} [ban | -b] [<uid> | @tag | reply] <কারণ>: ইউজারকে ব্যান করুন\n{pn} [unban | -u] [<uid> | @tag | reply]: ইউজারকে আনব্যান করুন"
	},

	langs: {
		bn: {
			noUserFound: "❌ \"%1\" নামে কোনো ইউজার ডাটাবেজে পাওয়া যায়নি!",
			userFound: "🔎 \"%2\" নামে %1 জন ইউজার পাওয়া গেছে:\n%3",
			uidRequired: "⚠️ ব্যান করার জন্য UID, Tag অথবা মেসেজে রিপ্লাই দিয়ে কারণ লিখুন!",
			reasonRequired: "⚠️ ব্যান করার কারণ অবশ্যই লিখতে হবে!",
			userHasBanned: "🔥 [ Diablo System ]\n\nইউজার [%1 | %2] আগেই ব্যান হয়েছে!\n» কারণ: %3\n» তারিখ: %4",
			userBanned: "🚫 [ Diablo System ]\n\nইউজার [%1 | %2]-কে সফলভাবে ব্যান করা হয়েছে!\n» কারণ: %3\n» তারিখ: %4",
			uidRequiredUnban: "⚠️ আনব্যান করার জন্য UID, Tag অথবা মেসেজে রিপ্লাই দিন!",
			userNotBanned: "✅ ইউজার [%1 | %2] বর্তমানে ব্যান নেই!",
			userUnbanned: "✅ [ Diablo System ]\n\nইউজার [%1 | %2]-কে সফলভাবে আনব্যান করা হয়েছে!"
		}
	},

	onStart: async function ({ args, usersData, message, event, prefix, getLang }) {
		const type = args[0]?.toLowerCase();

		switch (type) {
			// Find User by Name
			case "find":
			case "-f":
			case "search":
			case "-s": {
				const keyWord = args.slice(1).join(" ");
				if (!keyWord) return message.reply("⚠️ খোঁজার জন্য কোনো নাম টাইপ করুন!");

				const allUser = await usersData.getAll();
				const result = allUser.filter(item => (item.name || "").toLowerCase().includes(keyWord.toLowerCase()));
				const msg = result.reduce((i, user) => i += `\n╭Name: ${user.name}\n╰ID: ${user.userID}`, "");
				
				return message.reply(result.length == 0 ? getLang("noUserFound", keyWord) : getLang("userFound", result.length, keyWord, msg));
			}

			// Ban User
			case "ban":
			case "-b": {
				let uid, reason;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
					reason = args.slice(1).join(" ");
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
					reason = args.slice(1).join(" ").replace(mentions[uid], "");
				}
				else if (args[1]) {
					uid = args[1];
					reason = args.slice(2).join(" ");
				}

				if (!uid) return message.reply(getLang("uidRequired"));
				if (!reason || !reason.trim()) return message.reply(getLang("reasonRequired"));
				
				reason = reason.replace(/\s+/g, ' ').trim();

				const userData = await usersData.get(uid);
				const name = userData.name || "Unknown";
				const status = userData.banned?.status;

				if (status) {
					return message.reply(getLang("userHasBanned", uid, name, userData.banned.reason, userData.banned.date));
				}

				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await usersData.set(uid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});

				return message.reply(getLang("userBanned", uid, name, reason, time));
			}

			// Unban User
			case "unban":
			case "-u": {
				let uid;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
				}
				else if (args[1]) {
					uid = args[1];
				}

				if (!uid) return message.reply(getLang("uidRequiredUnban"));

				const userData = await usersData.get(uid);
				const name = userData.name || "Unknown";
				const status = userData.banned?.status;

				if (!status) {
					return message.reply(getLang("userNotBanned", uid, name));
				}

				await usersData.set(uid, {
					banned: {
						status: false,
						reason: "",
						date: ""
					}
				});

				return message.reply(getLang("userUnbanned", uid, name));
			}

			default:
				return message.reply("⚠️ ভুল কমান্ড! সঠিক ব্যবহার:\n• /user ban <UID/@tag/Reply> <কারণ>\n• /user unban <UID/@tag/Reply>\n• /user find <নাম>");
		}
	}
};
