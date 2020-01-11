module.exports = (app, path) => {
    const coreController = require('./api.controller');

    app.get('/core/api/fileStatus', coreController.fileStatus);
    app.post('/core/api/fileUpload', async (req, res) => await coreController.fileUpload(req, res, path));
}