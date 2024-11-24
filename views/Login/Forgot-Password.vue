<template>
  <div class="container-fluid fill-height login--background">
    <div class="background--overlay"></div>
    <div class="row">
      <div class="col-xl-4 col-lg-4 col-sm-12 col-md-6">
        <div class="card">
          <div class="card-header justify--center">
            <img :src="logo" class="login-logo" />
          </div>
          <div class="card-content ma--top-1">
            <p class="text--align-center text--weight-bold">
              Enter Email to receive instructions
            </p>

            <form @submit.prevent="forgotPassword">
              <div
                class="form-field form-field__standard ma--y-2"
                :class="{
                  'form-field--is-invalid': v$.request.email.$error,
                  'form-field--is-active': !v$.request.email.$invalid,
                }">
                <div class="form-field__control form-field__control--icon">
                  <input
                    type="text"
                    class="form-field__input"
                    v-model="request.email"
                    v-focus/>
                  <label for="email" class="form-field__label">Email</label>
                  <div class="form-field__control--icon__prefix">
                    <i class="fa fa-user"></i>
                  </div>
                </div>
              </div>

              <div class="ma--y-1 text--align-center">
                <button type="submit" class="btn btn--primary btn--large">
                  <span v-if="!loading">Reset</span>
                  <div class="loading-circle" v-else>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </button>
              </div>
            </form>

            <div class="text--align-center">
              <router-link to="/login" tag="a" class="forgot--password">
                Back to Login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { Inject } from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import { IAuthenticationService } from "@/service";
import { ForgotPasswordRequest } from "@/model";
import { Settings } from "@/config";

@Options({
  validations: {
    request: {
      email: { required, email },
    },
  },
})
export default class ForgotPassword extends Vue {
  @Inject("authService") service: IAuthenticationService;

  public store = useStore();
  public request = new ForgotPasswordRequest();
  public v$ = setup(() => this.validate());
  public loading: boolean = false;

  validate() {
    return useVuelidate();
  }

  forgotPassword() {
    this.v$.$touch();

    if (!this.v$.$invalid) {
      this.loading = true;
      this.service.forgotPassword(this.request).then(
        (response: any) => {
          if (response === true)
          {
            this.loading = false;
            this.store.dispatch("showSnack", {
              message: "Invalid user email",
              snackBarClass: "snack--bar__error",
            });
          }
          else
          {
            if(typeof(response.data) !== 'undefined')
            {
              this.loading = false;
              this.store.dispatch("showSnack", {
                message: "Reset password link sent to your email",
                snackBarClass: "snack--bar__success",
              });
            }
            else
            {
              this.loading = false;
              this.store.dispatch("showSnack", {
                message: "Something went wrong, Please try again later",
                snackBarClass: "snack--bar__error",
              });
            }

          }
        },
        (err: any) => {
          this.loading = false;
          this.store.dispatch("showSnack", {
            message: "Something went wrong, Please try agaan later",
            snackBarClass: "snack--bar__error",
          });
        }
      );
    }
  }

  get logo() {
    return Settings.AppLogo;
  }
}
</script>
