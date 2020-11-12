module.exports = client => {

    client.user.setActivity("gud music", {type: "LISTENING"})

    console.log(`Logged in as ${client.user.tag}!`)

};