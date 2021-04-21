<!--affichage zone de rappel du profil-->
<template>
  <aside v-if="user" class="profile-box">
    <img :src="user.avatar_url" alt="Photo de profil" />
    <h3>Coucou{{ user.lastname }} {{ user.firstname }}</h3>
    <div class="member-status">
      <span v-if="user.admin == true">Admin</span>
      <span v-else>Membre</span>
    </div>
  </aside>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "profile-box",
  computed: {
    ...mapGetters({
      user: "showConnectedUser",
    }),
  },
  //manipulation sur le rappel du profil
  methods: {
    ...mapActions(["getOneUser"]),
  },
  mounted() {
    this.getOneUser();
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

.profile-box {
  box-sizing: border-box;
  width: 25%;
  height: 100%;
  padding: 20px 20px;
  background-color: $white;
  border-radius: 1rem;
  box-shadow: 0 0 5px rgba($black, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 600px) {
    width: 100%;
    margin-bottom: 30px;
  }
  img {
    width: 100%;
    height: 100%;
    max-height: 160px;
    object-fit: cover;
    max-width: 160px;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba($black, 0.5);
  }
  h3 {
    margin: 10px 0;
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
  }
  .member-status {
    color: $white;
    font-weight: 500;
    background-color: rgba($primary-color, 0.9);
    padding: 5px 10px;
    border-radius: 0.5rem;
  }
}
</style>