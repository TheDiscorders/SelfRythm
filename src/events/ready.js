const utils = require('../utils');

module.exports = client => {
    // client.user.setActivity("gud music", {type: "LISTENING"});

    utils.log(`Logged in as ${client.user.tag} !`);
};
