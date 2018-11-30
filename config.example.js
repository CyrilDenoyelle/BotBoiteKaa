module.exports = () => {
  // setting your env for local server
  process.env.PORT = Math.floor(Math.random() * 9999);
  process.env.TDPASS = 'YOUDISCORDTOKEN';
  process.env.ADMIN = 'ADMIN_ID';
  process.env.RECAST_AI = 'YOUR_RECAST_AI';
  process.env.UP_GEN = 'YOUR_CHANNEL_ID';
  process.env.WHITE_LIST = '["WHITELISTED_CHANNEL", "WHITELISTED_CHANNEL", "WHITELISTED_CHANNEL"]';
  process.env.DEFAULT_GUILD = 'YOUR_DEFAULT_GUILD_ID';
};
