import axios from "axios";
import Gun from "gun/gun";
import "gun/sea";
import { writable } from "svelte/store";

export const db = Gun({
  peers: [
    "https://peer.wallie.io/gun",
    "https://gun-manhattan.herokuapp.com/gun",
  ],
});

export const user = db.user().recall({ sessionStorage: true });
export const isLoggedin = writable(false);
export const profilepic = writable("");
export const username = writable("");
export const userstate = writable("");
export const posts = writable([]);
export const userkeys = writable();

// db.user().create("admin123123", "admin123123");
// db.user().auth("admin123123", "admin123123", true);

axios.get("https://freeipapi.com/api/json").then((response) => {
  let city = "Haryana" || response.data.regionName;
  userstate.set(city);
  console.log("user city set as", city);
});

db.on("auth", (ack) => {
  console.log("user logged in");
  userkeys.set(ack.sea);
  isLoggedin.set(true);
  user.get("profilepic").once((pic) => {
    profilepic.set(pic);
  });

  user.get("alias").once((name) => {
    username.set(name);
  });

  user
    .get("posts")
    .map()
    .once((post) => {
      console.log(post);
    });
});
