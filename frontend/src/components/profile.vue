<!--affichage zone compte/profil-->
<template>
  <section class="profile-section" v-if="user">
    <input
      name="modify-avatar"
      type="file"
      id="modify-avatar"
      accept=".png, .jpg, .jpeg"
      @change="changeAvatar"
    />
    <label tabindex="0" for="modify-avatar">
      <img :src="user.avatar_url" alt="Photo de profil" />
      <p>Changer l'avatar</p>
    </label>
    <h1>{{ user.name }} {{ user.firstname }}</h1>
    <div class="member-status">
      <span v-if="user.admin == true">Admin</span>
      <span v-else>Membre</span>
    </div>
    <form @submit.prevent="changePassword">
      <h3>Changer de mot de passe</h3>
      <p class="input-container">
        <label for="old-password">Mot de passe actuel</label>
        <input
          name="old-password"
          type="password"
          v-model="oldPassword"
          id="old-password"
        />
      </p>
      <p class="input-container">
        <label for="new-password">Nouveau mot de passe</label>
        <input
          name="new-password"
          type="password"
          v-model="newPassword"
          id="new-password"
        />
      </p>
      <button type="submit">Valider</button>
      <router-link to="/">
      <button type="submit" height="50">
      Retour</button>
    </router-link>
    </form>
    <div class="delete-part">
      <h3>Suppression du compte</h3>
      <button class="delete-button" @click="deleteUser">
        Supprimer mon compte
      </button>
    </div>
  </section>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

import { mapActions, mapGetters } from "vuex";
import router from "../router";

export default {
  name: "Profile",
  data() {
    return {
      oldPassword: null,
      newPassword: null,
    };
  },
  computed: {
    ...mapGetters({ user: "showConnectedUser" }),
  },
  //manipulations sur le profil
  methods: {
    ...mapActions(["getOneUser"]),
    changeAvatar() {
      let filename = document.querySelector("#modify-avatar").files[0];
      const formData = new FormData();
      formData.append("userId", this.$store.state.userId);
      formData.append("image", filename);
      axios
        .put("/user/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.$store.dispatch("getOneUser");
        })
        .catch(() => {
          // console.log(error);
        });
    },
    changePassword() {
      axios
        .put("/user/changepassword", {
          id: this.$store.state.userId,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        })
        .then(() => {
          this.oldPassword = this.newPassword = null;
          Swal.fire({
            icon: "success",
            text: "Mot de passe changé avec succès",
            confirmButtonColor: "#fd5101",
          });
        })
        .catch(() => {
          Swal.fire({
            text: "Le mot de passe actuel est incorrect",
            icon: "error",
            confirmButtonColor: "#fd5101",
          });
        });
    },
    deleteUser() {
      Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer votre compte",
        text: "Cette action est irréversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        confirmButtonColor: "#32c068",
        cancelButtonText: "Non",
        cancelButtonColor: "#e24b43",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete("/user/" + this.$store.state.userId)
            .then(() => {
              // On réinitialise le store et on le déconnecte
              let state = this.$store.state;
              let initialState = {};
              Object.keys(state).forEach((key) => {
                initialState[key] = null;
              });
              this.$store.replaceState(initialState);

              localStorage.clear();
              router.push("/");
            })
            .catch(() => {
              // console.log(error);
            });
        }
      });
    },
  },
  mounted() {
    this.getOneUser();
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  #modify-avatar {
    text-align: center;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
    & + label {
      text-align: center;
      position: relative;
      height: 100%;
      width: 100%;
      max-height: 250px;
      max-width: 250px;
      margin-bottom: 12px;
      img {
        width: 100%;
        height: 100%;
        max-height: 220px;
        max-width: 220px;
        object-fit: cover;
        cursor: pointer;
        &:hover + p {
          display: block;
        }
      }
      p {
        border-radius: 1rem;
        padding: 0 12px;
        background-color: rgba($black, 0.3);
        color: #fff;
        font-size: 1.4rem;
        position: absolute;
        bottom: 15%;
        left: 13%;
        display: none;
      }
    }
  }

  h1 {
    margin-bottom: 4px;
    font-weight: 300;
  }
  .member-status {
    color: #fff;
    font-weight: 500;
    background-color: rgba($primary-color, 0.9);
    padding: 5px 10px;
    border-radius: 0.5rem;
  }
  form {
    text-align: center;
    .input-container {
      margin-bottom: 8px;
      input {
        font-family: "Roboto", sans-serif;
        box-sizing: border-box;
        margin-top: 3px;
        width: 100%;
        height: 32px;
        font-size: 1rem;
        border-radius: 1rem;
        padding-left: 12px;
        font-weight: 400;
        border: 2px solid rgba($primary-color, 0.9);
        &:focus {
          outline: 1px dashed #aaa;
          outline-offset: 1px;
        }
      }
    }
    button {
      color: #fff;
      font-weight: 500;
      font-size: 1.2rem;
      border: none;
      border-radius: 0.9rem;
      padding: 6px 15px;
      background-color: rgba($primary-color, 0.9);
      cursor: pointer;
    }
  }
  button{
    background-color:$primary-color;
    color:$white;
    border-radius: 50px;
    outline: none;
    border: none;
    font-weight: 500;
    font-size: 1.1rem;
    cursor: pointer;
  }
  .delete-part {
    text-align: center;
    button {
      margin-bottom: 12px;
      color: lighten($black, 15%);
      font-weight: 600;
      font-size: 1.2rem;
      appearance: none;
      border-radius: 0.9rem;
      padding: 8px 15px;
      border: 2px solid darken($error-color, 12%);
      background-color: $error-color;
      cursor: pointer;
    }
  }
}
.swal2-popup {
  font-family: "Roboto", sans-serif;
}
</style>