
                const appendfiles= (message,position) =>{
                    const messagelement =  document.createElement('div');
                    messagelement.append(message);
                    
                    // messagelement.classList.add('message');
                    messagelement.classList.add(position);
                    container.append(messagelement);
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
                                console.log('mediaDevices supported..')
                                mediaRecorder = new MediaRecorder(stream)
                                
                                mediaRecorder.ondataavailable = (e) => {
                                    chunks.push(e.data)
                                }
                                
                                mediaRecorder.onstop = () => {
                                    const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
                                    chunks = []
                                    audioURL = window.URL.createObjectURL(blob)
                                    document.querySelector('audio').src = audioURL
                                    
                                }
                            }).catch(error => {
                                console.log('Following error has occured : ',error)
                            })
                            

                        
                        
                    }else{
                        stateIndex = ''
                    }

                    
                    
                    const clearDisplay = () => {
                        display.textContent = ''
                    }
                    
                    const clearControls = () => {
                        controllerWrapper.textContent = ''
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
                        // btn.id = id
                        btn.setAttribute('onclick', funString)
                        btn.textContent = text
                        // controllerWrapper.append(btn)
                    }
                    
                    const addMessage = (text) => {
                        const msg = document.createElement('p')
                        msg.textContent = text
                        display.append(msg)
                    }
                    
                    const addAudio = () => {
                        const audio = document.createElement('audio')
                        audio.controls = true
                        audio.src = audioURL

                        appendfiles(audio,'right');

                        display.append(audio)
                        socket.emit('send',audio);
                    }
                    
                    const application = (index) => {
                        console.log(index);
                        switch (State[index]) {
                            case 'Initial':
                                clearDisplay()
                                clearControls()
                                
                                addButton('record', 'record()', 'Start Recording')
                                // record();
                                
                                break;
                                
                            case 'Record':
                                    clearDisplay()
                                    clearControls()
                                    
                                    addMessage('Recording...')
                                    addButton('stop', 'stopRecording()', 'Stop Recording')
                                    

                                    break
                                    
                            case 'Download':
                                        clearControls()
                                        clearDisplay()
                                        
                                        addAudio()
                                        addButton('record', 'record()', 'Record Again')
                                        break
                                        
                                        default:
                                            clearControls()
                                            clearDisplay()
                                            
                                            addMessage('Your browser does not support mediaDevices')
                                            break;
                                        }
                                        
                                    }
                    application(stateIndex)