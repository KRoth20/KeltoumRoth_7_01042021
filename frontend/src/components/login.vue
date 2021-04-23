<!--affichage zone de connexion-->
<template>
  <section id="login-container">
    <h1>Bienvenue sur le réseau social de votre entreprise !</h1>
    <div id="login-form">
      <h2>Connexion</h2>
      <form method="post" @submit.prevent="loginUser">
        <p class="input-container">
          <label for="email">Email</label><br />
          <input
            required
            type="email"
            name="email"
            id="email"
            v-model="email"
          />
        </p>
        <p class="input-container">
          <label for="password">Mot de passe</label><br />
          <input
            required
            type="password"
            name="password"
            id="password"
            v-model="password"
          />
        </p>
        <p class="error-login" v-if="this.$store.state.errorMsg != null">
          {{ this.$store.state.errorMsg }}
        </p>
        <button type="submit">Se connecter</button>
        <p class="no-account">Pas de compte ?</p>
        <p>
          <router-link class="signup-link" to="/signup">
            Inscription
          </router-link>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  //manipulations de la connexion
  methods: {
    loginUser() {
      axios
        .post("auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
  //connexion reste maintenue
          localStorage.setItem("token", res.data.token);
          // localStorage.setItem("user", res.data.userId);
          this.$store.dispatch("getUserId", res.data.userId);
          this.email = this.password = null;
        })
        .catch(() => {
          this.password = null;
          this.$store.state.errorMsg =
            "Le mot de passe ou l'email est incorrect";
        });
    },
  },
  mounted() {
    this.email = null;
    this.$store.state.errorMsg = null;
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

#login-container > h1 {
  text-align: center;
  font-size: 1.5rem;
  padding-top: 15px;
  font-weight: 400;
}

#login-form {
  border-radius: 1rem;
  background-color: rgba($black, 0.18);
  width: 60%;
  margin: 20px auto 0;
  @media screen and (max-width: 600px) {
    width: 80%;
  }
  h2 {
    margin: 0;
    text-align: center;
    color: $white;
    border-radius: 1rem 1rem 0 0;
    background-color: rgba($primary-color, 0.8);
    padding: 10px 0;
    text-transform: uppercase;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 0.1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 30px;
    .input-container {
      margin-bottom: 12px;
      width: 66%;
      max-width: 250px;
      label {
        font-weight: 500;
      }
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
        border: none;
        &:focus {
          outline: 2px dashed #999;
          outline-offset: 1px;
        }
      }
    }
    .error-login {
      color: #ce1515;
    }
    button {
      color: $white;
      background-color: rgba($primary-color, 0.8);
      padding: 10px 24px;
      font-size: 1.1rem;
      border-radius: 1rem;
      border: none;
      margin: 10px 0 40px;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: 700;
    }
    .no-account {
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
    .signup-link {
      letter-spacing: 0.05rem;
      text-transform: uppercase;
      font-weight: 500;
      display: inline-block;
      text-decoration: none;
      color: $black;
      background-color: $white;
      padding: 10px 30px;
      font-size: 1.1rem;
      border: none;
      border-radius: 1rem;
      box-shadow: 0 0 5px rgba($black, 0.75);
    }
  }
}
</style>