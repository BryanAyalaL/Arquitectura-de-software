class UserValidator {
  static validateUserPayload(user) {
    return user && user.name && user.email && user.password;
  }
}

module.exports = UserValidator;

