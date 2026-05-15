const winston = require('winston');

const startupDebugger = require('debug')('app:startup');

module.exports = async function (app, PORT) {

    try {

        startupDebugger('Application started in development mode');

        app.listen(PORT, () => {

            winston.info(`Server running on port ${PORT}`);

            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {

        winston.error(err.message);

        process.exit(1);
    }
};