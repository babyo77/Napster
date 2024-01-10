importScripts("https://cdn.socket.io/4.7.2/socket.io.min.js");
const Napster = io("http://172.20.10.2:3000"|| "https://subtle-mite-babyo77.koyeb.app");

Napster.on("connect", () => {
  postMessage(["connected"]);
});
Napster.on("PlaySong", (song, cover, title, artist) => {
  postMessage(["Play", song]);
});
Napster.on("seek", (song) => {
  postMessage(["seek", song]);
});
Napster.on("Joined", () => {
  postMessage(["joined"]);
});
Napster.on("like", () => {
  postMessage(["like"]);
});
Napster.on("UserLeft", () => {
  postMessage(["userLeft"]);
});

onmessage = (e) => {
  const input = e.data;
  if (input[0] == "play") {
    Napster.emit("play", {
      id: input[1],
      song: input[2],
      cover: input[3] || null,
      title: input[4] || null,
      artist: input[5] || null,
    });
  } else if (input[0] == "joinRoom") {
    Napster.emit("JoinRoom", { id: input[1], song: input[2] });
  } else if (input[0] == "seek") {
    Napster.emit("seek", { id: input[1], seek: input[2] });
  }
   else if (input[0] == "liked") {
    Napster.emit("liked", { id: input[1], seek: input[2] });
  }
};
