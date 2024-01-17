const Previous=document.querySelectorAll(".PreviousSong"),Play=document.querySelectorAll(".PlaySong"),Pause=document.querySelectorAll(".PauseSong"),Next=document.querySelectorAll(".NextSong"),Loading=document.querySelectorAll(".Loading"),Progress=document.querySelectorAll(".Progress"),ClosePlayer=document.querySelectorAll(".ClosePlayer"),Player=document.querySelector(".Player"),Content=document.querySelector(".Content"),ShareNapster=document.querySelector(".ShareNapster"),Search=document.querySelector(".Search"),ErrorDiv=document.querySelector(".Error"),NotFound=document.querySelector(".NotFound"),Refresh=document.querySelector(".Refresh"),SearchAgain=document.querySelector(".SearchAgain"),Connected=document.querySelector(".Connected"),SharePlayButton=document.querySelector(".SharePlayButton"),SharePlayDiv=document.querySelector(".SharePlay"),Invite=document.querySelector(".Invite"),YourRoomId=document.querySelector(".RoomID"),LikeDiv=document.querySelector(".LikeDiv"),Like=document.querySelector(".Like"),fullScreen=document.querySelector(".Full"),NAPSTER=document.querySelector(".NAPSTER"),Loader=document.querySelector(".loader"),SongLoader=document.querySelectorAll(".songLoader"),LoadPlaylist=document.querySelector(".LoadPlaylist"),AllSongs=document.querySelector(".AllSongs"),worker=new Worker("../script/worker.js"),views=new Worker("../script/views.js"),url=new URLSearchParams(window.location.search),SongsFragment=document.createDocumentFragment(),Share=document.querySelector(".Share"),Transfer=document.querySelector(".Transfer"),News=document.querySelector(".News");let FocusSong,touchStartX,liked,Connection,PlaylistUrl,MusicAudio,RoomId=url.get("room")||generateRoomId(),CurrentCover=document.querySelectorAll(".CurrentCover"),CurrentSongTitle=document.querySelector(".CurrentSongTitle"),CurrentSongTitle2=document.querySelector(".CurrentSongTitle2"),CurrentSongTitle3=document.querySelector(".CurrentSongTitle3"),CurrentArtist=document.querySelectorAll(".CurrentArtist"),CurrentDuration=document.querySelectorAll(".Start"),TotalDuration=document.querySelectorAll(".End"),CurrentPlaylist="PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS",FetchSongs=[],SongPlaying=parseInt(url.get("song"))||parseInt(localStorage.getItem("song"))||0;function GetPlaylist(){url.get("playlist")?(PlaylistUrl=`https://music-info-api.vercel.app/?url=${url.get("playlist")}`,CurrentPlaylist=url.get("playlist")):PlaylistUrl="https://music-info-api.vercel.app/?url=PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS",FetchPlaylist()}function FetchPlaylist(){fetch(PlaylistUrl).then((async e=>{if(!e.ok)throw new Error(await e.text());return e.json()})).then((e=>{FetchSongs=e,views.postMessage("Count")})).then((()=>{DisplayPlaylist(FetchSongs)})).catch((e=>{ErrorDiv.classList.remove("hidden"),console.log(e.message)}))}function DisplayPlaylist(e,t){for(let t=0;t<e.length;t++){const o=e[t],n=document.createElement("div");n.classList.add("flex","cursor-pointer","song","mb-1","border","justify-between","items-center","border-none","hover:bg-zinc-900","p-3");const r=document.createElement("div");r.classList.add("flex","gap-2","items-center");const a=document.createElement("span");a.classList.add("loader","flex","overflow-hidden","h-12","w-12","rounded-md","justify-center","items-center"),a.innerHTML=`<img loading="lazy" class="h-[100%] w-[100%] object-cover" src="${o.cover}" alt=${o.title}>`;const i=document.createElement("div");i.classList.add("text-white");const s=document.createElement("h3");s.classList.add("truncate","mb-0.5","max-md:w-[73vw]","GradientText"),s.id=`text${o.id}`,s.textContent=o.title;const l=document.createElement("h3");l.classList.add("text-[.7rem]","text-zinc-400"),l.textContent=o.artist,i.appendChild(s),i.appendChild(l),r.appendChild(a),r.appendChild(i),n.id=o.id,n.addEventListener("click",(()=>{HideShowLoader(!0),SongPlaying=o.id,PlaySong(SongPlaying),ChangeCurrentSong(o.id),SharePlay("play")})),n.appendChild(r),SongsFragment.appendChild(n),AllSongs.appendChild(SongsFragment)}FocusSong=document.querySelectorAll(".song"),t||(CurrentCover.src=`${e[SongPlaying].cover}`,CurrentArtist.textContent=e[SongPlaying].artist,CurrentSongTitle.textContent=e[SongPlaying].title,CurrentSongTitle2.textContent=e[SongPlaying].title,CurrentSongTitle3.textContent=e[SongPlaying].title,RemoveDefaultLoaders(),HideShowLoader(!1,!0),AddEventListeners())}function RemoveDefaultLoaders(){Loading.forEach((e=>{e.remove()}))}function AddEventListeners(){Play.forEach((e=>{e.addEventListener("click",(()=>{PlayPause()}))})),Pause.forEach((e=>{e.addEventListener("click",(()=>{PlayPause()}))})),Next.forEach((e=>{e.addEventListener("click",(()=>{NextSong(),SharePlay("play")}))})),Previous.forEach((e=>{e.addEventListener("click",(()=>{PreviousSong(),SharePlay("play")}))})),CurrentCover.forEach((e=>{e.addEventListener("touchstart",(e=>{touchStartX=e.changedTouches[0].clientX}),{passive:!0}),e.addEventListener("touchend",(e=>{const t=e.changedTouches[0].clientX-touchStartX;t>50?PreviousSong():t<-50&&NextSong()}),{passive:!0})})),ClosePlayer.forEach((e=>{e.addEventListener("click",(()=>{setTimeout((()=>{Player.classList.remove("slide-in-top","max-md:block")}),500),Player.classList.add("slide-down-top")}))})),Content.addEventListener("click",(()=>{Player.classList.remove("slide-down-top"),Player.classList.add("max-md:block","slide-in-top")})),SeekBar()}function ChangeCurrentSong(){CurrentSongTitle.classList.remove("marquee"),CurrentSongTitle.textContent=FetchSongs[SongPlaying].title,CurrentSongTitle2.textContent=FetchSongs[SongPlaying].title,CurrentSongTitle3.textContent=FetchSongs[SongPlaying].title,CurrentCover.forEach((e=>{e.src=FetchSongs[SongPlaying].cover||`https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`})),CurrentArtist.forEach((e=>{e.textContent=FetchSongs[SongPlaying].artist}))}function AddMarquee(){CurrentSongTitle.textContent.length>23&&window.innerWidth<=600&&CurrentSongTitle.classList.add("marquee")}function step(){var e=MusicAudio.seek()||0;Progress.forEach((t=>{t.value=e,CurrentDuration.forEach((e=>{e.textContent=formatDuration(MusicAudio.seek())}))})),MusicAudio.playing()&&requestAnimationFrame(self.step.bind(self))}function NextSong(){window.location.href.includes("&song")&&history.pushState({},"",window.location.href.replace("&song","")),SongPlaying==FetchSongs.length-1?SongPlaying=0:SongPlaying++,HideShowLoader(!0),PlaySong()}function PreviousSong(){SongPlaying>0&&(HideShowLoader(!0),SongPlaying--,PlaySong())}function PlayPause(){MusicAudio&&(HideShowLoader(!0),MusicAudio.playing()?MusicAudio.pause():MusicAudio.play())}function HideShowLoader(e,t){e?(SongLoader.forEach((e=>{e.classList.remove("hidden")})),Play.forEach((e=>{e.classList.add("hidden")})),Pause.forEach((e=>{e.classList.add("hidden")}))):(SongLoader.forEach((e=>{e.classList.add("hidden")})),t&&(PlaySong(SongPlaying),Play.forEach((e=>{e.classList.remove("hidden")}))))}function FocusCurrentSong(e){if(FocusSong)for(let e=0;e<FocusSong.length;e++){const t=FocusSong[e];t.classList.contains("bg-zinc-900")&&t.classList.remove("bg-zinc-900")}const t=document.querySelectorAll(".GradientText");for(let e=0;e<t.length;e++){t[e].classList.remove("text-[#8678f9]")}const o=document.getElementById(e);o.focus();document.getElementById(`text${e}`).classList.add("text-[#8678f9]"),o.scrollIntoView({behavior:"smooth"}),AllSongs.children.item(e).classList.add("bg-zinc-900")}function SetMediaSession(){navigator.mediaSession.metadata=new MediaMetadata({title:FetchSongs[SongPlaying].title,artist:FetchSongs[SongPlaying].artist,artwork:[{src:FetchSongs[SongPlaying].cover||`https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`}]})}function SeekBar(){Progress.forEach((e=>{e.addEventListener("input",(e=>{MusicAudio.seek(e.target.value),url.has("room")&&SharePlay("seek",e.target.value)}))}))}function FetchQuery(e){window.location.href.includes("?room")&&SharePlayButton.classList.contains("fill-green-500")?alert("Not available on Share Play 🦄 wait for update 🚀"):fetch(`https://music-info-api.vercel.app/${e}`).then((e=>{if(500==e.status)throw new Error("Error");return e.json()})).then((e=>{if(e.length>0){for(;AllSongs.firstChild;)AllSongs.removeChild(AllSongs.firstChild);FetchSongs=e,SongPlaying=-1,DisplayPlaylist(FetchSongs,e)}else NotFound.classList.remove("hidden")})).catch((e=>{NotFound.classList.remove("hidden"),console.log(e.message)}))}function PlaySong(e,t,o,n){ChangeCurrentSong(SongPlaying),FocusCurrentSong(SongPlaying),MusicAudio&&MusicAudio.stop();const r=FetchSongs[SongPlaying].audio.replace("https://www.youtube.com/watch?v=","");MusicAudio=new Howl({src:[`https://unconscious-elianora-babyo7.koyeb.app/?url=${r}`],html5:!0,onplay:function(){localStorage.setItem("song",SongPlaying),Play.forEach((e=>{e.classList.add("hidden")})),Pause.forEach((e=>{e.classList.remove("hidden")})),HideShowLoader(!1),requestAnimationFrame(self.step.bind(self))},onseek:function(){requestAnimationFrame(self.step.bind(self))},onpause:function(){HideShowLoader(!1),Play.forEach((e=>{e.classList.remove("hidden")})),Pause.forEach((e=>{e.classList.add("hidden")}))},onend:function(){NextSong()},onload:function(){TotalDuration.forEach((e=>{e.textContent=formatDuration(MusicAudio.duration())})),HideShowLoader(!1),AddMarquee(),Progress.forEach((e=>{e.max=MusicAudio.duration()}))},onloaderror:function(e,t){e&&console.log("server doing sex")},onplayerror:function(e,t){e&&console.log(`song play error ${t}`)}}),SetMediaSession(),MusicAudio.play()}function formatDuration(e){const t=Math.floor(e/60),o=Math.floor(e%60);return`${String(t).padStart(2,"0")}:${String(o).padStart(2,"0")}`}function SharePlay(e,t){"play"==e?worker.postMessage(["play",RoomId,SongPlaying]):"joinRoom"==e?worker.postMessage(["joinRoom",RoomId,SongPlaying]):"seek"==e?worker.postMessage(["seek",RoomId,t]):"liked"==e&&worker.postMessage(["liked",RoomId,t])}function generateRoomId(){return"napster"+Math.random().toString(36).substr(2,6)}YourRoomId.textContent=RoomId,Share.addEventListener("click",(async()=>{navigator.share?await navigator.share({title:"Napster",text:`${FetchSongs[SongPlaying].title} by ${FetchSongs[SongPlaying].artist}`,url:window.location.origin+`?room=${RoomId}`+`&playlist=${url.get("playlist")||"PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"}`+`&share&song=${SongPlaying}`}):alert("Unable To Share")})),Search.addEventListener("click",(()=>{const e=prompt("Search");e&&""!==e.trim()&&FetchQuery(e)})),Transfer.addEventListener("click",(()=>{window.open("https://www.tunemymusic.com/transfer")})),ShareNapster.addEventListener("click",(async()=>{navigator.share?await navigator.share({title:"Napster",text:"Listen Your Playlist Ad Free ",url:window.location.origin+`?playlist=${CurrentPlaylist}`}):(navigator.clipboard.writeText(window.location.origin+`?playlist=${CurrentPlaylist}`),alert("Copied To Clipboard"))})),LoadPlaylist.addEventListener("click",(()=>{if(window.location.href.includes("?room")&&SharePlayButton.classList.contains("fill-green-500"))return void alert("Not available on Share Play 🦄 wait for update 🚀");const e=prompt("Enter Youtube Playlist URL");if(e&&""!==e.trim()){localStorage.setItem("song",0);const t=e.replace(/^https?:\/\/youtube\.com\/playlist\?list=|&feature=shared$/g,"");FetchQuery(`?url=${t||"PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"}`),CurrentPlaylist=t,history.pushState({},"",""),history.pushState({},"",`?playlist=${t}`)}})),Refresh.addEventListener("click",(()=>{localStorage.setItem("song",0),window.location.href=window.location.origin,ErrorDiv.classList.add("hidden")})),SearchAgain.addEventListener("click",(()=>{NotFound.classList.add("hidden")})),Connected.addEventListener("click",(()=>{Connected.classList.add("hidden")})),SharePlayButton.addEventListener("click",(()=>{SharePlayDiv.classList.remove("hidden")})),SharePlayDiv.addEventListener("click",(e=>{e.target.classList.contains("Invite")?e.stopPropagation():SharePlayDiv.classList.add("hidden")})),Invite.addEventListener("click",(async e=>{SharePlay("joinRoom");const t=window.location.origin+`?room=${RoomId}`+`&playlist=${url.get("playlist")||"PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"}`+`&share&song=${SongPlaying}`;navigator.share?(await navigator.share({title:"Napster",text:"Napster Share Play invite link",url:t}),SharePlayButton.classList.add("animate-pulse"),history.pushState({},"",`?room=${roomId}`)):(navigator.clipboard.writeText(t),alert("Copied To Clipboard")),SharePlayDiv.classList.add("hidden"),e.stopPropagation()})),News.addEventListener("click",(()=>{News.classList.add("hidden"),localStorage.setItem("news",!0)})),Like.addEventListener("click",(()=>{LikeDiv.classList.remove("hidden"),clearTimeout(liked),liked=setTimeout((()=>{LikeDiv.classList.add("hidden")}),4e3),SharePlay("liked")})),NAPSTER.addEventListener("click",(()=>{FetchQuery(`?url=${url.get("playlist")||"PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"}`)})),navigator.mediaSession.setActionHandler("play",(()=>{MusicAudio.play()})),navigator.mediaSession.setActionHandler("pause",(()=>{MusicAudio.pause()})),navigator.mediaSession.setActionHandler("previoustrack",(()=>{PreviousSong()})),navigator.mediaSession.setActionHandler("nexttrack",(()=>{NextSong()})),navigator.mediaSession.setActionHandler("seekto",(function(e){MusicAudio.seek(e.seekTime)})),worker.onmessage=e=>{const t=e.data;"connected"==t[0]||("Play"==t[0]?(SongPlaying=parseInt(t[1]),PlaySong()):"joined"==t[0]?(Connected.classList.remove("hidden"),Like.classList.remove("hidden"),clearTimeout(Connection),Connection=setTimeout((()=>{Connected.classList.add("hidden")}),1100),SharePlayButton.classList.replace("fill-red-500","fill-green-500"),SharePlayButton.classList.remove("animate-pules")):"seek"==t[0]?MusicAudio.seek(parseInt(t[1])):"userLeft"==t[0]?(SharePlayButton.classList.replace("fill-green-500","fill-red-500"),SharePlayButton.classList.add("animate-pules"),Like.classList.add("hidden")):"like"==t[0]&&(LikeDiv.classList.remove("hidden"),clearTimeout(liked),liked=setTimeout((()=>{LikeDiv.classList.add("hidden")}),4e3)))},url.has("room")&&SharePlay("joinRoom"),localStorage.getItem("news")&&News.classList.add("hidden"),document.addEventListener("keydown",(e=>{"Enter"===e.key&&(fullScreen.classList.replace("hidden","flex"),document.body.requestFullscreen())," "==e.key&&(PlayPause(),console.log("ok")),"ArrowRight"===e.key&&NextSong(),"ArrowLeft"===e.key&&PreviousSong()})),document.addEventListener("fullscreenchange",(function(){document.fullscreenElement?(fullScreen.classList.replace("hidden","flex"),fullScreen.classList.replace("opacity-0","opacity-1")):(fullScreen.classList.replace("opacity-1","opacity-0"),fullScreen.classList.replace("flex","hidden"))})),GetPlaylist();const lenis=new Lenis;function raf(n){lenis.raf(n),requestAnimationFrame(raf)}lenis.on("scroll",(n=>{console.log(n)})),requestAnimationFrame(raf);