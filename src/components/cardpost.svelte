<script>
  import {
    Card,
    CardHeader,
    CardFooter,
    Icon,
    f7,
    Link,
  } from "framework7-svelte";
  // import { db, user, userData } from "../js/database";
  export let p;

  import moment from "moment";
  import { db, isLoggedin, userkeys, userstate } from "../js/database";
  // import { onMount } from "svelte";

  // let upvotes = p.upvotes || [];
  // let upvoted = false;

  // $: upvoted = user?.is?.pub ? upvotes.includes(user.is.pub) : false;

  // function likePost() {
  //   if (upvoted == true) {
  //     return;
  //   }
  //   console.log(upvotes);
  //   let graph = db.get(`${$userData.cityName}upvote`).get(p.id);
  //   graph.get(user.is.pub).put(user.is.pub);
  //   upvotes = [...upvotes, user.is.pub];
  //   upvoted = true;
  // }

  // // let downvotes = [];
  // // function dislikepost() {
  // //   db.get(`${$userData.cityName}downvote`)
  // //     .get(p.id)
  // //     .get(user.is.pub)
  // //     .put(user.is.pub);
  // //   downvotes = [...downvotes, user.is.pub];
  // // }

  // // db.get(`${$userData.cityName}-downvote`)
  // //   .get(p.id)
  // //   .once()
  // //   .map((a, b) => {
  // //     // console.log(a);
  // //     downvotes = [...downvotes, a];
  // //   });

  // function filter() {
  //   // if (p.upvotes.includes(user.is.pub)) {
  //   //   p.upvoted = true;
  //   // } else {
  //   //   p.upvoted = false;
  //   // }

  //   upvotes = upvotes.filter(
  //     (value, index, self) => index === self.findIndex((t) => t === value)
  //   );

  //   // p.downvotes = p.downvotes.filter(
  //   //   (value, index, self) => index === self.findIndex((t) => t === value),
  //   // );
  // }

  // $: upvotes, filter();

  let upvoted = false;
  let upvotes = p.upvotes;

  function likePost() {
    if (upvoted) {
      return;
    }
    db.get(`${$userstate}upvote`)
      .get(p.id)
      .get($userkeys.pub)
      .put(true, (ack) => {
        if (ack.err) {
          console.log(ack.err);
        }
      });

    upvoted = true;
    upvotes = [...upvotes, $userkeys.pub];
  }

  userkeys.subscribe((data) => {
    if (data) {
      if (upvotes.includes(data.pub)) {
        upvoted = true;
      }
    }
  });
</script>

<Card outline footerDivider>
  <CardHeader>
    <div class="flex flex-col w-full">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="text-xl flex w-full">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="text-lg">
          <Link href={`/user/${p.user}`}>
            @{p.username}
          </Link>
        </div>
        <div class="ml-auto uppercase mr-2">
          {#if p.nsfw}
            <span class="text-red-600">
              <Icon ios="f7:eye_slash_fill" size="20px" />
            </span>
          {/if}
        </div>
      </div>
      <div class="text-xs text-gray-500">
        {moment(p.timestamp).calendar()}
      </div>
    </div>
  </CardHeader>
  <p class="pl-4 mb-3 text-xs line-clamp-3">
    {p.content}
  </p>
  <CardFooter>
    <div class="flex gap-3">
      <button on:click={likePost}>
        <Icon ios="f7:arrow_up" color={upvoted ? "#8e1c1c" : ""} size="17px" />
        {#if upvotes}
          {upvotes.length}
        {/if}
      </button>
    </div>
    <!-- <button class="ml-auto w-10">
      <Icon ios="f7:bubble_middle_bottom_fill" size="20px" />
    </button> -->
  </CardFooter>
</Card>
