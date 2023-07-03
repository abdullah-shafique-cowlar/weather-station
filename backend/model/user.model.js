module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("user_test", {
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      }
    });
  
    return Users;
  };