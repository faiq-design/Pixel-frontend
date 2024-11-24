<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 800px">
      <div class="modal__header modal__header--success">
        <h3 class="clipboard__header--title">Wordpress Plugin Pixel Activation</h3>
        <a class="fa fa-times clipboard__header--clear" @click="clearPixel">
        </a>
      </div>
      <div class="modal__content">
        <div class="clipboard--help__desk pa--top-1 pa--bottom-2">
          <div class="clipboard--help__desk--count">1</div>
          <div class="clipboard--help__desk--content">
            <div class="clipboard--help__desk--content__text">
              Copy the information and paste it in your wordpress plugin settings page for site
              {{ pixelActivationItem.siteUrl }} only:
              <br>
              <div style="font-size: 80%">
                <a :href="pluginZipUrl" v-bind:download="appWordpressPluginZip">Download WordPress Plugin</a>
              </div>
            </div>
          </div>
        </div>
        <div class="pa--left-0">
          <div class="clipboard--help__desk pa--y-2 align--baseline" v-if="termsAndConditions">
            Email -
            <div class="form-field form-field__outline ma--x-1">
              <div class="form-field__outline--control">
                <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="email"
                    v-outline
                    style="width: 400px"/>
                <label for="site-url" class="form-field__outline--control__label">Email</label>
              </div>
            </div>
            <button
                class="btn btn--primary"
                v-clipboard:copy="email"
                v-clipboard:success="copyClipboard"
                :disabled="!termsAndConditions">
              Copy
            </button>
          </div>
          <div class="clipboard--help__desk pa--y-2 align--baseline" v-if="termsAndConditions">
            Site Name -
            <div class="form-field form-field__outline ma--x-1">
              <div class="form-field__outline--control">
                <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="siteName"
                    v-outline
                    style="width: 400px"/>
                <label for="site-url" class="form-field__outline--control__label">Site Name</label>
              </div>
            </div>
            <button
                class="btn btn--primary"
                v-clipboard:copy="siteName"
                v-clipboard:success="copyClipboard"
                :disabled="!termsAndConditions">
              Copy
            </button>
          </div>
          <div class="clipboard--help__desk pa--y-2 align--baseline" v-if="termsAndConditions">
            Site Authorization Code -
            <div class="form-field form-field__outline ma--x-1">
              <div class="form-field__outline--control">
                <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="siteAuthCode"
                    v-outline
                    style="width: 400px"/>
                <label for="site-url" class="form-field__outline--control__label">Site Auth Code</label>
              </div>
            </div>
            <button
                class="btn btn--primary"
                v-clipboard:copy="siteAuthCode"
                v-clipboard:success="copyClipboard"
                :disabled="!termsAndConditions">
              Copy
            </button>
          </div>
        </div>
        <br>
        <div
            class="color--primary-green text--weight-bold text--align-center"
            v-if="userAlert">
          {{ userMessage }}
        </div>
        <div class="clipboard--help__desk pa--y-2">
          <div class="clipboard--help__desk--count">2</div>
          <div class="clipboard--help__desk--content__text">
            Once the settings are applied correctly, you'll receive a confirmation
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
import {Vue} from "vue-class-component";
import {Inject, Prop} from "vue-property-decorator";
import {useStore} from "vuex";

import {ISitesService} from "@/service";
import {SendMailRequest} from "@/model";
import {SitesModel, CreateUserRequestModel} from "@/model";
import {Settings} from "@/config";

export default class PluginTracking extends Vue {
  @Prop() pixelActivationItem: SitesModel;
  @Prop() isSuperAdmin: boolean;
  @Inject("sitesService") service: ISitesService;
  pluginZipUrl: string = require("../../../assets/"+this.appWordpressPluginZip);
 // pluginZipUrl: string = require("../../../assets/logo.png");

  termsAndConditions: boolean = false;
  pluginMessage: string = "";
  email: string = "";
  siteName: string = "";
  siteAuthCode: string = "";
  public userAlert: boolean = false;
  public userMessage: string;

  public store = useStore();
  public request = new SendMailRequest();
  public user: CreateUserRequestModel = new CreateUserRequestModel();


  created() {
    this.user = this.store.getters.getCurrentUser;
  }

  mounted() {
    this.pluginMessage = "Copy the information and paste it in your wordpress plugin settings page for site " + this.pixelActivationItem.siteUrl + " only:\n<br>";
    this.pluginMessage = this.pluginMessage + "1). Email ==> " + this.user.email + "\n<br>2).Site Name ==> " + this.pixelActivationItem.siteName + "\n<br>3). Site Authorization Code ==> " + this.pixelActivationItem.additionalInfo;
    this.email = this.user.email;
    this.siteName = this.pixelActivationItem.siteName;
    this.siteAuthCode = JSON.parse(this.pixelActivationItem.additionalInfo).authCode;
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
    this.request.message = this.pluginMessage;
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

  get appWordpressPluginZip() {
    return Settings.AppWordpressPluginZip;
  }
}
</script>



