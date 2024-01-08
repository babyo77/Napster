"use strict";
const Previous = document.querySelectorAll(".PreviousSong");
const Play = document.querySelectorAll(".PlaySong");
const Pause = document.querySelectorAll(".PauseSong");
const Next = document.querySelectorAll(".NextSong");
const Loading = document.querySelectorAll(".Loading");
const Progress = document.querySelectorAll(".Progress");
const ClosePlayer = document.querySelectorAll(".ClosePlayer");
const Player = document.querySelector(".Player");
const Content = document.querySelector(".Content");
const ShareNapster = document.querySelector(".ShareNapster");
const Search = document.querySelector(".Search");
const ErrorDiv = document.querySelector(".Error");
const Refresh = document.querySelector(".Refresh");

const Loader = document.querySelector(".loader");
const SongLoader = document.querySelectorAll(".songLoader");
const LoadPlaylist = document.querySelector(".LoadPlaylist");
const AllSongs = document.querySelector(".AllSongs");
const worker = new Worker("../script/worker.js");
const views = new Worker("../script/views.js");
const url = new URLSearchParams(window.location.search);
const SongsFragment = document.createDocumentFragment();
const Share = document.querySelector(".Share");
const Transfer = document.querySelector(".Transfer");
let FocusSong;
let touchStartX;

let CurrentCover = document.querySelectorAll(".CurrentCover");
let CurrentSongTitle = document.querySelector(".CurrentSongTitle");
let CurrentSongTitle2 = document.querySelector(".CurrentSongTitle2");
let CurrentArtist = document.querySelectorAll(".CurrentArtist");
let FetchSongs = [];
let PlaylistUrl;
let SongPlaying =
  parseInt(localStorage.getItem("song")) || parseInt(url.get("song")) || 0;
let MusicAudio;

function GetPlaylist() {
  if (url.get("playlist")) {
    PlaylistUrl = `https://music-info-api.vercel.app/?url=${url.get(
      "playlist"
    )}`;
  } else {
    PlaylistUrl =
      "https://music-info-api.vercel.app/?url=PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS";
  }
  FetchPlaylist();
}

function FetchPlaylist() {
  fetch(PlaylistUrl)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res.json();
    })
    .then((songs) => {
      FetchSongs = songs;
      views.postMessage("Count");
    })
    .then(() => {
      DisplayPlaylist(FetchSongs);
    })
    .catch((error) => {
      ErrorDiv.classList.remove("hidden");
      console.log(error.message);
    });
}

function DisplayPlaylist(FetchSongs, query) {
  for (let i = 0; i < FetchSongs.length; i++) {
    const song = FetchSongs[i];
    const songContainer = document.createElement("div");
    songContainer.classList.add(
      "flex",
      "cursor-pointer",
      "song",
      "mb-1",
      "border",
      "justify-between",
      "items-center",
      "border-none",
      "hover:bg-zinc-900",
      "p-3"
    );

    const leftContainer = document.createElement("div");
    leftContainer.classList.add("flex", "gap-2", "items-center");

    const loaderSpan = document.createElement("span");
    loaderSpan.classList.add(
      "loader",
      "flex",
      "overflow-hidden",
      "h-12",
      "w-12",
      "rounded-md",
      "justify-center",
      "items-center"
    );
    loaderSpan.innerHTML = `<img loading="lazy" class="h-[100%] w-[100%] object-cover" src="${song.cover}" alt=${song.title}>`;
    const textContainer = document.createElement("div");
    textContainer.classList.add("text-white");

    const songName = document.createElement("h3");
    songName.classList.add(
      "truncate",
      "max-md:text-[.91rem]",
      "mb-0.5",
      "max-md:w-[73vw]",
      "GradientText"
    );
    songName.id = `text${song.id}`;
    songName.textContent = song.title;

    const artistName = document.createElement("h3");
    artistName.classList.add("text-[.7rem]", "text-zinc-400");
    artistName.textContent = song.artist;

    textContainer.appendChild(songName);
    textContainer.appendChild(artistName);
    leftContainer.appendChild(loaderSpan);
    leftContainer.appendChild(textContainer);

    songContainer.id = song.id;

    songContainer.addEventListener("click", () => {
      HideShowLoader(true);
      SongPlaying = song.id;
      PlaySong(SongPlaying);
      ChangeCurrentSong(song.id);
    });
    worker.postMessage(song.audio);
    songContainer.appendChild(leftContainer);

    SongsFragment.appendChild(songContainer);
    AllSongs.appendChild(SongsFragment);
  }
  CurrentCover.src = `${FetchSongs[SongPlaying].cover}`;
  CurrentArtist.textContent = FetchSongs[SongPlaying].artist;
  CurrentSongTitle.textContent = FetchSongs[SongPlaying].title;
  CurrentSongTitle2.textContent = FetchSongs[SongPlaying].title;

  RemoveDefaultLoaders();
  FocusSong = document.querySelectorAll(".song");
  HideShowLoader(false, true);
  if (query) {
    HideShowLoader(true);
    localStorage.clear();
    return;
  }
  AddEventListeners();
}

function RemoveDefaultLoaders() {
  Loading.forEach((loader) => {
    loader.remove();
  });
}

function AddEventListeners() {
  Play.forEach((Play) => {
    Play.addEventListener("click", () => {
      PlayPause();
    });
  });

  Pause.forEach((Pause) => {
    Pause.addEventListener("click", () => {
      PlayPause();
    });
  });

  Next.forEach((Next) => {
    Next.addEventListener("click", () => {
      NextSong();
    });
  });

  Previous.forEach((Previous) => {
    Previous.addEventListener("click", () => {
      PreviousSong();
    });
  });

  CurrentCover.forEach((currentCover) => {
    currentCover.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );

    currentCover.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (deltaX > 50) {
          PreviousSong();
        } else if (deltaX < -50) {
          NextSong();
        }
      },
      { passive: true }
    );
  });

  ClosePlayer.forEach((ClosePlayer) => {
    ClosePlayer.addEventListener("click", () => {
      setTimeout(() => {
        Player.classList.remove("slide-in-top", "max-md:block");
      }, 500);

      Player.classList.add("slide-down-top");
    });
  });
  Content.addEventListener("click", () => {
    Player.classList.remove("slide-down-top");
    Player.classList.add("max-md:block", "slide-in-top");
  });
}

Share.addEventListener("click", async () => {
  const Location = window.location.href.replace("?share&song=");
  if (navigator.share) {
    await navigator.share({
      title: "Napster",
      text: `${FetchSongs[SongPlaying].title} by ${FetchSongs[SongPlaying].artist}`,
      url: Location + `?share&song=${SongPlaying}`,
    });
  } else {
    alert("Unable To Share");
  }
});

Search.addEventListener("click", () => {
  FetchQuery();
});

Transfer.addEventListener("click", () => {
  window.open("https://www.tunemymusic.com/transfer");
});

ShareNapster.addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Napster",
      text: `Listen Your Playlist Ad Free `,
      url: window.location.origin,
    });
  } else {
    alert("Unable To Share");
  }
});

LoadPlaylist.addEventListener("click", () => {
  const url = prompt("Enter Youtube Playlist URL");
  if (url.trim() !== "") {
    localStorage.setItem("song", 0);
    const newURL = url.replace(
      /^https?:\/\/youtube\.com\/playlist\?list=|&feature=shared$/g,
      ""
    );
    window.location.href = window.location.origin + `?playlist=${newURL}`;
  }
});

Refresh.addEventListener("click", () => {
  localStorage.setItem("song", 0);
  window.location.href = window.location.origin;
  ErrorDiv.classList.add("hidden");
});

function ChangeCurrentSong(index) {
  CurrentSongTitle.classList.remove("marquee");
  CurrentSongTitle.textContent = FetchSongs[index].title;
  CurrentSongTitle2.textContent = FetchSongs[index].title;

  CurrentCover.forEach((CurrentCover) => {
    CurrentCover.src =
      FetchSongs[SongPlaying].cover ||
      `https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`;
  });

  CurrentArtist.forEach((CurrentArtist) => {
    CurrentArtist.textContent = FetchSongs[index].artist;
  });
}

function AddMarquee() {
  if (CurrentSongTitle.textContent.length > 23 && window.innerWidth <= 600) {
    CurrentSongTitle.classList.add("marquee");
  }
}

function PlaySong(index) {
  localStorage.setItem("song", index);
  const SongId = FetchSongs[SongPlaying].audio.replace(
    "https://www.youtube.com/watch?v=",
    ""
  );

  ChangeCurrentSong(SongPlaying);
  FocusCurrentSong(SongPlaying);
  if (MusicAudio) {
    MusicAudio.stop();
  }
  MusicAudio = new Howl({
    src: [`https://stream-yiue.onrender.com?url=${FetchSongs[index].audio}`],
    html5: true,
    onplay: function () {
      Play.forEach((Play) => {
        Play.classList.add("hidden");
      });
      Pause.forEach((Pause) => {
        Pause.classList.remove("hidden");
      });
      HideShowLoader(false);
      requestAnimationFrame(self.step.bind(self));
      SeekBar();
    },
    onseek: function () {
      requestAnimationFrame(self.step.bind(self));
    },
    onpause: function () {
      HideShowLoader(false);
      Play.forEach((Play) => {
        Play.classList.remove("hidden");
      });
      Pause.forEach((Pause) => {
        Pause.classList.add("hidden");
      });
    },
    onend: function () {
      NextSong();
    },
    onload: function () {
      HideShowLoader(false);
      AddMarquee();
      Progress.forEach((Progress) => {
        Progress.max = MusicAudio.duration();
      });
    },
    onloaderror: function (error) {
      if (error) {
        HideShowLoader(true);
        console.log("Music Playback",error);
        
      }
    },
  });
  SetMediaSession();

  MusicAudio.play();
}

function step() {
  var seek = MusicAudio.seek() || 0;

  Progress.forEach((Progress) => {
    Progress.value = seek;
  });

  if (MusicAudio.playing()) {
    requestAnimationFrame(self.step.bind(self));
  }
}

function NextSong() {
  if (SongPlaying == FetchSongs.length - 1) {
    SongPlaying = 0;
  } else {
    SongPlaying++;
  }
  HideShowLoader(true);
  PlaySong(SongPlaying);
}

function PreviousSong() {
  if (SongPlaying > 0) {
    HideShowLoader(true);
    SongPlaying--;
    PlaySong(SongPlaying);
  }
}

function PlayPause() {
  HideShowLoader(true);
  if (MusicAudio.playing()) {
    MusicAudio.pause();
  } else {
    MusicAudio.play();
  }
}

function HideShowLoader(show, playing) {
  if (show) {
    SongLoader.forEach((SongLoader) => {
      SongLoader.classList.remove("hidden");
    });
    Play.forEach((Play) => {
      Play.classList.add("hidden");
    });
    Pause.forEach((Pause) => {
      Pause.classList.add("hidden");
    });
  } else {
    SongLoader.forEach((SongLoader) => {
      SongLoader.classList.add("hidden");
    });
    if (playing) {
      PlaySong(SongPlaying);
      Play.forEach((Play) => {
        Play.classList.remove("hidden");
      });
    }
  }
}

function FocusCurrentSong(id) {
  if (FocusSong) {
    for (let i = 0; i < FocusSong.length; i++) {
      const song = FocusSong[i];
      if (song.classList.contains("bg-zinc-900"))
        song.classList.remove("bg-zinc-900");
    }
  }

  const GradientText = document.querySelectorAll(`.GradientText`);
  for (let i = 0; i < GradientText.length; i++) {
    const text = GradientText[i];
    text.classList.remove("text-[#8678f9]");
  }
  const myDiv = document.getElementById(id);
  myDiv.focus();
  const currentText = document.getElementById(`text${id}`);

  currentText.classList.add("text-[#8678f9]");
  myDiv.scrollIntoView({ behavior: "smooth" });
  AllSongs.children.item(id).classList.add("bg-zinc-900");
}

function SetMediaSession() {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: FetchSongs[SongPlaying].title,
    artist: FetchSongs[SongPlaying].artist,
    artwork: [
      {
        src:
          FetchSongs[SongPlaying].cover ||
          `https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`,
      },
    ],
  });
}

navigator.mediaSession.setActionHandler("play", () => {
  MusicAudio.play();
});
navigator.mediaSession.setActionHandler("pause", () => {
  MusicAudio.pause();
});
navigator.mediaSession.setActionHandler("previoustrack", () => {
  PreviousSong();
});
navigator.mediaSession.setActionHandler("nexttrack", () => {
  NextSong();
});
navigator.mediaSession.setActionHandler("seekto", function (seek) {
  MusicAudio.seek(seek.seekTime);
});

function SeekBar() {
  Progress.forEach((Progress) => {
    Progress.addEventListener("input", (e) => {
      MusicAudio.seek(e.target.value);
    });
  });
}

// function newHowl(SongId) {
//   fetch(
//     `https://server333-rx3g.onrender.com/player?s=${SongId}&a=Paradox`
//   ).then((res) => {
//     if (res.ok) {
//       ChangeCurrentSong(SongPlaying);
//       FocusCurrentSong(SongPlaying);
//       if (MusicAudio) {
//         MusicAudio.stop();
//       }
//       MusicAudio = new Howl({
//         src: [`https://server333-rx3g.onrender.com/static/temp/${SongId}.mp3`],
//         html5: true,
//         onplay: function () {
//           Play.forEach((Play) => {
//             Play.classList.add("hidden");
//           });
//           Pause.forEach((Pause) => {
//             Pause.classList.remove("hidden");
//           });
//           HideShowLoader(false);
//           requestAnimationFrame(self.step.bind(self));
//           SeekBar();
//         },
//         onseek: function () {
//           requestAnimationFrame(self.step.bind(self));
//         },
//         onpause: function () {
//           HideShowLoader(false);
//           Play.forEach((Play) => {
//             Play.classList.remove("hidden");
//           });
//           Pause.forEach((Pause) => {
//             Pause.classList.add("hidden");
//           });
//         },
//         onend: function () {
//           NextSong();
//         },
//         onload: function () {
//           HideShowLoader(false);
//           AddMarquee();
//           Progress.forEach((Progress) => {
//             Progress.max = MusicAudio.duration();
//           });
//         },
//         onloaderror: function (error) {
//           if (error) {
//             HideShowLoader(false);
//             console.log("Going server 2");
//             newHowl(SongPlaying);
//           }
//         },
//       });
//       SetMediaSession();

//       MusicAudio.play();
//     }
//   });
// }

function FetchQuery() {
  const query = prompt("Search");
  if (query.trim() !== "") {
    fetch(`https://music-info-api.vercel.app/${query}`)
      .then((res) => {
        if (res.status == 500) {
          throw new Error("Error");
        }
        return res.json();
      })
      .then((query) => {
        while (AllSongs.firstChild) {
          AllSongs.removeChild(AllSongs.firstChild);
        }
        FetchSongs = query;
        SongPlaying = 0;
        DisplayPlaylist(FetchSongs, query);
      })
      .catch((err) => {
        ErrorDiv.classList.remove("hidden");
        console.log(err);
      });
  }
}

GetPlaylist();
