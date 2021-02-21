module.exports.prepareUsersResponse = (users) => {
    return users.map((user) => {
      const { email, name, _id, params } = user;

      return { id: _id, email, name, params };
    });
  };