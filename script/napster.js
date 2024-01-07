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

const Loader = document.querySelector(".loader");
const SongLoader = document.querySelectorAll(".songLoader");
const LoadPlaylist = document.querySelector(".LoadPlaylist");
const AllSongs = document.querySelector(".AllSongs");
const url = new URLSearchParams(window.location.search);
const SongsFragment = document.createDocumentFragment();
const Share = document.querySelector(".Share");
const Transfer = document.querySelector(".Transfer");
let FocusSong;

let CurrentCover = document.querySelectorAll(".CurrentCover");
let CurrentSongTitle = document.querySelector(".CurrentSongTitle");
let CurrentSongTitle2 = document.querySelector(".CurrentSongTitle2");
let CurrentArtist = document.querySelectorAll(".CurrentArtist");
let FetchSongs = [];
let PlaylistUrl;
let SongPlaying = 0;
let MusicAudio;

function GetPlaylist() {
  if (url.get("playlist")) {
    PlaylistUrl = `https://music-info-api.vercel.app/?url=${url.get(
      "playlist"
    )}`;
  } else {
    PlaylistUrl =
      "https://music-info-api.vercel.app/?url=https://youtube.com/playlist?list=PLeVdHaf0Nk496_cnHO1uG2QdywPhpWwOS&feature=shared";
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
    })
    .then(() => {
      DisplayPlaylist();
    })
    .catch((error) => {
      console.log(error.message);
    });
}

function DisplayPlaylist() {
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
    loaderSpan.innerHTML = `<img loading="lazy" class="h-[100%] w-[100%] object-cover" src="https://your-napster.vercel.app/${song.cover}">`;
    const textContainer = document.createElement("div");
    textContainer.classList.add("text-white");

    const songName = document.createElement("h3");
    songName.classList.add(
      "truncate",
      "max-md:text-[.9rem]",
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

    songContainer.appendChild(leftContainer);

    SongsFragment.appendChild(songContainer);
    AllSongs.appendChild(SongsFragment);
  }
  CurrentCover.src = `https://your-napster.vercel.app/${FetchSongs[1].cover}`;
  CurrentArtist.textContent = FetchSongs[0].artist;
  CurrentSongTitle.textContent = FetchSongs[0].title;
  CurrentSongTitle2.textContent = FetchSongs[0].title;
  RemoveDefaultLoaders();
  AddEventListeners();
  HideShowLoader(false, true);
  FocusSong = document.querySelectorAll(".song");
}

function RemoveDefaultLoaders() {
  Loading.forEach((loader) => {
    loader.remove();
  });
}

LoadPlaylist.addEventListener("click", () => {
  const url = prompt("Enter Youtube Playlist URL");
  if (url.trim() !== "") {
    window.location.href = window.location.origin + `?playlist=${url}`;
  }
});

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

  Share.addEventListener("click", async () => {
    if (navigator.share) {
      const location = window.location.replace("?share&song=", "");
      await navigator.share({
        title: "Napster",
        text: `${FetchSongs[SongPlaying].title} by ${FetchSongs[SongPlaying].artist}`,
        url: window.location.href + `?share&song=${SongPlaying}`,
      });
    } else {
      alert("Unable To Share");
    }
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

ShareNapster.addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Napster",
      text: `Listen Ad Free Music`,
      url: window.location.origin,
    });
  } else {
    alert("Unable To Share");
  }
});

Transfer.addEventListener("click", () => {
  window.open("https://www.tunemymusic.com/transfer");
});

function ChangeCurrentSong(index) {
  CurrentSongTitle.classList.remove("marquee");
  CurrentSongTitle.textContent = FetchSongs[index].title;
  CurrentSongTitle2.textContent = FetchSongs[index].title;

  CurrentCover.forEach((CurrentCover) => {
    CurrentCover.src = `https://your-napster.vercel.app/${FetchSongs[index].cover}`;
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
        console.log("Going server 2");
        NextSong();
      }
    },
  });
  SetMediaSession();

  MusicAudio.play();
}

function step() {
  var self = this;

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
        src: `https://your-napster.vercel.app/${FetchSongs[SongPlaying].cover}`,
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

function newHowl(SongId) {
  console.log(`https://thedusic.onrender.com/static/temp/${SongId}.mp3`);
  NextSong();
}

GetPlaylist();
