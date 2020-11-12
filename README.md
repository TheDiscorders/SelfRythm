# Automsg : Discord-Bot

## What is this shit ?

This project is a **Self Rythm Bot** in **[Node JS](https://nodejs.org/)**. His purpose is to do the same actions as **[Rythm](https://rythmbot.co/)**  while being a selfbot. This has many advantages, for example you can use it on any servs you're in, even without permissions.

## ⛓ Configuration

First you need to download the repository and put all the files in a folder. Then open a console **in this folder** and install the following modules : 

- Install the modules with `npm i`
    * **[discord.js-selfbot](https://www.npmjs.com/package/discord.js-selfbot)**
    * **[enmap](https://www.npmjs.com/package/enmap)**
    * **[ytdl-core](https://www.npmjs.com/package/ytdl-core)**
  
* Private data
  * The token and the prefix can be changed in the **config.js**  file
  * Allowed user ids can be changed in the **allowed.json** file 
  * The messages that says the bot can be changed in the **strings.json** file
  
 
## 👌 Usage

Start the bot by doing **`node .`** in a terminal in the folder.

* Commands :
  * **`$play {url]`**
▶️ _the selfbot joins the channel you're in and starts playing the sound from the link, if there is already a music playing it adds it to a queue._
  * **`$skip`**
▶️ _skips the current music playing._
  * **`$stop`**
▶️ _stops the music playing and the selfbot leave the channel._
  
## 💡 Features

* Clear and Customizable messages on commands
* Creates a log when an unauthorized user tries to use the SelfBot
* Being a SelfBot allows you to :
	* add it on each discord server you're in
	* customize the list of users allowed to use it

## 🙏 Thanks
Thanks to **Firokat** for help and ideas on this project
