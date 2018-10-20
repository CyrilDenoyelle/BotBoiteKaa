const white_list = process.env.WHITE_LIST;

module.exports = (id) => {
  console.log('white_list, id', white_list, id);
  console.log('typeof white_list', typeof white_list);
  // return white_list.includes(id)
  return true;
}