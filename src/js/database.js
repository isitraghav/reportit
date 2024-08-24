import axios from "axios";
import Gun from "gun/gun";
// import "gun/axe";
// import "gun/lib/store";
// import "gun/lib/radix";
// import "gun/lib/radisk";
// import "gun/lib/rindexed";
import "gun/sea";
import { writable } from "svelte/store";

export const db = Gun({
  peers: ["https://peer.wallie.io/gun"],
  localStorage: true,
});

export const user = db.user();
export const isLoggedin = writable(false);
export const profilepic = writable("");
export const username = writable("");
export const userstate = writable("");
export const posts = writable([]);
export const userkeys = writable();

axios.get("https://freeipapi.com/api/json").then((response) => {
  let city = response.data.regionName;
  userstate.set(city);
  console.log("user city set as", city);
});

if (localStorage.getItem("keys")) {
  console.log("logging in");
  db.user().auth(JSON.parse(localStorage.getItem("keys")));
}

db.on("auth", (ack) => {
  console.log("user logged in");
  userkeys.set(ack.sea);
  localStorage.setItem("keys", JSON.stringify(ack.sea));
  isLoggedin.set(true);
  user.get("profilepic").on((pic) => {
    profilepic.set(pic);
  });

  user.get("alias").once((name) => {
    username.set(name);
  });

  user
    .get("posts")
    .map()
    .once((post) => {
      console.log("okok");
      console.log(post);
    });
});
