<script>
  import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavTitleLarge,
    NavRight,
    Link,
    Toolbar,
    Block,
    BlockTitle,
    List,
    ListItem,
    Button,
    Icon,
    f7,
  } from "framework7-svelte";
  import { db, userstate } from "../js/database";
  import Cardpost from "../components/cardpost.svelte";
  import NoPostCard from "../components/nopostscard.svelte";

  let posts = [];
  let postids = [];

  function loadResource(done) {
    db.get($userstate)
      // .map({
      //   ".": {
      //     // "<": new Date().toISOString(),
      //     ">": new Date(+new Date() - 24 * 60 * 60 * 1000).toISOString(),
      //   },
      // })
      .map()
      .once((a) => {
        if (
          new Object(a).hasOwnProperty("version") &&
          !postids.includes(a.id)
        ) {
          if (a.version !== 2) {
            return;
          }
          db.get(`~${a.user}`)
            .get("alias")
            .once((name) => {
              db.get(`~${a.user}`)
                .get("media")
                .get(a.id)
                .once((media) => {
                  if (media) {
                    a.media = JSON.parse(media);
                  }
                });
              a.username = name;
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
            });
        } else {
          console.log("no of posts with no versions");
        }
      });
    done();
  }
  userstate.subscribe((data) => {
    if (data) {
      loadResource(() => {});
    }
  });

  function filter() {
    posts = posts
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.title === value.title && t.content === value.content
          )
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  $: posts, filter();
</script>

<Page name="home" ptr onPtrRefresh={loadResource}>
  <Navbar title="Report.It">
    <NavRight>
      <Button onClick={() => f7.views.main.router.navigate("/profile/")}>
        <Icon f7="person_circle_fill" />
      </Button>
    </NavRight>
  </Navbar>
  <div class="ml-3 mt-3">
    Viewing crimes in : {$userstate}
  </div>
  {#if posts.length === 0}
    <NoPostCard />
  {/if}
  {#each posts as post}
    {#key post.id}
      <Cardpost p={post} />
    {/key}
  {/each}
</Page>
