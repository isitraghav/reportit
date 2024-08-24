<script>
  import {
    Page,
    Navbar,
    List,
    ListInput,
    ListItem,
    Toggle,
    BlockTitle,
    Button,
    Range,
    Block,
    Icon,
    Card as CardE,
    ListButton,
    CardContent,
  } from "framework7-svelte";
  import { db, userstate } from "../js/database";
  import Nopostscard from "../components/nopostscard.svelte";
  import Cardpost from "../components/cardpost.svelte";

  export let id;
  console.log(id);
  let postids = [];
  let posts = [];
  let username, profilepic;
  db.user(`${id}`)
    .get("profilepic")
    .on((pic) => {
      if (pic) {
        profilepic = pic;
      }
    });
  db.user(`${id}`)
    .get("alias")
    .once((a) => {
      if (a) {
        username = a;
      }
    });

  db.user(`${id}`)
    .get("posts")
    .map((a) => {
      if (a) {
        if (
          new Object(a).hasOwnProperty("version") &&
          !postids.includes(a.id)
        ) {
          if (a.version !== 2) {
            return;
          }
          a.username = username;
          db.get(`${$userstate}upvote`)
            .get(a.id)
            .once((upvotes) => {
              if (!upvotes) {
                upvotes = [];
              }
              let upvote_array = [];
              delete upvotes._;
              Object.entries(upvotes).forEach(([key, value]) => {
                if (value) {
                  upvote_array = [...upvote_array, key];
                }
              });
              a.upvotes = upvote_array;
              postids = [...postids, a.id];
              posts = [a, ...posts];
            });
        }
      }
    });

  //   userData.subscribe((data) => {
  //     if (data) {
  //       profilepic_graph = user.get("profile").get("profilepic");
  //       profilepic_graph.on((pic) => {
  //         // console.log(pic);
  //         if (pic) {
  //           profilepic = pic;
  //         }
  //       });

  //       user.get("alias").on((a) => {
  //         name = a;
  //       });

  //       user.get("posts").map((a, b) => {
  //         user
  //           .get("posts")
  //           .get(b)
  //           .once((a) => {
  //             console.log(a);
  //             let upvotes = [];
  //             db.get(`${$userData.cityName}upvote`)
  //               .get(a.id)
  //               .map((a, b) => {
  //                 upvotes = [...upvotes, a];
  //               });

  //             a.username = name;
  //             a.upvotes = upvotes;
  //             posts = [a, ...posts];
  //           });
  //       });
  //     }
  //   });

  //   function filter() {
  //     posts = posts
  //       .filter(
  //         (value, index, self) =>
  //           index ===
  //           self.findIndex(
  //             (t) => t.title === value.title && t.content === value.content
  //           )
  //       )
  //       .sort(
  //         (a, b) =>
  //           new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  //       );
  //   }

  //   $: posts, filter();
</script>

<Page name="profile">
  <Navbar backLink title="Profile" />
  <div>
    <div class="relative">
      <img
        class="rounded-full m-auto aspect-square object-cover mt-2 w-32 filter brightness-50"
        src={profilepic ||
          "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"}
        alt=""
      />
    </div>
    <div class="flex text-lg items-center justify-center">
      <span class="m-auto">@{username}</span>
    </div>
  </div>
  <div>
    <BlockTitle>Posts</BlockTitle>
    {#if posts.length == 0}
      <Nopostscard />
    {/if}
    {#each posts as p}
      {#key p.id}
        <Cardpost {p} />
      {/key}
    {/each}
  </div>
</Page>
