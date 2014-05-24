var http = require('http'),
iosocket = require('socket.io');

var server = http.createServer(function(request, response) {
  response.writeHeader(200, {"Content-Typ": "text/html"});
  response.write("Welcome");
  response.end();
}).listen(1234);
var io = iosocket.listen(server); 

io.sockets.on('connection',function(socket){
    
    //Current Code 
    socket.join("farm");
    socket.on('msg', function (data) {
        socket.broadcast.to("farm").emit("update", data);
    });
    
    //TBD:
    socket.on('connecting',function(userData){
        //Check if user is registered if not emit event 
        //and handle it on client to display the registration form  
        if(!checkRegisterdUser(userData))
        {
            socket.emit('registerUser',{data:userData});
        }
    });
    
    socket.on('addNewUser',function(data){
        //After click on register emit this even from client and handle here
        addNewUser(data,socket);
    });
    
    socket.on('connect',function(data){
        
        //Need to get required user data from the database. 
        var oldUserData = getUserDataFromDatabase(data);
        
        if(!checkValidSocketID(socket,data)){
            //Required to validate socket id after crash or phone restart
            validateSocketID(data,socket);
        }
        
        //Need to get group list which is available for the user 
        //and then emit it to the client
        var roomlist = getSubscribedGroupList(data,socket);
        
        //Get subscribed RoomList and emit to the client to show 
        socket.emit('showGroupList',{subscribedGroups:roomlist});
    });
    
    socket.on('message',function(data){
        
        //Method to create the sending dataaobject with all required details and json format
        var dataToSendBack = createSendingDataObject(data,socket);
        
        //Methdo to update the database with latest timestamp
        updateDatabaseForCurrentUser(data,socket);
        
        //Emit the data with message to required group 
        //and handle it at client side
        socket.broadcast.in(data.groupID).emit('updateMessageView',{data:dataToSendBack});
    });
    
    //Optional -- For Future 
    //Show user is typing 
    socket.on('typing',function(data){
        var dataToSend = data;
        //just emit the event to update the view 
        socket.broadcast.to(data.groupID).emit('updateTypingView',{data:dataToSend})
    });
    
    socket.on('backToGroupList',function(data){
        //Need to get group list which is available for the user 
        //and then emit it to the client
        var roomlist = getSubscribedGroupList(data,socket);
        
        //Get subscribed RoomList and emit to the client to show 
        socket.emit('showGroupList',{subscribedGroups:roomlist});
    });
    
    socket.on('enterdInChatRoom',function(data){
        //Get the data from database for last timestamp
        var dataToSend = getUserDataFromDatabase(data);
        
        //Emit the data to client so client can find and show the chat room data
        socket.emit('updateChatRoom',{data:dataToSend});
    });
    
    //Method to check if user is registerd user
    function checkRegisterdUser(userData){
        return true;
    }
    
    //Method to add new user (register user)
    function addNewUser(userData,socket){
        //Need to handle database
    }
    
    //Method to validate socket id with database stored id 
    function checkValidSocketID(socket,userData){
        return true;
    }
    
    function validateSocketID(socket,userData){
        //add new socket id to the database
    }
    
    //Method to return the subscribed groups for the user
    function getSubscribedGroupList(userData,socket){
        return null;
    }
    
    //method to return the userData for the current user from the database
    function getUserDataFromDatabase(userData){
        return null;
    }
    
    //Method to create the sending dataaobject with all required details and json format
    function createSendingDataObject(userData,socket){
        return null;
    }
    
    //Methdo to update the database with latest timestamp
    function updateDatabaseForCurrentUser(userData,socket){
        
    }
    
    });
