const white_list = process.env.WHITE_LIST;

module.exports = (id) => {
  console.log('white_list, id', white_list, id);
  console.log('typeof JSON.parse(white_list)', typeof JSON.parse(white_list));
  // return JSON.parse(white_list).includes(id)
  return true;
}