<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 800px">
      <div class="modal__header modal__header--success">
        <h3 class="clipboard__header--title">Pixel activation</h3>
        <a class="fa fa-times clipboard__header--clear" @click="clearPixel">
        </a>
      </div>
      <div class="modal__content">
        <div class="clipboard--help__desk pa--top-1 pa--bottom-2">
          <div class="clipboard--help__desk--count">1</div>
          <div class="clipboard--help__desk--content">
            <div class="clipboard--help__desk--content__text">
              Copy this pixel code:
            </div>
            <div class="clipboard--help__desk--content__input">
              <div :class="termsAndConditions ? 'clipboard--help__desk--content__input--pixelbox' : 'clipboard--help__desk--content__input--msg'">
                <textarea style="border:none;" v-model="pixelCode"  rows="15" cols="65" v-if="termsAndConditions"></textarea>
              </div>
            </div>
          </div>
        </div>
         <button
                
                class="btn btn--primary"
                style="width: -webkit-fill-available"
                v-clipboard:copy="pixelCode"
                v-clipboard:success="copyClipboard"
                :disabled="!termsAndConditions">
                Copy
              </button>
        <br>
        <div
            class="color--primary-green text--weight-bold text--align-center"
            v-if="userAlert">
          {{ userMessage }}
        </div>
        <div class="clipboard--help__desk pa--y-2">
          <div class="clipboard--help__desk--count">2</div>
          <div class="clipboard--help__desk--content__text">
            Place the copied code on your website before the end of the body
            tag.
          </div>
        </div>

        <div class="clipboard--help__desk pa--y-2">
          <div class="clipboard--help__desk--count">3</div>
          <div class="clipboard--help__desk--content__text">
            Once your pixel is placed correctly, you'll receive a confirmation
            email and site will be activated
          </div>
        </div>

        <div class="clipboard--help__desk pa--y-2 align--baseline">
          Email to developer -
          <div class="form-field form-field__outline ma--x-1">
            <div class="form-field__outline--control">
              <input
                type="text"
                class="form-field__outline--control__input"
                v-model="request.email"
                v-outline
                style="width: 400px"/>
              <label for="site-url" class="form-field__outline--control__label">Email</label>
            </div>
          </div>
          <button
            class="btn btn--primary"
            @click="sendMail"
            :disabled="!termsAndConditions">
            Send
          </button>
        </div>

        <div class="clipboard--help__desk pa--y-2">
          <div class="form-checkbox">
            <input
              id="termsAndConditions"
              type="checkbox"
              v-model="termsAndConditions"/>
            <label for="termsAndConditions">I hereby agree to all Terms and Conditions associated with using the {{ appName }} Dashboard.</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
import { useStore } from "vuex";

import { ISitesService } from "@/service";
import { SendMailRequest } from "@/model";
import { Settings } from "@/config";

export default class PixelTracking extends Vue {
  //@Prop() pixelUrl: any;
  @Prop() pixelInstallCode: any;
  @Prop() pixelSiteName: string;
  @Inject("sitesService") service: ISitesService;

  termsAndConditions: boolean = false;
  pixelCode: string = "";
  public userAlert: boolean = false;
  public userMessage:string;

  public store = useStore();
  public request = new SendMailRequest();

  mounted() {
   // this.pixelCode = this.service.getPixelCode(this.pixelUrl);
    this.pixelCode = this.pixelInstallCode;
        this.pixelCode = this.pixelCode.trim();
  }

  public copyClipboard() {
    this.store.dispatch("showSnack", {
      message: "Successfully Copied to Clipboard",
      snackBarClass: "snack--bar__success",
    });
    this.userAlert = true;
    this.userMessage = "Successfully Copied to Clipboard";
  }

  public clearPixel() {
    this.$emit("closePixel", false);
  }

  public sendMail() {
    this.request.siteName = this.pixelSiteName;
    this.request.message = this.pixelCode;
    this.request.message = this.request.message
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;");
    this.service.sendMail(this.request).then(
      (response) => {
        this.clearPixel();
        this.store.dispatch("showSnack", {
          message: `Email Successfully sent to ${this.request.email}`,
          snackBarClass: "snack--bar__success",
        });
        this.store.dispatch("showAlert", {
          message:
              `Email Successfully sent to ${this.request.email}`,
          snackBarClass: "fa-check",
          type: "success",
        });
      },
      (error) => {
        this.clearPixel();
        this.store.dispatch("showSnack", {
         message: `Email Successfully sent to ${this.request.email}`,
          snackBarClass: "snack--bar__success",
        });
        this.store.dispatch("showAlert", {
          message:
              `Email Successfully sent to ${this.request.email}`,
          snackBarClass: "fa-check",
          type: "success",
        });
      }
    );
  }

  get appName() {
    return Settings.AppName;
  }
}
</script>


