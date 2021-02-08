const users=[]

const adduser=({id,username,room})=>{
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();

    if(!username || !room)
    {
        return {error:'username and room are required'}
    }
    const checkuser=users.find((user)=>{
        return user.username===username && user.room===room
    })
    if(checkuser)
    {
      return {error:'Username already in use'}  
    }
    const user={id,username,room};
    users.push(user);
    return {user}
}
const removeuser=(id)=>{
    
  const index=users.findIndex((user)=>user.id===id)
    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}
const getuser=(id)=>{
   return users.find((user)=>id===user.id)
}
const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>room===user.room)
}


module.exports={
    adduser,
    removeuser,
    getuser,
    getUsersInRoom
}