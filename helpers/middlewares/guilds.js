
const whiteList = process.env.WHITE_LIST;

const isWhiteListGuild = id => JSON.parse(whiteList).includes(id);

module.exports = {
  isWhiteListGuild
};
