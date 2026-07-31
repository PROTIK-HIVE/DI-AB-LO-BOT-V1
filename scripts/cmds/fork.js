module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "source"],
    version: "1.0",
    author: "NeoKEX",
    countDown: 3,
    role: 0,
    longDescription: "amar bal dekhos ja protik vaiyer paye tel malis kor ",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const text = "✓ | Here is the updated repository:\n\nkire chusbi naki git\n\n" +
                 "Changes:\nja sala nijer mut nije kha" +
                 "Keep supporting^_^";
    
    message.reply(text);
  }
};
