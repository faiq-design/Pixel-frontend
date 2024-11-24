<template>
  <!--<div class="ma--top-1">-->
  <div class="loading" v-if="request._loading">
    <div class="loading-pulse"></div>
  </div>
  <div class="card">
    <div class="card-header align--flex-start">
    </div>
    <div class="card-content">
      <div class="row ma--bottom-1">
        <div class="col-xl-6">
          <h3 class="text--size-1-5">
            Have a question or need support?
          </h3>
          <h4
              class="
                        text--size-1
                        color--primary-gray
                        text--weight-regular
                        line--height-1-3
                      ">
            Please submit your information and questions below and our
            support staff will get back to you within 48-72 hours.
          </h4>
          <form @submit.prevent="support">
            <div class="card-content">
              <div
                  class="form-field form-field__standard ma--top-1"
                  :class="{
                            'form-field--is-invalid': v$.request.name.$error,
                            'form-field--is-active': !v$.request.name.$invalid,
                          }">
                <div class="form-field__control">
                  <label for=" " class="form-field__label">Name</label>
                  <input
                      type="text"
                      class="form-field__input"
                      v-model="request.name"
                      v-focus/>
                </div>
              </div>
              <div
                  class="form-field form-field__standard"
                  :class="{
                            'form-field--is-invalid': v$.request.email.$error,
                            'form-field--is-active': !v$.request.email.$invalid,
                          }">
                <div class="form-field__control">
                  <label for=" " class="form-field__label">Email</label>
                  <input
                      type="text"
                      class="form-field__input"
                      v-model="request.email"
                      v-focus/>
                </div>
              </div>
              <div
                  class="form-field form-field__standard"
                  :class="{
                            'form-field--is-invalid': v$.request.message.$error,
                            'form-field--is-active':
                              !v$.request.message.$invalid,
                          }">
                <div class="form-field__control">
                  <label for="msg" class="form-field__label">Enter Your Message Here...</label>
                  <textarea
                      rows="8"
                      cols="50"
                      id="msg"
                      class="form-field__input"
                      v-model="request.message"
                      v-focus>
                            </textarea>
                </div>
              </div>
            </div>
            <div
                class="card-actions display--flex justify--flex-start">
              <button type="submit" class="btn btn--primary">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div class="col-xl-6">
          <div v-if="isAerolead()">
            <div class="row ma--top-8">
              <div class="pa--y-1 pa--left-8">
                <img :src="supportLogo" style="width:70%;height:70%;">
              </div>
            </div>
          </div>
          <div v-else>
            <div class="row ma--top-1">
              <div class="pa--y-1 pa--right-1">
                <img :src="supportLogo" style="width:90%;height:90%;">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>
<script lang="ts">
import {Vue, Options, setup} from "vue-class-component";
import {Inject} from "vue-property-decorator";

import {useStore} from "vuex";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";

import {ISupportService} from "@/service";
import {SupportRequestModel} from "@/model";
import {Settings} from "@/config";

@Options({
  validations: {
    request: {
      name: {required},
      email: {required},
      message: {required},
    },
  },
})
export default class Support extends Vue {
  @Inject("supportService") service: ISupportService;

  public request = new SupportRequestModel();
  public store = useStore();

  public v$ = setup(() => this.validate());


  validate() {
    return useVuelidate();
  }

  support() {
    this.v$.$touch();

    if (!this.v$.$invalid) {
      this.request._loading = true;
      this.service
          .sendFeedback(this.request)
          .then((response) => {
            this.request._loading = false;
            this.store.dispatch("showAlert", {
              message:
                  "Thank you for submitting your question to our support team.  We'll get back to you within 48-72 hours.",
              snackBarClass: "fa-check",
              type: "success",
            });
            this.v$.$reset();
            this.request = new SupportRequestModel();
          })
          .catch((error) => {
            this.request._loading = false;
            this.store.dispatch("showAlert", {
              message: "Something went wrong, please try again later",
              snackBarClass: "snack--bar__error"
            });
          });
    }
  }

  get supportLogo() {
    return `${document.location.protocol}//${document.location.host}${Settings.AppSupportLogo}`;
  }

  public isAerolead() {
    return Settings.AppFavIcon == 'aerolead';
  }
}

</script>


