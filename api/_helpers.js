module.exports = {
  deleteId: function(array) {
    array.map(arr => {
      delete arr.id;
    });
  }
};
