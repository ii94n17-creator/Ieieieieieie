console.clear()
const { Client, Collection, Discord, createInvite, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType, ActivityType, WebhookClient, PermissionsBitField, GatewayIntentBits, Partials, ApplicationCommandType, ApplicationCommandOptionType, Events, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ContextMenuCommandBuilder, SlashCommandBuilder, REST, Routes, GatewayCloseCodes, messageLink, AttachmentBuilder } = require('discord.js');
const { Database } = require("st.db")
const mongoose = require('mongoose');
const session = require("express-session");

const DiscordOauth2 = require("discord-oauth2");
const ascii = require('ascii-table');
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

require('./Bot')
emitter.setMaxListeners(999); 


emitter.on('event', () => {
});
emitter.emit('event');

const moment = require('moment-timezone');
//const { token , mainguild , database , WEBHOOK_URL } = require('./config1.json')
const { token, ClientID, Log, ClientSecret, dashboardIP, SupportSystem, mainguild, WEBHOOK_URL, database } = require('./config.json');
let config = require('./config.json');
const { readdirSync } = require("fs");
const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildVoiceStates,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	]
});
const productsDB = new Database("/Json-Database/DashBoard/Products.json"); // قاعدة بيانات المنتجات
const projectsDB = new Database("/Json-Database/DashBoard/projects.json");



 
const monitoredChannels = ['1106291978926297228', '1255882525499199600']; // استبدل بـ ID الروم

const imageUrl = 'https://i.postimg.cc/pdJqsRjR/1728507591218.jpg'; // استبدل بـ رابط الصورة
client.on('messageCreate', async (message) => {

    // تجاهل الرسائل من البوتات

    if (message.author.bot) return;

    // التحقق من أن الرسالة في إحدى القنوات المحددة

    if (monitoredChannels.includes(message.channel.id)) {

        try {

            console.log(`تم تلقي رسالة في القناة: ${message.channel.name}`); // لتتبع العملية

            await message.channel.send({ content: imageUrl });

        } catch (error) {

            console.error('حدث خطأ أثناء إرسال الصورة:', error);

        }

    }

});
client.login(token);

client.on('err', (error) => {
	console.error('The bot encountered an error:', error);
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (err, origin) => {
	console.error(err)
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
	console.error(err)

});
process.on('warning', (warning) => {
	return;
});

client.on('error', (error) => {
	console.error('An error occurred:', error);
});

client.on('shardError', (error) => {
	console.error('A shard error occurred:', error);
});


client.on(`ready`, async () => {
	client.user.setPresence({
		activities: [
			{
				name: 'Nova Maker',
				type: ActivityType.Competing,
				url: 'https://www.twitch.tv/Arabs Developers',
			}
		],
		status: "online"
	});

	setInterval(() => {
		client.user.setPresence({
			activities: [
				{
					name: 'Nova Maker',
					type: ActivityType.Competing,
					url: 'https://www.twitch.tv/ArabsDevelopers',
				}
			],
			status: "online"
		});
	}, 60 * 1000 * 60 * 1)
});

client.on("ready", async () => {
	const rest = new REST({ version: "10" }).setToken(token);
	(async () => {
		try {
            
			await rest.put(Routes.applicationCommands('1167533229302108232'), {
				body: slashcommands,
			});
		} catch (error) {
			console.error(error);
		}
	})();
            });

	


client.slashcommands = new Collection();
const slashcommands = [];
//for(let file of readdirSync('./database/').filter(
   // (file) => !file.includes(".")
//const reuirenation = require("./database/${file}")
//)) 
    
for (let folder of readdirSync("./slash-commands/").filter(
	(folder) => !folder.includes(".")
)) {
	for (let file of readdirSync("./slash-commands/" + folder).filter((f) =>
		f.endsWith(".js")
	)) {
		let command = require(`./slash-commands/${folder}/${file}`);
		if (command) {
			slashcommands.push(command.data);
			client.slashcommands.set(command.data.name, command);
			if (command.data.name) {

			} else {
				console.log(`/${command.data.name} ERROR`)
			}
		}
	}
}

  



client.button = new Collection();
require("./handlers/button")(client);

client.selectmenu = new Collection();
require("./handlers/selectmenu")(client);

client.modal = new Collection();
require("./handlers/modal")(client);


client.events = new Collection();
require("./handlers/events")(client);


// Dashbaord //
const fs = require('fs');



const cookieParser = require(`cookie-parser`);
const express = require(`express`);
const app = express();
app.enable(`trust proxy`)
app.set(`etag`, false);
app.use(express.static(__dirname + `/website`));
app.set(`views`, __dirname)
app.set(`view engine`, `ejs`)
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500kb' }));
const limitter = require("express-rate-limit")
process.oauth = new DiscordOauth2({
	clientId: '',
	clientSecret: '',
	redirectUri: `http://fi6.bot-hosting.net:20576/callback`
});



module.exports.client = client



// إعدادات تطبيق Discord OAuth2
const CLIENT_ID = ""; // ضع هنا Client ID الخاص بتطبيق Discord
const CLIENT_SECRET = ""; // ضع هنا Client Secret الخاص بتطبيق Discord
const REDIRECT_URI = "http://fi6.bot-hosting.net:20576/callback1";

const oauth = new DiscordOauth2();
const DISCORD_TOKEN = "MTE2NzUzMzIyOTMwMjEwODIzMg.GY21cL.LwSpSdHEUM2ICMgi5-Aq_Mx6cF-Z-oBTxKj_s4";
const discordClient = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.DirectMessages,

    GatewayIntentBits.GuildMessages

  ]

});
discordClient.login(DISCORD_TOKEN);
// إعدادات الجلسات
app.use(session({
  secret: "your_secret_key", // قم بتغيير المفتاح السري
  resave: false,
  saveUninitialized: true
}));

// رابط تسجيل الدخول عبر Discord OAuth2
app.get("/login1", (req, res) => {
  const authURL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(authURL);
});

// معالجة إعادة التوجيه بعد تسجيل الدخول
app.get("/callback1", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Error: No code provided");

  try {
    const accessTokenData = await oauth.tokenRequest({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      code,
      scope: "identify",
      grantType: "authorization_code",
      redirectUri: REDIRECT_URI
    });

    // جلب بيانات المستخدم من Discord
    const userData = await oauth.getUser(accessTokenData.access_token);
/*const blacklistSchema = require('../../Schema/Blacklist');
    // التحقق من الحظر
    const isBlacklisted = await blacklistSchema.findOne({ userid: userData.id });
    if (isBlacklisted) {
      return res.send("❌ لقد تم حظرك من الشراء.");
    }*/

    // تخزين بيانات المستخدم في الجلسة
    req.session.userId = userData.id;
    req.session.username = userData.username;
    res.redirect("/products"); // إعادة التوجيه إلى الصفحة الرئيسية بعد تسجيل الدخول
  } catch (error) {
    console.error("Error during Discord OAuth2 process:", error);
    res.send("حدث خطأ أثناء تسجيل الدخول.");
  }
});

// تسجيل الخروج
app.get("/logout1", (req, res) => {
  req.session.destroy(); // إنهاء الجلسة
  res.redirect("/login1"); // إعادة التوجيه إلى صفحة تسجيل الدخول
});
app.get("/products", async (req, res) => {

  if (!req.session.userId) {

    return res.redirect("/login1"); // إعادة التوجيه إلى تسجيل الدخول

  }

  const productsData = productsDB.get("products") || [];

  res.render(`./website/html/Pages/Dashboard/Order/products.ejs`, { products: productsData, username: req.session.username });

});
// الصفحة الرئيسية لعرض المنتجات
app.get("/projects", async (req, res) => {

  if (!req.session.userId) {

    return res.redirect("/login1"); // إعادة التوجيه إلى تسجيل الدخول

  }

  const projectsData = projectsDB.get("projects") || [];

  res.render(`./website/html/Pages/Dashboard/Order/projects.ejs`, { projects: projectsData, username: req.session.username });

});

  

  

// معالجة عملية الشراء
app.post("/buy/:productName", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login1"); // إعادة التوجيه إلى تسجيل الدخول إذا لم يكن مسجلًا
  }

  const productName = req.params.productName;
  const userId = req.session.userId;
  const guildId = "1067853147109863514";
const productsData = productsDB.get("products") || [];

  const productIndex = productsData.findIndex(p => p.name === productName);

  if (productIndex === -1) {

    

  
  

    return res.send(`<body>

<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>

Swal.fire(

    "المعذره",

    "❌ | هذا منتج غير متوفر حالياً ",

    'error'

)

</script>

</body>

<script>

setTimeout(() => {

    document.location.assign(document.location.origin = "/products")

}, 5000);</script>`);

  }

  const product = productsData[productIndex];

  // التحقق من المخزون المتوفر

  if (product.stock.length === 0) 
      return res.send(`<body>

<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>

Swal.fire(

    "المعذره",

    "❌ | غير متوفر هذا منتج حالياً ",

    'error'

)

</script>

</body>

<script>

setTimeout(() => {

    document.location.assign(document.location.origin = "/products")

}, 5000);</script>`);

  
const balanceSchema = require('/home/container/Schema/Balance.js');
  const userdata = await balanceSchema.findOne({ userid: userId, guild: guildId }) || { balance: 0 };
  if (userdata.balance < product.price) {
    return res.send(`<body>

<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>

Swal.fire(

    "المعذره",

    "❌ | رصيدك غير كافي تحتاج الي ${product.price - userdata.balance} عملة اضافيه",

    'error'

)

</script>

</body>

<script>

setTimeout(() => {

    document.location.assign(document.location.origin = "/products")

}, 5000);</script>`);
  }
userdata.balance -= product.price;

  await balanceSchema.updateOne({ userid: userId, guild: guildId }, { balance: userdata.balance });

  const productCode = product.stock.shift(); // حذف أول كود من المخزون

  productsData[productIndex].stock = product.stock; // تحديث المخزون في البيانات

   
  productsDB.set("products", productsData); // حفظ البيانات بعد التحديث

  

  // إرسال الكود إلى خاص المستخدم
const updatedProductsData = productsDB.get("products");

  const updatedProduct = updatedProductsData[productIndex];

  /*if (updatedProduct.stock.includes(productCode)) {

    console.error("Error: Stock code was not removed correctly from the database.");

    return res.send("❌ حدث خطأ أثناء تحديث المخزون.");

  }*/
  try {

    const user = await discordClient.users.fetch(userId);

    await user.send(`🎉 شكرًا على شراء "${product.name}"!\n💰 السعر: ${product.price} عملة\n🔑 كود المنتج: \`${productCode}\``);
      const logChannel = await discordClient.channels.fetch("1107242487149506581");

    if (logChannel) {

      const logEmbed = new EmbedBuilder()

        .setTitle("💸 عملية شراء جديدة")

        .setDescription(`قام المستخدم بشراء منتج.`)

        .setColor("Green")

        .setThumbnail(user.displayAvatarURL({ dynamic: true }))

        .addFields(

          { name: "المشتري", value: `<@${userId}>`, inline: true },

          { name: "المنتج", value: product.name, inline: true },

          { name: "السعر", value: `${product.price} Coins`, inline: true }

        )

        .setTimestamp();

      

      await logChannel.send({ embeds: [logEmbed] });

    }

    res.send(`<body>

            <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

            <script>

            Swal.fire(

                'Done',

                "✅ | تم شراء منتح تفحص خاصك ديسكورد ",

                'success'

            )

            </script>

            </body>

            <script>

            setTimeout(() => {

document.location.assign(document.location.origin = "/products")

            }, 2000);</script>`);

  } catch (error) {

    console.error("Error sending DM or log message:", error);

    res.send("حدث خطأ أثناء إرسال الرسائل.");

  }

});



  
app.post("/buy/:projectName", async (req, res) => {

  if (!req.session.userId) {

    return res.redirect("/login1"); // إعادة التوجيه إلى تسجيل الدخول إذا لم يكن مسجلًا

  }

  const projectName = req.params.projectName;

  const userId = req.session.userId;

  const guildId = "1067853147109863514";

  // جلب بيانات المشروع من قاعدة البيانات

  const projectsData = projectsDB.get("projects") || [];

  const project = projectsData.find(p => p.name === projectName);

  if (!project) {

    return res.send("❌ المشروع غير موجود.");
  }
const balanceSchema = require('/home/container/Schema/Balance.js');
  const userdata = await balanceSchema.findOne({ userid: userId, guild: guildId }) || { balance: 0 };

  if (userdata.balance < project.price) {

    return res.send(`❌ رصيدك غير كافٍ. تحتاج إلى ${project.price - userdata.balance} عملة إضافية.`);

  }

  // خصم الرصيد

  userdata.balance -= project.price;

  await balanceSchema.updateOne({ userid: userId, guild: guildId }, { balance: userdata.balance });
try {

    const user = await discordClient.users.fetch(userId);

    await user.send(`🎉 شكرًا على شراء مشروع "${project.name}"!\n💰 السعر: ${project.price} عملة\n🔗 رابط المشروع: [اضغط هنا](${project.url})`);

    // إرسال رسالة لوق إلى قناة معينة

    const logChannel = await discordClient.channels.fetch("1107242487149506581");

    if (logChannel) {

      const logEmbed = new EmbedBuilder()

        .setTitle("💸 عملية شراء مشروع")

        .setDescription(`قام المستخدم بشراء مشروع.`)

        .setColor("Green")

        .setThumbnail(user.displayAvatarURL({ dynamic: true }))

        .addFields(

          { name: "المشتري", value: `<@${userId}>`, inline: true },

          { name: "المشروع", value: project.name, inline: true },

          { name: "السعر", value: `${project.price} Coins`, inline: true },

          { name: "الرابط", value: `[رابط المشروع](${project.url})`, inline: false }

        )

        .setTimestamp();

      

      await logChannel.send({ embeds: [logEmbed] });

    }
    

    res.send(`✅ تم الشراء بنجاح! تم إرسال رابط المشروع الخاص بك إلى خاص حسابك.`);

  } catch (error) {

    console.error("Error sending DM or log message:", error);

    res.send("حدث خطأ أثناء إرسال الرسائل.");

  }

});
app.use((req, res, next) => {
	console.log(`\x1b[90m- ${req.method}: ${req.originalUrl} ${res.statusCode} ( by: ${req.ip} )\x1b[0m`);
	next()
});

app.get('/rules', (req, res) => {

    res.render(`./website/html/EN/rules.ejs`);  // يقوم بعرض ملف rules.ejs

});


/*const codesFilePath = path.join(__dirname, 'codes.json');
function loadCodes() {

    const data = fs.readFileSync(codesFilePath, 'utf8');

    return JSON.parse(data).codes;

}
function saveCodes(codes) {

    fs.writeFileSync(codesFilePath, JSON.stringify({ codes }, null, 2), 'utf8');

}
app.get('/add-coins', (req, res) => {

  res.render(`./website/html/Pages/Dashboard/Others/redeem.ejs`);

});
app.post('/redeem', (req, res) => {

    const { code } = req.body;

    // تحميل الأكواد من ملف JSON

    let codes = loadCodes();

    // تحقق إذا كان الكود موجود وغير مستخدم

    let foundCode = codes.find(c => c.code === code && !c.used);
     if (!foundCode) {

        return res.send('الكود غير صالح أو تم استخدامه من قبل!');

    }
    const userId = '1197311654103351357';
    foundCode.used = true;

    saveCodes(codes);  // حفظ التغييرات في ملف JSON

    res.send(`تم إضافة ${foundCode.amount} عملات إلى حسابك!`);

});*/
for (let folder of readdirSync("./website/public/").filter(
	(folder) => !folder.includes(".")
)) {
	for (let file of readdirSync("./website/public/" + folder).filter((f) =>
		f.endsWith(".js")
	)) {
		let f = require(`./website/public/${folder}/${file}`);
		if (f && f.name && f.type == "get" || f && f.name && !f.type) {
			if (Array.isArray(f.name)) {
				f.name.forEach(name => {
					app.get(name, f.run);
				})
			} else {
				app.get(f.name, f.run);
			}
		} else{
			app.post(f.name, f.run);
		}
	}
}




app.use(function (req, res) {
	res.status(404)
	res.render(`./website/html/EN/404.ejs`)
})
module.exports.app = app


 client.on(`ready`, async () => {
 	let LocalDatafiles = fs.readdirSync(`./Json-Database/BotsLocalData`).filter(F => F.endsWith(`.json`));
 	LocalDatafiles.forEach(f => {
		let botLocalData = new Database(`./Json-Database/BotsLocalData/${f}`)
 		botLocalData.deleteAll()
 		setInterval(() => {
 			botLocalData.deleteAll();
 		}, 30 * 60 * 1000);
 	});
 })


const http = require("http")
const socketIO = require("socket.io")
const server = http.createServer(app)
const io = socketIO(server)

server.listen(20576, () => console.log(`\x1b[32mDashboard\x1b[0m - ${dashboardIP}/`));
io.on(`connection`, (socket) => {
	let user = {}

	let guild = client.guilds.cache.get(SupportSystem.guild)
	if (!guild) return
	socket.on(`ticketMessage`, data => {
		if (guild) {
			let channel = guild.channels.cache.get(user[socket.id])
			if (!channel) return console.log("Cant find chanel", user[socket.id])
			if (channel) {
				let embed = new EmbedBuilder()
					.setColor('Green')
					.setDescription(`${data.message}`)
					.addFields(
						{
							name: `User`,
							value: `${data.userName}`
						},
						{
							name: `ID`,
							value: `${data.userID}`
						},
					)
				if (channel.topic.split("=")[1]?.trim() == "close") return
				channel.send({ embeds: [embed] }).then(() => {
					const date = moment().format('YYYY-MM-DD hh:mm');
					let dataSend = {
						message: data.message,
						userName: data.userName,
						userID: data.userID,
						date: date,
						ticket: user[socket.id],
					}
					io.emit('ticketMessage', dataSend);
				})
			}
		}
	})

	client.on(`messageCreate`, async message => {
		if (!message.author.bot || message.guild.id != guild.id || !message.embeds[0] || client.user.id == message.author.id) return
		const date = moment().format('YYYY-MM-DD hh:mm');
		let dataSend = {
			message: message.embeds[0].data.description,
			userName: message.embeds[0].data.fields[0].value,
			userID: message.embeds[0].data.fields[1].value,
			date: date,
			ticket: user[socket.id],
		}
		io.emit('ticketMessage', dataSend);
	})
	socket.on(`login`, data => {
		user[socket.id] = data.ticketID
	})

	socket.on('disconnect', function () {
		delete user[socket.id]
	})
})


const path = require('path');
const directoryPath = __dirname + '/Schema';
fs.readdir(directoryPath, (err, files) => {
	if (err) {
		console.error(err);
		return;
	}
	files.forEach(file => {
		const filePath = path.join(directoryPath, file);
		if (fs.statSync(filePath).isFile()) {
			try {
				require(filePath);
			} catch (error) {
				console.error(error);
			}
		}
	});
});

const tokens = JSON.parse(fs.readFileSync('tokenschanger.json', 'utf8'));


client.on('messageCreate', async (message) => {
    if (message.content === '!changetokens') {
        let successCount = 0;

        for (const token of tokens) {
            const botClient = new Client({ intents: 32767 });
            botClient.login(token).then(async () => {
                try {
                    await botClient.user.setUsername('Nova Store'); // غير اسم البوت هنا
                    await botClient.user.setAvatar('https://media.discordapp.net/attachments/1099378791488438493/1278687110840451092/1720992617048.png?ex=66d1b5ac&is=66d0642c&hm=947077267851361ec1c7590df4929bd481856d1527480856ea3443794a4e455f&'); // غير رابط الصورة هنا
                    console.log(`Successfully changed name and avatar for bot: ${botClient.user.tag}`);
                    successCount++;
                    botClient.destroy();
                } catch (error) {
                    console.error(`Failed to change name or avatar for bot with token: ${token}`, error);
                    botClient.destroy();
                }
            }).catch(error => {
                console.error(`Failed to login with token: ${token}`, error);
            });
        }

        // انتظر قليلاً للتأكد من اكتمال جميع العمليات
        setTimeout(() => {
            message.channel.send(`Done Change ${successCount} bot(s) Name And Pic`);
        }, 10000); // يمكن تعديل هذه المدة بناءً على عدد البوتات والوقت المتوقع لإتمام التغييرات
    }
});