const Previous=document.querySelectorAll(".PreviousSong"),Play=document.querySelectorAll(".PlaySong"),Pause=document.querySelectorAll(".PauseSong"),Next=document.querySelectorAll(".NextSong"),Loading=document.querySelectorAll(".Loading"),Progress=document.querySelectorAll(".Progress"),ClosePlayer=document.querySelectorAll(".ClosePlayer"),Player=document.querySelector(".Player"),Content=document.querySelector(".Content"),ShareNapster=document.querySelector(".ShareNapster"),Search=document.querySelector(".Search"),ErrorDiv=document.querySelector(".Error"),NotFound=document.querySelector(".NotFound"),Refresh=document.querySelector(".Refresh"),SearchAgain=document.querySelector(".SearchAgain"),Loader=document.querySelector(".loader"),SongLoader=document.querySelectorAll(".songLoader"),LoadPlaylist=document.querySelector(".LoadPlaylist"),AllSongs=document.querySelector(".AllSongs"),worker=new Worker("../script/worker.js"),views=new Worker("../script/views.js"),url=new URLSearchParams(window.location.search),SongsFragment=document.createDocumentFragment(),Share=document.querySelector(".Share"),Transfer=document.querySelector(".Transfer");let FocusSong,touchStartX,PlaylistUrl,MusicAudio,CurrentCover=document.querySelectorAll(".CurrentCover"),CurrentSongTitle=document.querySelector(".CurrentSongTitle"),CurrentSongTitle2=document.querySelector(".CurrentSongTitle2"),CurrentArtist=document.querySelectorAll(".CurrentArtist"),FetchSongs=[],SongPlaying=parseInt(localStorage.getItem("song"))||parseInt(url.get("song"))||0;function GetPlaylist(){PlaylistUrl=url.get("playlist")?`https://music-info-api.vercel.app/?url=${url.get("playlist")}`:"https://music-info-api.vercel.app/?url=PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS",FetchPlaylist()}function FetchPlaylist(){fetch(PlaylistUrl).then((async e=>{if(!e.ok)throw new Error(await e.text());return e.json()})).then((e=>{FetchSongs=e,views.postMessage("Count")})).then((()=>{DisplayPlaylist(FetchSongs)})).catch((e=>{ErrorDiv.classList.remove("hidden"),console.log(e.message)}))}function DisplayPlaylist(e,t){for(let t=0;t<e.length;t++){const n=e[t],o=document.createElement("div");o.classList.add("flex","cursor-pointer","song","mb-1","border","justify-between","items-center","border-none","hover:bg-zinc-900","p-3");const r=document.createElement("div");r.classList.add("flex","gap-2","items-center");const a=document.createElement("span");a.classList.add("loader","flex","overflow-hidden","h-12","w-12","rounded-md","justify-center","items-center"),a.innerHTML=`<img loading="lazy" class="h-[100%] w-[100%] object-cover" src="${n.cover}" alt=${n.title}>`;const s=document.createElement("div");s.classList.add("text-white");const i=document.createElement("h3");i.classList.add("truncate","max-md:text-[.91rem]","mb-0.5","max-md:w-[73vw]","GradientText"),i.id=`text${n.id}`,i.textContent=n.title;const l=document.createElement("h3");l.classList.add("text-[.7rem]","text-zinc-400"),l.textContent=n.artist,s.appendChild(i),s.appendChild(l),r.appendChild(a),r.appendChild(s),o.id=n.id,o.addEventListener("click",(()=>{HideShowLoader(!0),SongPlaying=n.id,PlaySong(SongPlaying),ChangeCurrentSong(n.id)})),o.appendChild(r),SongsFragment.appendChild(o),AllSongs.appendChild(SongsFragment)}t||(CurrentCover.src=`${e[SongPlaying].cover}`,CurrentArtist.textContent=e[SongPlaying].artist,CurrentSongTitle.textContent=e[SongPlaying].title,CurrentSongTitle2.textContent=e[SongPlaying].title,RemoveDefaultLoaders(),FocusSong=document.querySelectorAll(".song"),HideShowLoader(!1,!0),AddEventListeners())}function RemoveDefaultLoaders(){Loading.forEach((e=>{e.remove()}))}function AddEventListeners(){Play.forEach((e=>{e.addEventListener("click",(()=>{PlayPause()}))})),Pause.forEach((e=>{e.addEventListener("click",(()=>{PlayPause()}))})),Next.forEach((e=>{e.addEventListener("click",(()=>{NextSong()}))})),Previous.forEach((e=>{e.addEventListener("click",(()=>{PreviousSong()}))})),CurrentCover.forEach((e=>{e.addEventListener("touchstart",(e=>{touchStartX=e.changedTouches[0].clientX}),{passive:!0}),e.addEventListener("touchend",(e=>{const t=e.changedTouches[0].clientX-touchStartX;t>50?PreviousSong():t<-50&&NextSong()}),{passive:!0})})),ClosePlayer.forEach((e=>{e.addEventListener("click",(()=>{setTimeout((()=>{Player.classList.remove("slide-in-top","max-md:block")}),500),Player.classList.add("slide-down-top")}))})),Content.addEventListener("click",(()=>{Player.classList.remove("slide-down-top"),Player.classList.add("max-md:block","slide-in-top")})),SeekBar()}function ChangeCurrentSong(){CurrentSongTitle.classList.remove("marquee"),CurrentSongTitle.textContent=FetchSongs[SongPlaying].title,CurrentSongTitle2.textContent=FetchSongs[SongPlaying].title,CurrentCover.forEach((e=>{e.src=FetchSongs[SongPlaying].cover||`https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`})),CurrentArtist.forEach((e=>{e.textContent=FetchSongs[SongPlaying].artist}))}function AddMarquee(){CurrentSongTitle.textContent.length>23&&window.innerWidth<=600&&CurrentSongTitle.classList.add("marquee")}function step(){var e=MusicAudio.seek()||0;Progress.forEach((t=>{t.value=e})),MusicAudio.playing()&&requestAnimationFrame(self.step.bind(self))}function NextSong(){SongPlaying==FetchSongs.length-1?SongPlaying=0:SongPlaying++,HideShowLoader(!0),PlaySong()}function PreviousSong(){SongPlaying>0&&(HideShowLoader(!0),SongPlaying--,PlaySong())}function PlayPause(){MusicAudio&&(HideShowLoader(!0),MusicAudio.playing()?MusicAudio.pause():MusicAudio.play())}function HideShowLoader(e,t){e?(SongLoader.forEach((e=>{e.classList.remove("hidden")})),Play.forEach((e=>{e.classList.add("hidden")})),Pause.forEach((e=>{e.classList.add("hidden")}))):(SongLoader.forEach((e=>{e.classList.add("hidden")})),t&&(PlaySong(SongPlaying),Play.forEach((e=>{e.classList.remove("hidden")}))))}function FocusCurrentSong(e){if(FocusSong)for(let e=0;e<FocusSong.length;e++){const t=FocusSong[e];t.classList.contains("bg-zinc-900")&&t.classList.remove("bg-zinc-900")}const t=document.querySelectorAll(".GradientText");for(let e=0;e<t.length;e++){t[e].classList.remove("text-[#8678f9]")}const n=document.getElementById(e);n.focus();document.getElementById(`text${e}`).classList.add("text-[#8678f9]"),n.scrollIntoView({behavior:"smooth"}),AllSongs.children.item(e).classList.add("bg-zinc-900")}function SetMediaSession(){navigator.mediaSession.metadata=new MediaMetadata({title:FetchSongs[SongPlaying].title,artist:FetchSongs[SongPlaying].artist,artwork:[{src:FetchSongs[SongPlaying].cover||`https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`}]})}function SeekBar(){Progress.forEach((e=>{e.addEventListener("input",(e=>{MusicAudio.seek(e.target.value)}))}))}function FetchQuery(){const e=prompt("Search");""!==e.trim()&&fetch(`https://music-info-api.vercel.app/${e}`).then((e=>{if(500==e.status)throw new Error("Error");return e.json()})).then((e=>{for(worker.postMessage(e[0].audio);AllSongs.firstChild;)AllSongs.removeChild(AllSongs.firstChild);FetchSongs=e,SongPlaying=-1,DisplayPlaylist(FetchSongs,e)})).catch((e=>{NotFound.classList.remove("hidden"),console.log(e)}))}function PlaySong(){worker.postMessage(FetchSongs[SongPlaying+1].audio),ChangeCurrentSong(SongPlaying),FocusCurrentSong(SongPlaying),MusicAudio&&MusicAudio.stop();const e=FetchSongs[SongPlaying].audio.replace("https://www.youtube.com/watch?v=","");fetch(`https://stream-yiue.onrender.com?url=${e}`).then((e=>e.text())).then((e=>{MusicAudio=new Howl({src:[`https://stream-yiue.onrender.com${e}`],html5:!0,onplay:function(){localStorage.setItem("song",SongPlaying),Play.forEach((e=>{e.classList.add("hidden")})),Pause.forEach((e=>{e.classList.remove("hidden")})),HideShowLoader(!1),requestAnimationFrame(self.step.bind(self))},onseek:function(){requestAnimationFrame(self.step.bind(self))},onpause:function(){HideShowLoader(!1),Play.forEach((e=>{e.classList.remove("hidden")})),Pause.forEach((e=>{e.classList.add("hidden")}))},onend:function(){NextSong()},onload:function(){HideShowLoader(!1),AddMarquee(),Progress.forEach((e=>{e.max=MusicAudio.duration()}))},onloaderror:function(e,t){e&&(console.log(`song error ${t}`),NotFound.classList.remove("hidden"))}}),SetMediaSession(),MusicAudio.play()})).catch((e=>{ErrorDiv.classList.remove("hidden")}))}Share.addEventListener("click",(async()=>{const e=window.location.href.replace("?share&song=");navigator.share?await navigator.share({title:"Napster",text:`${FetchSongs[SongPlaying].title} by ${FetchSongs[SongPlaying].artist}`,url:e+`?share&song=${SongPlaying}`}):alert("Unable To Share")})),Search.addEventListener("click",(()=>{FetchQuery()})),Transfer.addEventListener("click",(()=>{window.open("https://www.tunemymusic.com/transfer")})),ShareNapster.addEventListener("click",(async()=>{navigator.share?await navigator.share({title:"Napster",text:"Listen Your Playlist Ad Free ",url:window.location.origin}):alert("Unable To Share")})),LoadPlaylist.addEventListener("click",(()=>{const e=prompt("Enter Youtube Playlist URL");if(""!==e.trim()){localStorage.setItem("song",0);const t=e.replace(/^https?:\/\/youtube\.com\/playlist\?list=|&feature=shared$/g,"");window.location.href=window.location.origin+`?playlist=${t}`}})),Refresh.addEventListener("click",(()=>{localStorage.setItem("song",0),window.location.href=window.location.origin,ErrorDiv.classList.add("hidden")})),SearchAgain.addEventListener("click",(()=>{NotFound.classList.add("hidden")})),navigator.mediaSession.setActionHandler("play",(()=>{MusicAudio.play()})),navigator.mediaSession.setActionHandler("pause",(()=>{MusicAudio.pause()})),navigator.mediaSession.setActionHandler("previoustrack",(()=>{PreviousSong()})),navigator.mediaSession.setActionHandler("nexttrack",(()=>{NextSong()})),navigator.mediaSession.setActionHandler("seekto",(function(e){MusicAudio.seek(e.seekTime)})),GetPlaylist();