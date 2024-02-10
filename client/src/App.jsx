import React, { useMemo, useState } from 'react';
import {io} from "socket.io-client";
import { useEffect } from 'react';
import "./App.css";
 
const App = () => {
  const socket = useMemo(()=>io("http://localhost:3000"),[]);
  //Creating socket here we have to give url of our backend
  //since url of frontend and backend are different it will be blocked due to cors
  //We'll manage it using cors
 
  const [messages,setMessages] = useState([]);
  const [message,setMessage] = useState("");
  const [room,setRoom]= useState("");
  const [roomName,setRoomName]= useState("");
  const [socketId,setSocketId] = useState("");
  

  console.log(messages);
  
  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit("message",{message,room});
    setMessage("");
    }
       
    const joinRoomHandler=(e)=>{
      e.preventDefault();
      socket.emit('join-room',roomName);
      setRoomName("");
    }

  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketId(socket.id);
    console.log("Connected",socket.id);
    })

    
    socket.on("received-message",(data)=>{   //Good practise to use it inside useEffect to stop component mounting
      console.log(data);
      setMessages((messages)=>[...messages,data]);
    });
    socket.on("Welcome",(s)=>{
      console.log(s);
    });


    return () =>{
      socket.disconnect(); 
      /*The useEffect hook can return a cleanup function, which will be executed when the component is unmounted or when the dependency array changes.
In this case, the cleanup function is disconnecting the socket using socket.disconnect() when the component is unmounted. This helps avoid memory leaks by cleaning up resources associated with the socket. */

    }
  },[]);

  
  return (

    <div>

    <div className='text-white bg-slate-700 '>
    <div className='flex justify-center h-screen w-full
     '>
      Chat
    </div>

    <div className='flex justify-center text-white'>
      {socketId}
    </div>

    <form onSubmit={joinRoomHandler}
    >
      <h5>Join Room</h5>
      <input type="text"
      label="Room Name"
      value={roomName}
      onChange={(e)=>setRoomName(e.target.value)}
      className='border rounded-md py-2 px-2 text-black '
      />
      <button 
      type='submit'
      className='bg-blue-500 m-2 p-2 px-4 border-none rounded-md'>Join</button>
    </form>

    <form onSubmit={handleSubmit}
    className='flex justify-center items-center'>
      <input type="text"
      label="Message"
      placeholder='Type Message Here'
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      className='border rounded-md py-2 px-2 text-black'
      />

      <input type="text"
      label="Room"
      value={room}
      onChange={(e)=>setRoom(e.target.value)}
      className='border rounded-md py-2 px-2 text-black'
      />
      <button 
      type='submit'
      className='bg-blue-500 m-2 p-2 px-4 border-none rounded-md'>Send</button>
    </form>

    <div className='flex flex-col justify-center'>

    {
      messages.map((m,i)=>(
        <div key={i}>
          {m}
        </div>
      ))
    }

    </div>

    </div>
     



    </div>
  )
}

export default App