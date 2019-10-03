class MultimediaPlayer extends DOMGui{

    constructor(audioTagSelector, tracks, guiParams = undefined) {
        super();

        this.files=[];
        this.audio = document.querySelector(audioTagSelector);
        this.tracks = tracks;
        this.audio.src = this.tracks[0];
        this.currentTrack = 0;
        

        this._DOMElements = {
            play: undefined,
            next: undefined,
            prev: undefined,
            title: undefined,
            artist: undefined,
            time:undefined,
            album: undefined,
            cover: undefined,
            currentTime: undefined,
            totalTime: undefined,
            progressBar: undefined,
            playlistMenu: undefined,
        }
        this.setDOMElements(guiParams);
        this.addListeners();
        this.setPlayerInfo();
        this.activeDraggableTracks();
        
    }

    addListeners() {

        this.startTimeUpdateListener();

        this.addButtonListener('play',() => {
              

            if (this.audio.paused) {
                this.audio.play();
                
            } else {
                this.audio.pause();
          
            }
            this.changeCover();
            this.changeIconPlayPause('play');
        });

        this.addButtonListener('next',() => {
            this.changeIconPlayPause('next');
            this.changePlayingSong(this.currentTrack + 1);
            this.changeCover();
            this.moveBarScrollAuto();

        });
        
        this.addButtonListener('prev',() => {
            this.changeIconPlayPause('prev');
            this.changePlayingSong(this.currentTrack-1);
            this.changeCover();
            this.moveBarScrollAuto();
        });


        this.addButtonListener('progressBar',(e) => {
            
            let position = e.offsetX;
            let totalW = e.target.clientWidth;
            let progress = position / totalW;
            this.updateProgressBar(progress);
            this.audio.currentTime = this.audio.duration * progress;
        });

         
         this.activeSoungTrack();
         this.activePlayLisDrog()
    }


    moveBarScrollAuto(){
       //console.dir(this.audio);

    }



  activePlayLisDrog(){



    this._DOMElements.playlistMenu.ondragover=(e)=>{
        e.preventDefault();
        
    }

    this._DOMElements.playlistMenu.ondrop=(e)=>{

        e.preventDefault();
        let files = e.dataTransfer.files;

        for(const file of files){

           if(file.type=="audio/mp3"){
               
              if(file.name.match(/ /g)==null){ 

                  if(file.name.match(/_/g).length==1 ){

                    this.files.push(file.name);
                    this.addDiv();
                  }else{

                     
                  console.log("El archivo "+file.name+" no puede ser leido por tener mas de un guion bajo.");
                  console.log("Renombre el archivo sin espacios y con un solo guion: (titulo_artista) ");
              
                  }

               }else{

                  console.log("El archivo "+file.name+" no puede ser leido por tener espaciados.");
                  console.log("Renombre el archivo sin espacios y con un solo guion: (titulo_artista) ");
              }
              
           }else{
               console.log(file.name+" No es una Archivo de Audio!");
           }
           
        }
         
    }


  }


   addDiv(){
    let posUltimoElement=this._DOMElements.playlistMenu.children.length-1;
    let newElemento=this._DOMElements.playlistMenu.children[posUltimoElement].cloneNode(true);
    
    if(newElemento.classList.contains("playing")){
        newElemento.classList.remove("playing");
    }
    newElemento.firstElementChild.dataset.href="./assets/songs/"+this.files[this.files.length-1];
    
    if(this.tracks.includes(newElemento.firstElementChild.dataset.href)){ // comparo si el elemento ya esta en los track
        console.log("la cancion "+this.files[this.files.length-1]+" ya se encuentra en la playList!");
       
     }else{

        let indiceUltmoSlash=this.files[this.files.length-1].lastIndexOf("/")+1;
        let indicePunto=this.files[this.files.length-1].lastIndexOf(".");
        let cantidadCaracteres=indicePunto-indiceUltmoSlash;

        let text=this.files[this.files.length-1].substr(indiceUltmoSlash,cantidadCaracteres)
        let tituloArtista=text.split('_');

        newElemento.firstElementChild.lastChild.innerHTML=tituloArtista[1]; // artista nuevo
        newElemento.firstElementChild.firstElementChild.innerHTML=tituloArtista[0]; //titulo nuevo
        this.tracks.push(newElemento.firstElementChild.dataset.href);// insertamos la ruta del archivo al track
        this._DOMElements.playlistMenu.insertBefore(newElemento,this._DOMElements.playlistMenu.children[posUltimoElement].nextSibling); // insertando nuevo elemento modificado en el DOM
        this.activeSoungTrack();
        
     }
     
   }

    changeCover(){
       let fondoActual=this.audio.src ;
       let indiceUltmoSlash=fondoActual.lastIndexOf("/")+1;
       let indicePunto=fondoActual.lastIndexOf(".");
       let cantidadCaracteres=indicePunto-indiceUltmoSlash;
       this._DOMElements.cover.style.backgroundImage="url(./assets/covers/"+fondoActual.substr(indiceUltmoSlash,cantidadCaracteres)+".jpg)";
   
    }


    addButtonListener(btnName, callback){
        this._DOMElements[btnName].onclick = callback;
    }

    changePlayingSong(index) {
         
        if ( index <= this.tracks.length - 1 ) {

            if(index<0){
                this.currentTrack = this.tracks.length - 1;
            }else{
                this.currentTrack = index;
            }

        }else{
            this.currentTrack =0;
        }
        this.audio.src = this.tracks[this.currentTrack];
        this.audio.play();
        this.changeHoverTracks();
        this.setPlayerInfo();
    }

    


    changeHoverTracks(){
        let playing = this._DOMElements.playlistMenu.querySelector('.playing');
        playing.classList.remove('playing');
        let element = this._DOMElements.playlistMenu.children[this.currentTrack];
        element.classList.add('playing');
      }



    setPlayerInfo() {
        let element = this._DOMElements.playlistMenu.children[this.currentTrack];
        this._DOMElements.title.innerHTML = element.querySelector('.title').innerHTML;
        this._DOMElements.artist.innerHTML = element.querySelector('.artist').innerHTML;
        
    }

    startTimeUpdateListener() {
        this.audio.ontimeupdate = () => {
            let total = this.audio.duration;
            let totalMinutosSegundos=(total/60).toString().split(".");
            totalMinutosSegundos[1]="0."+totalMinutosSegundos[1]
            let totalSegundos=parseInt((parseFloat(totalMinutosSegundos[1].substr(0,4),10).toFixed(2)*60),10);
            this._DOMElements.time.children[2].innerHTML=totalMinutosSegundos[0]+":"+totalSegundos;
            let current = this.audio.currentTime;
            let progress = current / total;
            this.updateProgressBar(progress);
            this.timeCurrent();
            

            if(this.audio.currentTime==this.audio.duration){
                this.changeIconPlayPause('play');
                this.addButtonListener('next',() => {
                    this.changeIconPlayPause('next');
                    this.changePlayingSong(this.currentTrack + 1);
                    this.changeCover();
                });
            }
        }
    }
    

    timeCurrent() {
        var mins = Math.floor(this.audio.currentTime / 60);
        var secs = Math.floor(this.audio.currentTime % 60);
        if (secs < 10) {
          secs = '0' + String(secs);
        }
        this._DOMElements.time.children[0].innerHTML=mins + ':' + secs;
      }

    updateProgressBar(progress) {
        this._DOMElements.progressBar.querySelector('.fill').style.transform = `scaleX(${progress})`;  
    }

    changeIconPlayPause(btnName){

        if(btnName=='play'){
            this._DOMElements.play.classList.toggle('fa-pause');
            this._DOMElements.play.classList.toggle('fa-play');
        }else {
            
            if(this._DOMElements.play.classList[1]=='fa-play'|| this._DOMElements.play.classList[2]=='fa-play'){
               
                this._DOMElements.play.classList.toggle('fa-pause');
                this._DOMElements.play.classList.toggle('fa-play');
            }
        }
        
    }

    activeSoungTrack(){
     
      let elementListaTrack=Array.from(this._DOMElements.playlistMenu.querySelectorAll('li'));
      
      for(let i=0;i<elementListaTrack.length;i++){
        
         elementListaTrack[i].onclick=()=>{
            this.audio.src=elementListaTrack[i].children[0].dataset.href;
            this.currentTrack=i;
            this.audio.play();
                 this.changeHoverTracks();
                 this.setPlayerInfo();
                 this.changeCover();
                 this.changeIconPlayPause('');
         }
      }
      
    }

    activeDraggableTracks(){
     
        let elementListaTrack=Array.from(this._DOMElements.playlistMenu.querySelectorAll('li'));
        let posDelArrastadro=undefined;
        let posDelSoltado=undefined; 
        
        for(let i=0;i<elementListaTrack.length;i++){

           

            elementListaTrack[i].ondragover=(e)=>{
                e.preventDefault();
                
            }
          
           elementListaTrack[i].ondrop=(e)=>{
                   e.preventDefault();
                   var data=e.dataTransfer.getData("text", e.target.id);
                  
               
                    posDelSoltado=i;
                    console.log(posDelArrastadro);
                    console.log(posDelSoltado);
              
                   if(posDelArrastadro!=undefined && posDelSoltado!=undefined){
                    
              

                      if(posDelArrastadro==posDelSoltado){
                        
                         console.log("ese solto mismo lugar");

                      }else{
                        
                        console.log(elementListaTrack[posDelArrastadro]);
                        console.log(elementListaTrack[posDelSoltado]);
                         
                        

                        //let arrayTemporal=this._DOMElements.playlistMenu.cloneNode(true);
                        //let nodo=this._DOMElements.playlistMenu.replaceChild(elementListaTrack[posDelArrastadro],elementListaTrack[posDelSoltado]);
                        //this._DOMElements.playlistMenu.replaceChild(nodo,arrayTemporal[posDelArrastadro]);

                        //console.log("lista original");
                        //console.log(this._DOMElements.playlistMenu.children.length);

                        //this._DOMElements.playlistMenu.splice(posDelSoltado,0,elementListaTrack[posDelArrastadro]);
                        this._DOMElements.playlistMenu.insertBefore(elementListaTrack[posDelArrastadro],this._DOMElements.playlistMenu.children[posDelSoltado].nextSibling); // insertando nuevo elemento modificado en el DOM
       
                        //this._DOMElements.playlistMenu.removeChild(elementListaTrack[posDelArrastadro]);
                        //console.log("lista modicada");
                        //console.log(this._DOMElements.playlistMenu.children.length);
                             

                      }
                    
                   }
                
           }

            elementListaTrack[i].ondragstart=(e)=>{
            e.dataTransfer.setData("text", e.target.id);
            posDelArrastadro=i;
           }



        }
        
        

      }
     
}