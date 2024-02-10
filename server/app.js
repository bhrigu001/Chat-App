import express from "express";
import { Server } from "socket.io";  //taking server from socket.io
import {createServer} from "http";  //creating server from http
import cors from 'cors';

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3001",
        methods:["GET","POST"],
        credentials:true, 
    }
});

app.use(
    cors({
    origin:"http://localhost:3001",
    methods:["GET","POST"],
    credentials:true, 
    }
));

app.get("/",(req,res)=>{
    res.send("Hello ji");
});

io.on("connection",(socket)=>{   //Initiated a circuit
    console.log("User Connected",socket.id);
   
    // socket.broadcast.emit("Welcome",`Welcome to the server,${socket.id}`); //Showing message to the every other socket except from which we are sending it
    // socket.emit("Welcome",`Welcome to the server,${socket.id}`);//Showing message to the particular socket from which we are sending it

    //Usually we don't use emit on backend usually we use listener and use emit from frontend

    socket.on("message",({room,message})=>{
        console.log({room,message});
        io.to(room).emit("received-message",message);
       
    });

    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`User joined room ${room}`);
    })

    socket.on("disconnect",()=>{   //Listener for disconnecting
        console.log("User Disconnected",socket.id);
    });


});

server.listen(port,()=>{ // Since we created io on server so we'll listen on server 
    console.log(`Server is running on port ${port}`);
});