console.log("Lets write javascript");
let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if(isNaN(seconds) || seconds < 0){
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad single-digit seconds with a leading zero
  const formattedMinutes = String(minutes).padStart(2,'0');
  const formattedSeconds = String(remainingSeconds).padStart(2,'0');
  // Concatenate minutes and seconds with a colon
  return  `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`); //get request to the server
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  //show all the song in the playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>PP</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div></li>`;
  }

  //Attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

  })
  });
  return songs
}

const playMusic = (track, pause=false)=>{
  currentSong.src = `/${currfolder}/` + track
  if(!pause)
    {
      currentSong.play()
      play.src = "pause.svg"
    }
  
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

   
}


async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`); //get request to the server
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
      if(e.href.includes("/songs/")){
        let folder = e.href.split("/").slice(-1)[0]

        //Get the meta data  of the folder
        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`); //get request to the server
        let response = await a.json();
        console.log(response)
        cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            
            <div class="play">
                <svg width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                    color="#000000" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#1fdf64" />
                    <path d="M7 5V19L19 12L7 5Z" fill="black" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>` 
      }
    }
  

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      
    })
   
  })
}


async function main() {

  
  // get the list of all the songs
  await getsongs("songs/ncs");
  playMusic(songs[0], true)

  //Display all the albums on the page
  displayAlbums()



  //Attach an event listener to play, next and previous
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play()
      play.src = "pause.svg"
    }
    else{
      currentSong.pause()
      play.src = "play.svg"
    }
  })


  // Listen for time update event
  currentSong.addEventListener("timeupdate", ()=>{
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent+ "%";
    currentSong.currentTime = (currentSong.duration * percent)/100;
  })


  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0"
  })


  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-100%"
  })



  // Add an event listener to previous
  previous.addEventListener("click", ()=>{
    console.log("Previous Clicked")
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
    if((index-1) >= 0)
    {
      playMusic(songs[index-1])
    }
  })

  // Add an event listener to next
  next.addEventListener("click", ()=>{
    console.log("Next Clicked")

    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
    console.log(songs, index)
    if((index+1) < songs.length)
    {
      playMusic(songs[index+1])
    }
    
  })


  // Add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    console.log("setting volume to", e.target.value, "/100")
    currentSong.volume = parseInt(e.target.value)/100
  })



  





  // //play the first song
  // var audio = new Audio(songs[0]);
  // audio.play();


  // audio.addEventListener("loadeddata", () => {
  //   let duration = audio.duration;
  //   console.log(audio.duration, audio.currentSrc, audio.currentTime)

  // });

  



}

main();
