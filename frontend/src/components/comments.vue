<template>
  <section class="comments-container">
    <h3>Commentaires</h3>
    <form @submit.prevent="createComment(post.id)">
      <textarea
        required
        placeholder="Entrez un commentaire..."
        v-model="commentText"
        title="Zone de saisie pour entrer un commentaire"
      />
      <button type="submit">Envoyer</button>
    </form>
    <div
      v-for="comment in post.Comments"
      :key="comment.id"
      class="single-comment"
    >
      <img
        :src="comment.User.avatar_url"
        :alt="'Logo de ' + comment.User.lastname + ' ' + comment.User.firstname"
      />
      <div>
        <p class="comment-name">
          {{ comment.User.lastname }} {{ comment.User.firstname }}
        </p>
        <p
          v-if="modifyingComment == false"
          class="comment-content"
          :id="'comment-' + comment.id"
        >
          {{ comment.content }}
        </p>
        <form
          :id="'modify-comment-form-' + comment.id"
          @submit.prevent="sendModifiedComment(comment.id)"
        ></form>
      </div>
      <button
        v-if="
          $store.state.connectedUser != null &&
          (comment.userId == $store.state.userId ||
            $store.state.connectedUser.admin == true)
        "
        title="Supprimer ce commentaire"
        class="delete-button"
        @click="deleteComment(comment.id)"
      >
        <font-awesome-icon :icon="['fas', 'trash-alt']" />
      </button>
      <button
        v-if="
          $store.state.connectedUser != null &&
          (comment.userId == $store.state.userId ||
            $store.state.connectedUser.admin == true)
        "
        title="Modifier ce commentaire"
        class="modify-button"
        @click="modifyComment(comment.id, comment.content)"
      >
        <font-awesome-icon :icon="['fas', 'edit']" />
      </button>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapActions } from "vuex";

export default {
  name: "Comments",
  props: ["post"],
  data() {
    return {
      commentText: null,
      modifyCommentText: null,
      modifyingComment: false,
    };
  },

  methods: {
    ...mapActions(["getPosts"]),
    createComment(postId) {
      axios
        .post("comment", {
          postId: postId,
          userId: this.$store.state.userId,
          content: this.commentText,
        })
        .then(() => {
          this.getPosts();
          this.commentText = null;
        })
        .catch(() => {
          // console.log(error);
        });
    },
    modifyComment(id, content) {
      this.modifyingComment = true;
      this.modifyCommentText = content;
      let newForm = document.getElementById("modify-comment-form-" + id);
      newForm.innerHTML =
        '<textarea></textarea><button type="submit">Modifier</button>';
      newForm.firstChild.value = this.modifyCommentText;
    },
    sendModifiedComment(commentId) {
      let modifiedComment = document.getElementById(
        "modify-comment-form-" + commentId
      ).firstChild.value;
      axios
        .put("comment", {
          id: commentId,
          content: modifiedComment,
        })
        .then(() => {
          this.modifyCommentText = null;
          this.modifyingComment = false;
          let element = document.getElementById(
            "modify-comment-form-" + commentId
          );
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          this.getPosts();
        })
        .catch(() => {
          // console.log(error);
        });
    },
    deleteComment(commentId) {
      Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        confirmButtonColor: "#32c068",
        cancelButtonText: "Non",
        cancelButtonColor: "#e24b43",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete("comment/" + commentId)
            .then(() => {
              this.getPosts();
            })
            .catch(() => {
              // console.log(error);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "../sass/colors";

.comments-container {
  background-color: $white;
  padding: 10px;
  h3 {
    margin: 0 0 5px;
    font-weight: 400;
  }
  form {
    display: flex;
    margin-bottom: 10px;
    textarea {
      flex: 1;
      height: 50px;
      font-family: "Roboto", sans-serif;
      padding: 5px;
      box-shadow: none;
    }
    button {
      border: none;
      background-color: rgba($primary-color, 0.9);
      border-radius: 0 0.5rem 0.5rem 0;
      font-size: 1.1rem;
      color: $white;
      font-weight: 500;
      border-left: none;
      cursor: pointer;
    }
  }
  img {
    width: 30px;
    height: 30px;
    margin-right: 6px;
    border-radius: 50%;
    object-fit: cover;
  }
  .single-comment {
    display: flex;
    box-shadow: 0 0 4px rgba($black, 0.9);
    margin-bottom: 8px;
    border-radius: 0.5rem;
    padding: 6px;
    .comment-name {
      font-weight: 500;
      margin-bottom: 6px;
    }
    .comment-content {
      font-weight: 300;
    }
    .delete-button {
      height: 30px;
      width: 30px;
      margin-left: auto;
      font-size: 1rem;
      background-color: $error-color;
      border: 2px solid darken($error-color, 12%);
      color: $white;
      padding: 0 4px;
      transition: 0.1s;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
    }
    .modify-button {
      height: 30px;
      width: 30px;
      margin-left: 4px;
      font-size: 1.05rem;
      background-color: $primary-color;
      border: 2px solid darken($primary-color, 8%);
      color: $white;
      padding: 0 4px;
      transition: 0.1s;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>