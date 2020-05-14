const bcrypt = require('bcrypt');

const saltRounds = 10;

const password = 'changeThePass123';

const HASHED_PASSWORD = bcrypt.hashSync(password, saltRounds);
const ADMIN_EMAIL = 'admin@hiresession.com';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Admins', [{
      name: 'General Admin',
      email: ADMIN_EMAIL,
      password: HASHED_PASSWORD,
      role: 'general',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Admins', {
      email: ADMIN_EMAIL
    });
  }
};
