// import {io} from 'socket.io-client'; 

const socket = io('http://localhost:8000')

const audio= new Audio('ping.aac');
const form=document.getElementById('send-container')
const msgInput=document.getElementById('messageInput')
const container=document.querySelector('.container')

const appendindom= (message,position) =>{
    const messagelement =  document.createElement('div');
    messagelement.innerText=message;
    
    messagelement.classList.add('message');
    messagelement.classList.add(position);
    container.append(messagelement);
    if(position=='left'){ audio.play()}

}

form.addEventListener('submit',(e)=>{
    e.preventDefault() //reload nahi hoga
    const v = msgInput.value;
    appendindom(`You: ${v}`,'right');
    msgInput.value='';
    socket.emit('send',v,'string');
})

const names = prompt("Enter your name to join")
const element = document.getElementsByClassName('online')[0];
console.log(names);


socket.emit('new-user-joined',names)

socket.on('add-entry',(users)=>{
    element.textContent='Users Online: ';
    for (const key in users) {
        const user = document.createElement('div')
        user.classList.add('highlight');
        user.innerText=` ${users[key]} `;
        element.append(user);
    }
})
socket.on('user-joined',(data)=>{
appendindom(`${data.name} joined the chat`,'mid')
})
socket.on('recieve',data=>{
    if(data.type=='string') appendindom(`${data.name}:${data.message}`,'left')
    else {
        console.log('as recieved in recieve',data.message);
        appendfiles(data.message,'left') };
})
socket.on('left',data=>{
appendindom(data,'mid')
})


const appendfiles= (message,position) =>{
    console.log('appendfiles is called')

    // messagelement.classList.add('message');
    // message.classList.add(position);
    console.log('message recieved in appendfiles: ' , message)
    const div=document.createElement('div');
    const audioelement=document.createElement('audio');
    audioelement.setAttribute('controls','true')
    audioelement.setAttribute('src',message)
    div.appendChild(audioelement)
    div.setAttribute('class',`${position} margin`)
    console.log(div)
    container.append(div);

    if(position=='left'){ audio.play()}

}

// collect DOMs
const display = document.getElementsByClassName('display')[0]

const controllerWrapper = document.getElementsByClassName('controllers')[0]

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''


// console.log('hi'); 
// mediaRecorder setup for audio
const button = document.getElementById('Rec');

// button.addEventListener('click',()=>{
    //     navigator.mediaDevices.getUserMedia
    // })
    

    
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {

                mediaRecorder = new MediaRecorder(stream)
                
                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data)
                }
                
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
                    chunks = []
                    audioURL = window.URL.createObjectURL(blob)
                    console.log('audioURL is created:',audioURL);
                    
                }
            }).catch(error => {
                console.log('Following error has occured : ',error)
            })
            

        
        
    }else{
        stateIndex = ''
    }

    

    const record = () => {
        stateIndex = 1
        mediaRecorder.start()
        application(stateIndex)
    }
    
    const stopRecording = () => {
        stateIndex = 2
        mediaRecorder.stop()
        application(stateIndex)
    }
    
    const downloadAudio = () => {
        const downloadLink = document.createElement('a')
        downloadLink.href = audioURL
        downloadLink.setAttribute('download', 'audio')
        downloadLink.click()
    }
    
    const addButton = (id, funString, text) => {
        const btn = document.getElementById('Rec')

        btn.setAttribute('onclick', funString)
        btn.textContent = text

    }
    
    const addMessage = (text) => {
        const msg = document.createElement('p')
        msg.textContent = text
        display.append(msg)
    }
    
    const addAudio = () => {
        
        console.log('audioURL as recieved in addAudio:',audioURL);
        appendfiles(audioURL,'right')

        socket.emit('send',audioURL,'audio')
    }
    
    const application = (index) => {

        switch (State[index]) {
            case 'Initial':
                
                addButton('record', 'record()', 'Rec')

                
                break;
                
            case 'Record':

                    
                    addMessage('Recording...')
                    addButton('stop', 'stopRecording()', 'Stop')
                    

                    break
                    
            case 'Download':

                        setTimeout(()=>addAudio(),300)

                        addButton('record', 'record()', 'Record')
                        break
                        
                        default:
                            clearControls()
                            clearDisplay()
                            
                            addMessage('Your browser does not support mediaDevices')
                            break;
                        }
                        
                    }
    application(stateIndex)