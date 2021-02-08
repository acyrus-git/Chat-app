
var socket=io()
const $form=document.querySelector('#submitform');
const $formbutton=$form.querySelector('#send');
const $forminput=$form.querySelector('input');
const $locatebutton=document.querySelector('#locate');
const $messages=document.querySelector('#messages');
const msgtemp=document.querySelector('#msg-temp').innerHTML;
const locatetemp = document.querySelector('#locate-temp').innerHTML;
const userstemp=document.querySelector('#users-temp').innerHTML;
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll=()=>{
    const $newmsg=$messages.lastElementChild;

    const newmsgstyles=getComputedStyle($newmsg);
   // const newmsgmargin=newmsgstyles.marginbottom
    const newmsgmargin=parseInt(newmsgstyles.marginBottom);
    //newmessage height
    const newmsgheight = $newmsg.offsetHeight + newmsgmargin;
    //height of visible area
    const visibleheight=$messages.offsetHeight;
    //height of container
    const containerheight=$messages.scrollHeight;
    //scrolled height
    const scrolledheight=$messages.scrollTop +visibleheight;

    if(containerheight-newmsgheight<= scrolledheight)
    {
        $messages.scrollTop=$messages.scrollHeight;
    }


}
socket.on('message', (yo) => {
    console.log(yo);
   const html=Mustache.render(msgtemp,{
       username:yo.username,
       message:yo.text,
       timestamp:moment(yo.timestamp).format('HH:mm')
   })
   $messages.insertAdjacentHTML('beforeend',html);
   autoscroll();
})

socket.on('locationlink', (yo) => {
    console.log(yo);
    const html=Mustache.render(locatetemp,{
        username: yo.username,
        message:yo.url,
        timestamp: moment(yo.timestamp).format('HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})
socket.on('roomData',({room,users})=>{
    const html=Mustache.render(userstemp,{
        room,
       users 
    })
    document.querySelector('#sidebar').innerHTML=html;
})
$form.addEventListener('submit',(event)=>{
    event.preventDefault();

    $formbutton.setAttribute('disabled','disabled');
    var message=event.target.elements.msg.value;
    socket.emit('sendmsg',message,(error)=>{
        $formbutton.removeAttribute('disabled');
        $forminput.value='';
        $forminput.focus();
        if(error)
        {
           return console.log(error)
        }
        console.log('Message delivered!')
    });
})
document.querySelector('#locate').addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Your browser doesn\'t support this feature');
    }
    else{
        navigator.geolocation.getCurrentPosition((position)=>{
            $locatebutton.setAttribute('disabled','disabled');
            const lat=position.coords.latitude;
            const long=position.coords.longitude;
            socket.emit('sendlocation',{
                lat:lat,
                long:long
            },()=>{
                $locatebutton.removeAttribute('disabled')
                console.log('Location shared')
            })
        })
    }
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href = '/'
    }
});
