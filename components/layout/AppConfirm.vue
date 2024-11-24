<template>
  <div class="modal-container show" v-if="dialog">
    <div class="blocker"></div>
    <div class="modal" style="width: 400px">
      <div class="modal__content">
        <p v-html="message" class="alert--message"></p>
      </div>
      <div class="modal__footer">
        <button type="button" class="btn btn--small" @click="cancel">
          {{ noButtonText }}
        </button>
        <button
          type="button"
          class="btn btn--primary btn--small"
          @click="agree">
          {{ yesButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class AppConfirm extends Vue {
  dialog: boolean = false;
  message: string = "";
  resolve: any = null;
  reject: any = null;
  yesButtonText: string = "Yes";
  noButtonText: string = "No";

  show(
    message: string,
    yesButtonText?: string,
    noButtonText?: string
  ): Promise<boolean> {
    this.dialog = true;
    this.message = message;
    this.yesButtonText = yesButtonText ? yesButtonText : "Yes";
    this.noButtonText = noButtonText ? noButtonText : "No";

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  agree() {
    this.resolve(true);
    this.dialog = false;
  }

  cancel() {
    this.resolve(false);
    this.dialog = false;
  }
}
</script>