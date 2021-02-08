const generatemsg=(username,text)=>{
    return{
        username,
        text,
        timestamp:new Date().getTime()
    }
}
const generatelocation=(username,url)=>{
    return{
        username,
        url,
        timestamp: new Date().getTime()
    }
}
module.exports={
    generatemsg,
    generatelocation
}
