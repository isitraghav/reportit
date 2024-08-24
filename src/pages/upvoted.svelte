<script>
  import { Navbar, Page } from "framework7-svelte";
  import { user } from "../js/database";

  user
    .get("upvotedposts")
    .map()
    .once((posts) => {
      console.log(posts);
    });
</script>

<Page name="upvoted">
  <Navbar backLink title="Upvoted" />
</Page>
