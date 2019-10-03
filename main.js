let tracks = []
let player = document.querySelector('#player');

let trackElements = document.getElementsByClassName('track');
for (let i = 0; i < trackElements.length; i++) {
    tracks.push(trackElements[i].dataset.href);
}


var menu = document.querySelector('.menu');
menu.onclick = () => { player.classList.toggle('show') };

let myAudioPlayer = new MultimediaPlayer('#player audio', tracks, {
    play: document.querySelector('#playpause'),
    next: document.querySelector('#next'),
    prev: document.querySelector('#back'),
    title: document.querySelector('#title'),
    artist: document.querySelector('#artist'),
    time: document.querySelector('.time-holder'),
    album: document.querySelector('#album'),
    cover: document.querySelector('#main'),
    playlistMenu: document.querySelector('#playlist'),
    progressBar: document.querySelector('#main .slider'),
});

//console.log(myAudioPlayer);

