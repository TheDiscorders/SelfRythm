# Self Rythm Bot

# USING SELFBOTS ARE AGAINST DISCORD TOS, THE USAGE OF A SELFBOT MAY RESULT IN A BAN OF YOUR ACCOUNT, WE ARE NOT RESPONSIBLE FOR ANY USAGE OF THE BOT

## ⚠ Warning

We created that for fun, we don't encourage you to use selfbots to create trouble on public servers and we won't do so.
## What is this shit ?

This project is a **Self Rythm Bot** in **[Node JS](https://nodejs.org/)**. It's made to do the same actions as **[Rythm](https://rythmbot.co/)**  while being a selfbot, this mean it can be used with a user account. This has many advantages, for example you can use it on any servers you're in, even without permissions.

## ⛓ Docker installation

You can use SelfRythm as a Docker container. To do so, you need to install Docker on your machine.
Create a Discord account and get the token
Then, you can run the command  
```sh
docker run -d \
--name "SelfRythm" \ # Optionnal, you can change it
-e "TOKEN=Your Discord Token" \ #Required
-e "PREFIX=A Prefix" \ #Optionnal, default is $
-e "ALLOWED=[IDS]" \ #Optionnal, list of Discord IDs allowed to use bot commands, everyone can use if not provided
thediscorders/selfrythm
```

## ⛓ Manual installation
1) Create a Discord account and get the token
2) Clone the repository and navigate in the folder
3) Install all the modules with `npm i`
4) Configure the bot with your personnal creditentials
* Values to provide: 
  * In the `config.js` file
	  * The user account token
	  * The bot's prefix
  *  In the `allowed.json` file
	  * An array of user's IDs that can control the bot	
  * In the `strings.json` file, you can make custom messages

5) Add an ffmpeg build to system PATH

## 👌 Usage

Start the bot by doing **`npm start`** in a terminal in the folder.

* Commands :

  * **`$play {url}`**
▶️ _makes the selfbot joins the channel you're in and starts playing the sound from the link, if there is already a music playing it adds it to a queue._
  * **`$join`**
▶️ _makes the selfbot move to the voice channel you're in (music needs to be playing)_
  * **`$skip`**
▶️ _skips the current music playing._
  * **`$stop`**
▶️ _stops the music playing and the selfbot leave the channel._
  * **`$loop`**
▶️ _loop the current music, re enter the command to stop._
  * **`$queue`**
▶️ _show the musics in the queue._
  
## 💡 Features

* Clear and Customizable messages on commands
* Creates a log when an unauthorized user tries to use the SelfBot
* Being a SelfBot allows you to :
	* add it on each discord server you're in
	* customize the list of users allowed to use it

 ## Alternative usage
The selfbot can be used as a regular bot, just change the token for a bot's one
