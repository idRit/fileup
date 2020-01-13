module.exports = (app) => {
    const user = require('./user.controller');

    app.post('/api/login', user.login);
    app.post('/api/signup', user.signup);
}