<!--page parente-->
<template>
  <div id="app">
    <Nav />
    <main class="main-container">
      <router-view />
    </main>
  </div>
</template>

<script>
import Nav from "./components/nav";

export default {
  name: "app",
  components: {
    Nav,
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
@import "./sass/colors";
body {
  background-image: url("./assets/Groupomania_entreprise.jpg");
  background-size:cover;
  background-attachment: fixed;
}
body,
p,
h1 {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: "Roboto", sans-serif;
}
.main-container {
  box-sizing: border-box;
  width: 70%;
  height: auto;
  margin: 50px auto;
  background-color: rgba($white, 0.97);
  padding: 40px;
  @media screen and (max-width: 1024px) {
    width: 100%;
    margin: 0;
  }
  @media screen and (max-width: 600px) {
    padding: 20px;
  }
}
</style>
