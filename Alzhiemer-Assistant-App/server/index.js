const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const app=express();
const twilio = require('twilio');

app.use(express.json());
app.use(cors({
    origin:"your-frontend-host",
    credentials:true
}));

const User=require("./models/loginModel");
const Schedule=require("./models/scheduleModel");
const FamilyMember=require("./models/familyModel");
mongoose.connect('your-mongodb-url');


app.listen(3001,()=>{
    console.log("server is running");
})

app.post("/login", (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.json('0');
            } else {
                if (password === user.password) {
                    res.json('2');
                } else {
                    res.json('1');
                }
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Server error" });
        });
});

app.post('/add',(req,res)=>{
    let {time,activity} = req.body;
    Schedule.create({time,task:activity});
    res.json('Added to Schedule Successfully');
});

app.post('/addmem',(req,res)=>{
    let {name,rel,phone} = req.body;
    if(phone===''){
        phone='Unknown'
    }
    FamilyMember.create({name,relation:rel,phone});
    res.json(`${name} added successfully to list`);
})

app.get('/display',async (reg,res)=>{
    const schedules = await Schedule.find({});
    res.send(schedules);
});

app.get('/family', async (req, res) => {
    const family = await FamilyMember.find({});
    res.send(family);
});


const accountSid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const authToken = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const client = twilio(accountSid, authToken);

// POST request to send WhatsApp message
app.post('/api/send-message', async (req, res) => {
    const { phone, message } = req.body;

    try {
        const twilioMessage = await client.messages.create({
            from: 'whatsapp: your-twilio-no.',
            to: `whatsapp:+91${phone}`,
            body: 'Message from App User: '+message,
        });

        res.json({ success: true, messageSid: twilioMessage.sid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// POST request to send WhatsApp SOS message
app.post('/api/send-sos', async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const firstFamilyMember = await FamilyMember.findOne().sort({ _id: 1 });

        if (!firstFamilyMember) {
            return res.status(404).json({ success: false, message: "No family member found." });
        }

        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const message = await client.messages.create({
            from: 'whatsapp:your-twilio-no.',
            to: `whatsapp:your-personal-no.`,
            body: `Emergency! Please help! Current location: ${locationUrl}`,
        });

        res.json({ success: true, messageSid: message.sid });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/delete',async (req,res)=>{
    const {time,task} = req.body;
    await Schedule.findOneAndDelete({ time, task });
    res.json('Task Deleted Successfully');
})

app.post('/details',(req,res)=>{
    let {name} = req.body;
    FamilyMember.findOne({name:name})
    .then(user=>{
        res.json(user);
    })
})