<template>
  <nav>
    <router-link to="/">
      <img
        class="logo-groupomania"
        src="../assets/icon-left-font-monochrome-white.svg"
        alt="Logo de Groupomania"
        height="50"
    /></router-link>
    
    <div v-if="this.$store.state.userId != null">
      <router-link class="profile-link" to="/profile"> Mon compte </router-link>
      <router-link to="/" @click.native="$store.dispatch('disconnectUser')"
        >Déconnexion</router-link
      >
    </div>
  </nav>
</template>

<script>
export default {
  name: "ProfileNav",
};
</script>

<style lang="scss">
@import "../sass/colors";

nav {
  display: flex;
  align-items: center;
  background-color: rgba($black, 0.92);
  padding: 12px 0;
  justify-content: space-around;
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
  .profile-link {
    margin-right: 20px;
  }
  a {
    outline: none;
    text-decoration: none;
    color: $white;
    font-weight: 500;
    font-size: 1.1rem;
  }
  
}
</style>