module.exports.prepareUsersResponse = ({ email, name, params }) => ({
  user: {
    email,
    name,
    params,
  },
});
