const io = require("socket.io")( process.env.PORT || 8900, {
    cors: {
      origin: ["https://hopeful-brahmagupta-cc940d.netlify.app","http://localhost:3000"]
    },
  });
  let users = [] ;
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  io.on("connection", (socket) => {
    //when connect
    console.log("a user connected.");
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
          senderId,
          text,
        });
      });
    //io.emit("welcome","Welcome to socket server") ; // T send this to all the users
    socket.on("addUser",userId=>{
        console.log("Added an user") ;
    addUser(userId,socket.id) ;
    io.emit("getUsers",users) ;
    })
    socket.on("disconnect",()=>{
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
    });
