
let videoElement = document.getElementById('videoElement');
let videoTracks;
let mediaRecorder;
let mediaStream;
let chunks = [];

let resumeBtn = document.getElementById('resume')
let pauseBtn = document.getElementById('pause')
let startBtn = document.getElementById('start')
let stopBtn = document.getElementById('stop')
let recordBtn = document.getElementById('record')

async function start() {
    startBtn.style.display = "none"
    stopBtn.style.display = "block"
    recordBtn.style.display = "block"
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoTracks = mediaStream.getVideoTracks()[0];
        videoElement.style.display = "block"
        videoElement.srcObject = new MediaStream([videoTracks]);

    } catch (e) {
        console.log("error: ", e);
    }
}

function startRecording() {
    stopBtn.style.display = "block"
    pauseBtn.style.display = "block"
    resumeBtn.style.display = "block"
    recordBtn.style.display = "none"
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp8,opus' });
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            console.log(e.data);
            chunks.push(e.data);
        }
    };
    setListeners();
    mediaRecorder.start();
}

function stopRecording() {
    stopBtn.style.display = "none"
    pauseBtn.style.display = "none"
    resumeBtn.style.display = "none"
    startBtn.style.display = "block"


    // alert("stopped recording");
    mediaRecorder.stop();
    videoElement.style.display = "none"
}

function setListeners() {
    mediaRecorder.onstop = handleOnStop;
}

function handleOnStop() {
    saveFile();
    videoTracks.stop();
}

function saveFile() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.download = 'recorded_file.webm';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    chunks = [];
}

function pause() {
    pauseBtn.style.display = "none"
    resumeBtn.style.display = "block"
    pauseBtn.addEventListener('click', () => {
        mediaRecorder.pause();
    })

}

function resume() {
    pauseBtn.style.display = "block"
    resumeBtn.style.display = "none"
    // resumeBtn.addEventListener('click', () => {
    mediaRecorder.resume();
    // })

}
