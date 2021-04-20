<template>
  <Login v-if="this.$store.state.userId == null" />
  <div v-else class="home-container">
    <ProfileBox />
    <Posts />
  </div>
</template>

<script>
import Login from "../components/login";
import Posts from "../components/posts";
import ProfileBox from "../components/profile-box";

export default {
  name: "Home",
  components: {
    Login,
    Posts,
    ProfileBox,
  },
};
</script>

<style lang="scss">
.home-container {
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    display: inline-block;
  }
}
</style>
