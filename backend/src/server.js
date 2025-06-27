import { config } from 'dotenv';
import {app,server,io} from './lib/socket.js';

import db from './lib/db.js';

import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import msgRoutes from './routes/msg.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

config();

const Port = process.env.PORT;
const __dirname = path.resolve();

app.use(bodyParser.json({limit:"10mb"}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.use('/chat/auth',authRoutes);
app.use('/chat/msg',msgRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(Port,()=>{
    console.log(`server is listening on Port ${Port}`);
})

