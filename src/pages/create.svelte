<script>
  import {
    Page,
    Navbar,
    List,
    ListItem,
    Progressbar,
    ListInput,
    ListButton,
    NavTitle,
    Icon,
    PhotoBrowser,
    f7,
  } from "framework7-svelte";
  //   import { db, user, userData } from "../js/database";

  //   let userData_local;
  //   userData.subscribe((data) => {
  //     userData_local = data;
  //   });

  //   import { v4 as uuidv4 } from "uuid";
  //   let content = "",
  //     nsfw = false;

  //   async function submitEntry() {
  //     uploadingPost = true;
  //     if (!content) {
  //       alert("content is a mandatory field");
  //       uploadingPost = false;
  //       return;
  //     }
  //     console.log(content);

  //     const timestamp = new Date().toISOString();
  //     console.log(timestamp);
  //     let id = uuidv4();

  //     const messageData = {
  //       content: content,
  //       timestamp: timestamp,
  //       nsfw: nsfw,
  //       id: id,
  //       user: user._.sea.pub,
  //     };
  //     console.log(messageData);

  //     user
  //       .get("posts")
  //       .get(id)
  //       .put(messageData, (ack) => {
  //         if (ack.err) {
  //           f7.dialog.alert(ack.err);
  //         } else {
  //           uploadingPost = false;
  //         }
  //       });
  //     console.log("Posting in: ", $userData.cityName);

  //     db.get($userData.cityName).get(timestamp).put(messageData);

  //     console.log(fileids);

  //     user.get("media").get(id).put(JSON.stringify(fileids));

  //     user
  //       .get("media")
  //       .get(id)
  //       .once((a) => {
  //         console.log(a);
  //         uploadingPost = false;
  //       });

  //     console.log(id);
  //     uploadingPost = false;
  //     content = "";
  //     nsfw = false;
  //     fileids = [];
  //     file_thumbs = [];
  //     files = [];
  //   }

  //   let files = [];
  //   let fileids = [];
  //   let file_thumbs = [];
  //   let loading;

  import { UploadClient } from "@uploadcare/upload-client";
  import { v4 as uuidv4 } from "uuid";
  import { userkeys, userstate, db, user } from "../js/database";
  const client = new UploadClient({ publicKey: "421d70fd0043c1facc4f" });

  let popupDark;
  let uploadingPost = false;
  let content = "";
  let nsfw = false;
  let fileids = [];
  let loading = false;
  let fileuploadprogress = 0;

  function submitEntry() {
    console.log("submit entry started");
    console.log(content, nsfw);

    if (!content) {
      f7.dialog.alert("content is a mandatory field");
      return;
    }

    uploadingPost = true;

    const timestamp = new Date().toISOString();
    let id = uuidv4();

    const messageData = {
      content: content,
      timestamp: timestamp,
      nsfw: nsfw,
      id: id,
      user: $userkeys.pub,
      version: 2,
    };

    user
      .get("media")
      .get(id)
      .put(JSON.stringify(fileids), (ack) => {
        if (ack.err) {
          f7.dialog.alert(ack.err);
        } else {
          console.log(ack);
        }
      });

    db.get($userstate)
      .get(timestamp)
      .put(messageData, (ack) => {
        if (ack.err) {
          f7.dialog.alert(ack.err);
        } else {
          console.log(messageData);
          uploadingPost = false;
        }
      });

    user
      .get("posts")
      .get(id)
      .put(messageData, (ack) => {
        uploadingPost = false;
        content = "";
        nsfw = false;
        fileids = [];
        loading = false;
        fileuploadprogress = 0;
      });
  }

  const onProgress = ({ isComputable, value }) => {
    fileuploadprogress = value * 100;
    if (value == 1) {
      loading = false;
      fileuploadprogress = 0;
    } else {
      loading = true;
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          client.uploadFile(file, { onProgress }).then((file) => {
            fileids = [...fileids, `https://ucarecdn.com/${file.uuid}/`];
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };
</script>

<Page name="Create">
  <Navbar>
    <NavTitle>Create A Post</NavTitle>
  </Navbar>

  {#if !uploadingPost}
    <List form inset strong>
      {#if !loading}
        <ListInput
          placeholder="Enter content..."
          resizable
          bind:value={content}
        />
        <ListItem class="p-1 m-auto">
          <label
            class="px-2 text-sm flex gap-2 items-center justify-center py-1 bg-[#282626] rounded-md"
            for="fileupload"
          >
            <Icon size="15px" ios="f7:photo_on_rectangle" /> Upload Images
          </label>
          <input
            type="file"
            id="fileupload"
            multiple
            on:change={handleFileChange}
            accept="image/*"
            max="3"
            class="hidden"
          />
        </ListItem>
        <div class="flex gap-3 w-full p-2 overflow-scroll">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          {#each fileids as file}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="relative w-20 aspect-square object-cover rounded">
              <img
                on:click={() => popupDark.open()}
                class="absolute inset-0 object-cover w-20 aspect-square rounded"
                src={`${file}-/scale_crop/300x300/`}
                alt=""
              />
              <button
                class="absolute flex items-center justify-center top-2 bg-black w-5 h-5 rounded right-2 text-gray-500 hover:text-gray-700"
                on:click={() => {
                  fileids = fileids.filter((f) => f !== file);
                }}
              >
                <Icon size="10px" ios="f7:xmark" />
              </button>
            </div>
          {/each}
        </div>
        <PhotoBrowser
          photos={fileids}
          theme="dark"
          type="popup"
          thumbs={fileids}
          bind:this={popupDark}
        />
      {:else}
        <div class="p-4 m-auto">
          <div class="pb-1">
            Uploading Post ({Math.floor(fileuploadprogress)}%)
          </div>
          <Progressbar progress={fileuploadprogress} />
        </div>
      {/if}
    </List>

    {#if !loading}
      <List strongIos outlineIos insetIos>
        <ListItem checkbox class="text-sm" bind:checked={nsfw} title="NSFW" />
        <ListButton color="blue" on:click={submitEntry}>Submit</ListButton>
      </List>
    {/if}
  {:else}
    <div class="m-auto w-full p-3">
      <div class="flex flex-col gap-2 items-center justify-center">
        <Icon ios="f7:rays" class="animate-spin" />
        <div>Publishing Post...</div>
      </div>
    </div>
  {/if}
</Page>
