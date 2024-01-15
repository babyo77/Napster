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
const NotFound = document.querySelector(".NotFound");
const Refresh = document.querySelector(".Refresh");
const SearchAgain = document.querySelector(".SearchAgain");
const Connected = document.querySelector(".Connected");
const SharePlayButton = document.querySelector(".SharePlayButton");
const SharePlayDiv = document.querySelector(".SharePlay");
const Invite = document.querySelector(".Invite");
const YourRoomId = document.querySelector(".RoomID");
const LikeDiv = document.querySelector(".LikeDiv");
const Like = document.querySelector(".Like");
const fullScreen = document.querySelector(".Full");
const NAPSTER = document.querySelector(".NAPSTER");

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
const News = document.querySelector(".News");
let FocusSong;
let touchStartX;
let liked;
let Connection;
let RoomId = url.get("room") || generateRoomId();

let CurrentCover = document.querySelectorAll(".CurrentCover");
let CurrentSongTitle = document.querySelector(".CurrentSongTitle");
let CurrentSongTitle2 = document.querySelector(".CurrentSongTitle2");
let CurrentSongTitle3 = document.querySelector(".CurrentSongTitle3");
let CurrentArtist = document.querySelectorAll(".CurrentArtist");
let CurrentDuration = document.querySelectorAll(".Start");
let TotalDuration = document.querySelectorAll(".End");
let FetchSongs = [];
let PlaylistUrl;
let SongPlaying =
  parseInt(url.get("song")) || parseInt(localStorage.getItem("song")) || 0;
let MusicAudio;
YourRoomId.textContent = RoomId;

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
      SharePlay("play");
    });
    songContainer.appendChild(leftContainer);

    SongsFragment.appendChild(songContainer);
    AllSongs.appendChild(SongsFragment);
  }
  FocusSong = document.querySelectorAll(".song");

  if (query) return;

  CurrentCover.src = `${FetchSongs[SongPlaying].cover}`;
  CurrentArtist.textContent = FetchSongs[SongPlaying].artist;
  CurrentSongTitle.textContent = FetchSongs[SongPlaying].title;
  CurrentSongTitle2.textContent = FetchSongs[SongPlaying].title;
  CurrentSongTitle3.textContent = FetchSongs[SongPlaying].title;

  RemoveDefaultLoaders();

  HideShowLoader(false, true);

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
      SharePlay("play");
    });
  });

  Previous.forEach((Previous) => {
    Previous.addEventListener("click", () => {
      PreviousSong();
      SharePlay("play");
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

  SeekBar();
}

Share.addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Napster",
      text: `${FetchSongs[SongPlaying].title} by ${FetchSongs[SongPlaying].artist}`,
      url:
        window.location.origin +
        `?room=${RoomId}` +
        `&playlist=${
          url.get("playlist") || "PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"
        }` +
        `&share&song=${SongPlaying}`,
    });
  } else {
    alert("Unable To Share");
  }
});

Search.addEventListener("click", () => {
  const query = prompt("Search");
  if (query && query.trim() !== "") {
    FetchQuery(query);
  }
});

Transfer.addEventListener("click", () => {
  window.open("https://www.tunemymusic.com/transfer");
});

ShareNapster.addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Napster",
      text: `Listen Your Playlist Ad Free `,
      url: window.location.origin + (`?playlist=${url.get("playlist")}` || ""),
    });
  } else {
    navigator.clipboard.writeText(
      window.location.origin + (`?playlist=${url.get("playlist")}` || "")
    );
    alert("Copied To Clipboard");
  }
});

LoadPlaylist.addEventListener("click", () => {
  if (
    window.location.href.includes("?room") &&
    SharePlayButton.classList.contains("fill-green-500")
  ) {
    alert("Not available on Share Play 🦄 wait for update 🚀");
    return;
  }
  const playlist = prompt("Enter Youtube Playlist URL");
  if (playlist && playlist.trim() !== "") {
    localStorage.setItem("song", 0);
    const newURL = playlist.replace(
      /^https?:\/\/youtube\.com\/playlist\?list=|&feature=shared$/g,
      ""
    );
    FetchQuery(
      `?url=${newURL || "PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"}`
    );
  }
});

Refresh.addEventListener("click", () => {
  localStorage.setItem("song", 0);
  window.location.href = window.location.origin;
  ErrorDiv.classList.add("hidden");
});

SearchAgain.addEventListener("click", () => {
  NotFound.classList.add("hidden");
});

Connected.addEventListener("click", () => {
  Connected.classList.add("hidden");
});

SharePlayButton.addEventListener("click", () => {
  SharePlayDiv.classList.remove("hidden");
});

SharePlayDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("Invite")) {
    e.stopPropagation();
  } else {
    SharePlayDiv.classList.add("hidden");
  }
});

Invite.addEventListener("click", async (e) => {
  SharePlay("joinRoom");
  const InviteLink =
    window.location.origin +
    `?room=${RoomId}` +
    `&playlist=${url.get("playlist") || "PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"}` +
    `&share&song=${SongPlaying}`;
  if (navigator.share) {
    await navigator.share({
      title: "Napster",
      text: `Napster Share Play invite link`,
      url: InviteLink,
    });
    SharePlayButton.classList.add("animate-pulse");
    history.pushState({}, "", `?room=${roomId}`);
  } else {
    navigator.clipboard.writeText(InviteLink);
    alert("Copied To Clipboard");
  }
  SharePlayDiv.classList.add("hidden");
  e.stopPropagation();
});

News.addEventListener("click", () => {
  News.classList.add("hidden");
  localStorage.setItem("news", true);
});

Like.addEventListener("click", () => {
  LikeDiv.classList.remove("hidden");

  clearTimeout(liked);
  liked = setTimeout(() => {
    LikeDiv.classList.add("hidden");
  }, 4000);
  SharePlay("liked");
});

NAPSTER.addEventListener("click", () => {
  FetchQuery(
    `?url=${url.get("playlist") || "PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS"}`
  );
});

function ChangeCurrentSong() {
  CurrentSongTitle.classList.remove("marquee");
  CurrentSongTitle.textContent = FetchSongs[SongPlaying].title;
  CurrentSongTitle2.textContent = FetchSongs[SongPlaying].title;
  CurrentSongTitle3.textContent = FetchSongs[SongPlaying].title;

  CurrentCover.forEach((CurrentCover) => {
    CurrentCover.src =
      FetchSongs[SongPlaying].cover ||
      `https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`;
  });

  CurrentArtist.forEach((CurrentArtist) => {
    CurrentArtist.textContent = FetchSongs[SongPlaying].artist;
  });
}

function AddMarquee() {
  if (CurrentSongTitle.textContent.length > 23 && window.innerWidth <= 600) {
    CurrentSongTitle.classList.add("marquee");
  }
}

function step() {
  var seek = MusicAudio.seek() || 0;
  Progress.forEach((Progress) => {
    Progress.value = seek;
    CurrentDuration.forEach((CurrentDuration) => {
      CurrentDuration.textContent = formatDuration(MusicAudio.seek());
    });
  });

  if (MusicAudio.playing()) {
    requestAnimationFrame(self.step.bind(self));
  }
}

function NextSong() {
  if (window.location.href.includes("&song")) {
    history.pushState({}, "", window.location.href.replace("&song", ""));
  }
  if (SongPlaying == FetchSongs.length - 1) {
    SongPlaying = 0;
  } else {
    SongPlaying++;
  }
  HideShowLoader(true);
  PlaySong();
}

function PreviousSong() {
  if (SongPlaying > 0) {
    HideShowLoader(true);
    SongPlaying--;
    PlaySong();
  }
}

function PlayPause() {
  if (MusicAudio) {
    HideShowLoader(true);
    if (MusicAudio.playing()) {
      MusicAudio.pause();
    } else {
      MusicAudio.play();
    }
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
      if (url.has("room")) {
        SharePlay("seek", e.target.value);
      }
    });
  });
}

function FetchQuery(query) {
  if (
    window.location.href.includes("?room") &&
    SharePlayButton.classList.contains("fill-green-500")
  ) {
    alert("Not available on Share Play 🦄 wait for update 🚀");
    return;
  }

  fetch(`https://music-info-api.vercel.app/${query}`)
    .then((res) => {
      if (res.status == 500) {
        throw new Error("Error");
      }
      return res.json();
    })
    .then((query) => {
      if (query.length > 0) {
        while (AllSongs.firstChild) {
          AllSongs.removeChild(AllSongs.firstChild);
        }
        FetchSongs = query;
        SongPlaying = -1;
        DisplayPlaylist(FetchSongs, query);
      } else {
        NotFound.classList.remove("hidden");
      }
    })
    .catch((err) => {
      NotFound.classList.remove("hidden");
      console.log(err.message);
    });
}

function PlaySong(song, cover, title, artist) {
  ChangeCurrentSong(SongPlaying);
  FocusCurrentSong(SongPlaying);
  if (MusicAudio) {
    MusicAudio.stop();
  }
  const songID = FetchSongs[SongPlaying].audio.replace(
    "https://www.youtube.com/watch?v=",
    ""
  );
  MusicAudio = new Howl({
    src: [`https://unconscious-elianora-babyo7.koyeb.app/?url=${songID}`],
    html5: true,
    onplay: function () {
      localStorage.setItem("song", SongPlaying);
      Play.forEach((Play) => {
        Play.classList.add("hidden");
      });
      Pause.forEach((Pause) => {
        Pause.classList.remove("hidden");
      });
      HideShowLoader(false);
      requestAnimationFrame(self.step.bind(self));
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
      TotalDuration.forEach((TotalDuration) => {
        TotalDuration.textContent = formatDuration(MusicAudio.duration());
      });
      HideShowLoader(false);
      AddMarquee();
      Progress.forEach((Progress) => {
        Progress.max = MusicAudio.duration();
      });
    },
    onloaderror: function (e, m) {
      if (e) {
        console.log("server doing sex");
      }
    },
    onplayerror: function (e, m) {
      if (e) {
        console.log(`song play error ${m}`);
      }
    },
  });
  SetMediaSession();

  MusicAudio.play();
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

function SharePlay(option, seek) {
  if (option == "play") {
    worker.postMessage(["play", RoomId, SongPlaying]);
  } else if (option == "joinRoom") {
    worker.postMessage(["joinRoom", RoomId, SongPlaying]);
  } else if (option == "seek") {
    worker.postMessage(["seek", RoomId, seek]);
  } else if (option == "liked") {
    worker.postMessage(["liked", RoomId, seek]);
  }
}

worker.onmessage = (e) => {
  const message = e.data;
  if (message[0] == "connected") {
    // console.log("connected");
  } else if (message[0] == "Play") {
    SongPlaying = parseInt(message[1]);
    PlaySong();
  } else if (message[0] == "joined") {
    Connected.classList.remove("hidden");
    Like.classList.remove("hidden");
    clearTimeout(Connection);
    Connection = setTimeout(() => {
      Connected.classList.add("hidden");
    }, 1100);
    SharePlayButton.classList.replace("fill-red-500", "fill-green-500");
    SharePlayButton.classList.remove("animate-pules");
  } else if (message[0] == "seek") {
    MusicAudio.seek(parseInt(message[1]));
  } else if (message[0] == "userLeft") {
    SharePlayButton.classList.replace("fill-green-500", "fill-red-500");
    SharePlayButton.classList.add("animate-pules");
    Like.classList.add("hidden");
  } else if (message[0] == "like") {
    LikeDiv.classList.remove("hidden");

    clearTimeout(liked);
    liked = setTimeout(() => {
      LikeDiv.classList.add("hidden");
    }, 4000);
  }
};

if (url.has("room")) {
  SharePlay("joinRoom");
}

if (localStorage.getItem("news")) {
  News.classList.add("hidden");
}

function generateRoomId() {
  const uniqueId = Math.random().toString(36).substr(2, 6);
  return "napster" + uniqueId;
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fullScreen.classList.replace("hidden", "flex");
    document.body.requestFullscreen();
  }
  if (e.key == " ") {
    PlayPause();
    console.log("ok");
  }
  if (e.key === "ArrowRight") {
    NextSong();
  }
  if (e.key === "ArrowLeft") {
    PreviousSong();
  }
});

document.addEventListener("fullscreenchange", function () {
  if (!document.fullscreenElement) {
    fullScreen.classList.replace("opacity-1", "opacity-0");
    fullScreen.classList.replace("flex", "hidden");
  } else {
    fullScreen.classList.replace("hidden", "flex");
    fullScreen.classList.replace("opacity-0", "opacity-1");
  }
});

GetPlaylist();
