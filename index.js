

const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const cors=require('cors');
const { userRouter } = require('./routes/user');

const port= 3000 || process.env.port;

app.use(bodyParser.json());
app.use(cors());
// app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
  }));



app.use("/manage/api/",userRouter);

app.listen(port,()=>{
    console.log(`Listening on port ${port}!!`);
});
