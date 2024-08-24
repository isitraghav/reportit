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

  let posts = [];
  let postids = [];

  userstate.subscribe((data) => {
    if (data) {
      db.get(data)
        .map({
          ".": {
            // "<": new Date().toISOString(),
            ">": new Date(+new Date() - 24 * 60 * 60 * 1000).toISOString(),
          },
        })
        // .map()
        .once((a) => {
          if (
            new Object(a).hasOwnProperty("version") &&
            !postids.includes(a.id)
          ) {
            if (a.version !== 1) {
              return;
            }
            db.get(`~${a.user}`)
              .get("alias")
              .once((name) => {
                a.username = name;
                postids = [...postids, a.id];
                posts = [a, ...posts];
              });
          }
        });
    }
  });

  function filter() {
    posts = posts
      //   .filter(
      //     (value, index, self) =>
      //       index ===
      //       self.findIndex(
      //         (t) => t.title === value.title && t.content === value.content
      //       )
      //   )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  $: posts, filter();
</script>

<Page name="home">
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

  {#each posts as post}
    {#key post.id}
      <Cardpost p={post} />
    {/key}
  {/each}
</Page>
