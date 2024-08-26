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
  import { db, user, profilepic, username } from "../js/database";
  import Nopostscard from "../components/nopostscard.svelte";
  import Cardpost from "../components/cardpost.svelte";

  let posts = [];
  let profilepic_graph;

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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      user.get("profilepic").put(e.target.result);
      console.log("profilepic updated");
    };
    reader.readAsDataURL(selectedFile);
  };

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
        src={$profilepic ||
          "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"}
        alt=""
      />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class="text-3xl font-bold text-white">
          <label for="fileuploaded">
            <Icon ios="f7:camera_fill" />
          </label>
          <input
            type="file"
            id="fileuploaded"
            on:change={handleFileChange}
            accept="image/*"
            class="hidden"
          />
        </span>
      </div>
    </div>
    <div class="flex text-lg items-center justify-center">
      <span class="m-auto">@{$username}</span>
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
