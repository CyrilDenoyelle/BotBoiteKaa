const white_list = process.env.WHITE_LIST;

const isWhiteListGuild = (id) => JSON.parse(white_list).includes(id);

module.exports = {
  isWhiteListGuild
}
