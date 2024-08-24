<script>
  import eruda from "eruda";
  eruda.init();
  import { onMount } from "svelte";
  import { getDevice } from "framework7/lite-bundle";
  import {
    f7,
    f7ready,
    App,
    Panel,
    Views,
    View,
    Popup,
    Page,
    Navbar,
    Toolbar,
    NavRight,
    Link,
    Block,
    BlockTitle,
    LoginScreen,
    LoginScreenTitle,
    List,
    ListItem,
    ListInput,
    ListButton,
    BlockFooter,
    Button,
  } from "framework7-svelte";

  import capacitorApp from "../js/capacitor-app";
  import routes from "../js/routes";
  import store from "../js/store";
  import { db, isLoggedin } from "../js/database";

  const device = getDevice();
  // Framework7 Parameters
  let f7params = {
    name: "reportit", // App name
    theme: "ios", // Automatic theme detection
    colors: {
      primary: "#007aff",
    },
    darkMode: true,
    // App store
    store: store,
    // App routes
    routes: routes,

    // Input settings
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };
  // Login screen demo data
  let username = "";
  let password = "";

  onMount(() => {
    f7ready(() => {
      // Init capacitor APIs (see capacitor-app.js)
      if (f7.device.capacitor) {
        capacitorApp.init(f7);
      }
      // Call F7 APIs here
    });
  });

  function signin() {
    db.user().auth(username, password, (ack) => {
      if (ack.err) {
        f7.dialog.alert(ack.err);
      } else {
      }
    });
  }

  function signup() {
    db.user().create(username, password, (ack) => {
      if (ack.err) {
        f7.dialog.alert(ack.err);
      } else {
        signin();
      }
    });
  }
</script>

<App {...f7params}>
  <Views tabs class="safe-areas">
    <!-- Tabbar for switching views-tabs -->
    <Toolbar tabbar icons bottom>
      <Link
        tabLink="#view-home"
        tabLinkActive
        iconIos="f7:house_fill"
        iconMd="material:home"
        text="Home"
      />
      <Link
        tabLink="#view-plus"
        iconIos="f7:plus_square"
        iconMd="material:view_list"
        text="Create"
      />
      <Link
        tabLink="#view-settings"
        iconIos="f7:gear"
        iconMd="material:settings"
        text="Settings"
      />
    </Toolbar>

    <!-- Your main view/tab, should have "view-main" class. It also has "tabActive" prop -->
    <View id="view-home" main tab tabActive url="/" />

    <!-- Catalog View -->
    <View id="view-plus" name="plus" tab url="/create/" />

    <!-- Settings View -->
    <View id="view-settings" name="settings" tab url="/settings/" />
  </Views>

  <LoginScreen id="my-login-screen" opened={!$isLoggedin}>
    <View>
      <Page loginScreen>
        <LoginScreenTitle>Report.It</LoginScreenTitle>
        <List form>
          <ListInput
            type="text"
            name="username"
            placeholder="Your username"
            bind:value={username}
          />
          <ListInput
            type="password"
            name="password"
            placeholder="Your password"
            bind:value={password}
          />
        </List>
        <div class="flex justify-center">
          <Button title="Sign Up" onClick={() => signup()}>Sign Up</Button>
          <Button fill title="Sign In" onClick={() => signin()}>Sign In</Button>
        </div>
        <BlockFooter>
          By logging in or signing up you agree to our terms and conditions
        </BlockFooter>
      </Page>
    </View>
  </LoginScreen>
</App>
