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
    BlockFooter,
    ListButton,
    f7,
  } from "framework7-svelte";
  import { db } from "../js/database";

  export let f7router;
  let NewPassword;
</script>

<Page name="settings">
  <Navbar title="Settings" />
  <List>
    <ListInput
      label="New Password"
      type="password"
      placeholder="Your new password"
      bind:value={NewPassword}
    />
    <ListButton
      fill
      onClick={() => {
        db.user().auth(JSON.parse(localStorage.getItem("keys")), () => {}, {
          change: NewPassword,
        });
        f7.dialog.alert("Password Changed");
        f7router.navigate("/");
      }}
    >
      Change Password
    </ListButton>
    <Button
      color="yellow"
      onClick={() => {
        db.user().leave();
        localStorage.clear();
        f7router.navigate("/");
        location.reload();
      }}>LOG OUT</Button
    >
    <ListButton
      fill
      color="red"
      on:click={() => {
        f7.dialog.confirm("Are you sure?", "Account delete", () => {
          db.user().auth(JSON.parse(localStorage.getItem("keys")), () => {}, {
            change: Math.random(),
          });
          localStorage.clear();
          f7router.navigate("/");
          db.user().leave();
          location.reload();
        });
      }}
    >
      Delete Account
    </ListButton>
  </List>
</Page>
