const { getTime } = global.utils;

module.exports = {
	config: {
		name: "thread",
		aliases: ["box", "group"],
		version: "1.6",
		author: "NTKhang",
		countDown: 3,
		role: 0,
		shortDescription: "গ্রুপ চ্যাট ম্যানেজমেন্ট",
		longDescription: "গ্রুপ ব্যান/আনব্যান করা, গ্রুপ ইনফো দেখা এবং গ্রুপ ডাটাবেজ সার্চ করার কমান্ড।",
		category: "box chat",
		guide: "{pn} info: বর্তমান বা নির্দিষ্ট গ্রুপের তথ্য দেখুন\n{pn} ban <TID/Blank> <কারণ>: গ্রুপ ব্যান করুন (Admin Only)\n{pn} unban <TID/Blank>: গ্রুপ আনব্যান করুন (Admin Only)\n{pn} find <নাম>: ডাটাবেজ থেকে গ্রুপ খুঁজুন (Admin Only)"
	},

	langs: {
		bn: {
			noPermission: "❌ তোর এই কমান্ড ব্যবহার করার পারমিশন নেই (বট অ্যাডমিন অনলি)!",
			found: "🔎 \"%2\" নামে %1 টি গ্রুপ পাওয়া গেছে:\n%3",
			notFound: "❌ \"%1\" নামে কোনো গ্রুপ ডাটাবেজে পাওয়া যায়নি!",
			hasBanned: "🔥 [ Diablo System ]\n\nগ্রুপ [%1 | %2] আগেই ব্যান করা হয়েছে!\n» কারণ: %3\n» তারিখ: %4",
			banned: "🚫 [ Diablo System ]\n\nগ্রুপ [%1 | %2]-কে সফলভাবে ব্যান করা হয়েছে!\n» কারণ: %3\n» তারিখ: %4",
			notBanned: "✅ গ্রুপ [%1 | %2] বর্তমানে ব্যান নেই!",
			unbanned: "✅ [ Diablo System ]\n\nগ্রুপ [%1 | %2]-কে সফলভাবে আনব্যান করা হয়েছে!",
			missingReason: "⚠️ ব্যান করার কারণ অবশ্যই লিখতে হবে!",
			info: "📊 [ GROUP INFORMATION ]\n──────────────────\n» Box ID: %1\n» গ্রুপ নাম: %2\n» ডাটাবেজ ক্রিয়েট: %3\n» মোট মেম্বার: %4 জন\n» ছেলে: %5 জন\n» মেয়ে: %6 জন\n» মোট মেসেজ: %7 টি%8"
		}
	},

	onStart: async function ({ args, threadsData, message, role, event, getLang }) {
		const type = args[0]?.toLowerCase();

		switch (type) {
			// Find Thread by Name
			case "find":
			case "search":
			case "-f":
			case "-s": {
				if (role < 2) return message.reply(getLang("noPermission"));

				let allThread = await threadsData.getAll();
				let keyword = args.slice(1).join(" ");

				if (['-j', '-join'].includes(args[1])) {
					allThread = allThread.filter(thread => thread.members.some(member => member.userID == global.GoatBot.botID && member.inGroup));
					keyword = args.slice(2).join(" ");
				}

				if (!keyword) return message.reply("⚠️ খোঁজার জন্য গ্রুপের নাম টাইপ করুন!");

				const result = allThread.filter(item => item.threadID.length > 15 && (item.threadName || "").toLowerCase().includes(keyword.toLowerCase()));
				const resultText = result.reduce((i, thread) => i += `\n╭Name: ${thread.threadName}\n╰ID: ${thread.threadID}`, "");
				
				return message.reply(result.length > 0 ? getLang("found", result.length, keyword, resultText) : getLang("notFound", keyword));
			}

			// Ban Thread
			case "ban":
			case "-b": {
				if (role < 2) return message.reply(getLang("noPermission"));

				let tid, reason;
				if (!isNaN(args[1])) {
					tid = args[1];
					reason = args.slice(2).join(" ");
				} else {
					tid = event.threadID;
					reason = args.slice(1).join(" ");
				}

				if (!tid) return message.reply("⚠️ গ্রুপের ID বা সঠিক সিনট্যাক্স দিন!");
				if (!reason || !reason.trim()) return message.reply(getLang("missingReason"));

				reason = reason.replace(/\s+/g, ' ').trim();
				const threadData = await threadsData.get(tid);
				const name = threadData.threadName || "Unknown Group";
				const status = threadData.banned?.status;

				if (status) {
					return message.reply(getLang("hasBanned", tid, name, threadData.banned.reason, threadData.banned.date));
				}

				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await threadsData.set(tid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});

				return message.reply(getLang("banned", tid, name, reason, time));
			}

			// Unban Thread
			case "unban":
			case "-u": {
				if (role < 2) return message.reply(getLang("noPermission"));

				let tid = !isNaN(args[1]) ? args[1] : event.threadID;
				if (!tid) return message.reply("⚠️ গ্রুপের ID বা সঠিক সিনট্যাক্স দিন!");

				const threadData = await threadsData.get(tid);
				const name = threadData.threadName || "Unknown Group";
				const status = threadData.banned?.status;

				if (!status) {
					return message.reply(getLang("notBanned", tid, name));
				}

				await threadsData.set(tid, {
					banned: {
						status: false,
						reason: "",
						date: ""
					}
				});

				return message.reply(getLang("unbanned", tid, name));
			}

			// Info Thread
			case "info":
			case "-i": {
				let tid = !isNaN(args[1]) ? args[1] : event.threadID;
				if (!tid) return message.reply("⚠️ গ্রুপের ID বা সঠিক সিনট্যাক্স দিন!");

				const threadData = await threadsData.get(tid);
				const createdDate = getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss");
				const valuesMember = Object.values(threadData.members || {}).filter(item => item.inGroup);
				const totalBoy = valuesMember.filter(item => item.gender == "MALE").length;
				const totalGirl = valuesMember.filter(item => item.gender == "FEMALE").length;
				const totalMessage = valuesMember.reduce((i, item) => i += (item.count || 0), 0);
				
				const infoBanned = threadData.banned?.status ?
					`\n\n🔥 [ Banned Status ]`
					+ `\n- Banned: Yes`
					+ `\n- Reason: ${threadData.banned.reason}`
					+ `\n- Time: ${threadData.banned.date}` : "";

				const msg = getLang("info", threadData.threadID, threadData.threadName, createdDate, valuesMember.length, totalBoy, totalGirl, totalMessage, infoBanned);
				return message.reply(msg);
			}

			default:
				return message.reply("⚠️ ব্যবহারের নিয়ম:\n• /thread info (গ্রুপ ইনফো)\n• /thread ban <TID/Blank> <কারণ>\n• /thread unban <TID/Blank>\n• /thread find <নাম>");
		}
	}
};
