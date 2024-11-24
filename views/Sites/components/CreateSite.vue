<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="modal" style="width: 500px">
      <div class="modal__header">
        <h3 class="modal__header--title">
          <i class="fa fa-file-invoice"></i>
          Create Site
        </h3>
        <i class="fa fa-times modal__header--clear" @click="close"> </i>
      </div>
      <form @submit.prevent="createSite">
        <div class="modal__content">
          <div
            class="form-field form-field__outline ma--bottom-2"
            :class="{
              'form-field__outline--invalid': v$.request.siteName.$error,
              'form-field__outline--active': !v$.request.siteName.$invalid,
            }">
            <div class="form-field__outline--control">
              <input
                type="text"
                class="form-field__outline--control__input"
                v-model="request.siteName"
                v-outline/>
              <label for="site-name" class="form-field__outline--control__label">Site Name</label>
            </div>
          </div>

          <div
            class="form-field form-field__outline"
            :class="{
              'form-field__outline--invalid': v$.request.siteUrl.$error,
              'form-field__outline--active': !v$.request.siteUrl.$invalid,
            }">
            <div class="form-field__outline--control">
              <input
                type="text"
                class="form-field__outline--control__input"
                v-model="request.siteUrl"
                @input="checkUrlIfValid(v$.request.siteUrl.$invalid)"
                v-outline/>
              <label for="site-url" class="form-field__outline--control__label">Site Url</label>
            </div>
          </div>
          <p class="text--style-italic">Copy and Paste your domain address from your website URL for accuracy. Correct Format: https://www.abc.com</p>
        </div>
        <div class="modal__footer">
          <div
              class="color--primary-red text--weight-bold text--align-center pa--y-1 pa--right-1"
              v-if="fieldsError"
              v-html="fieldsMessage">
          </div>
          <button
              type="submit"
              class="btn btn--primary"
              :disabled="fieldsError">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { Inject } from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { ISitesService } from "@/service";
import { CreateSiteRequestModel } from "@/model";

@Options({
  validations: {
    request: {
      siteName: { required },
      siteUrl: {
        required,
        urlValidation: function (value: any) {
            //const regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            const regexp = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            const validation=  regexp.test(value);
            return validation;
        },
      },
    },
  },
})
export default class CreatSite extends Vue {
  @Inject("sitesService") service: ISitesService;

  public v$ = setup(() => this.validate());
  public store = useStore();
  public request = new CreateSiteRequestModel();
  public fieldsError: boolean = false;
  public fieldsMessage:string="";

  public loading: boolean = false;

  validate() {
    return useVuelidate();
  }


  //Check if teh subscription amount is valid
  public checkUrlIfValid(isInvalid: boolean)
  {
    if(isInvalid)
    {
      this.fieldsMessage = "Please enter a valid url";
      this.fieldsError = true;
      return !isInvalid;
    }
    this.fieldsMessage = "";
    this.fieldsError = false;
    return true;
  }
  public createSite() {
    this.v$.$touch();

    if (!this.v$.$invalid) {
      this.loading = true;
      this.removeTrailingSlash(this.request.siteUrl);
      this.service
        .createSite(this.request)
        .then((response) => {
          this.loading = false;
          this.store.dispatch("showAlert", {
            message: "Site created sucessfully",
            snackBarClass: "fa-check",
            type: "success",
          });
          this.$emit("closeSiteModel", true);
        })
        .catch((error) => {
          this.loading = true;
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: "BAD REQUEST: "+"Error in creating site",
              snackBarClass: "fa-times",
              type: "error",
            });
          if (error.response.status == 500)
            this.store.dispatch("showAlert", {
              message: "Server Error: "+"Error in creating site",
              snackBarClass: "fa-times",
              type: "error",
            });
          this.$emit("closeSiteModel", true);
        })
    }
  }

  private removeTrailingSlash(str: string) {
    return str.replace(/\/+$/, '');
  }
  public close() {
    this.$emit("closeSiteModel", false);
  }
  
}
</script>



