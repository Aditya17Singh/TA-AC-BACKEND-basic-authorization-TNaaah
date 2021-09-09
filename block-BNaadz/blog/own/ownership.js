module.exports = {
  isSameUser: function (req, userId) {
    if (req.session == req.session.userId) {
      return true;
    } else {
      return false;
    }
  },
};
