<template>
  <div class="container-fluid fill-height login--background">
    <div class="background--overlay"></div>
    <div class="row">
      <div class="col-xl-4 col-lg-4 col-sm-12 col-md-6">
        <div class="card pa--x-2">
          <div class="card-header justify--center">
            <img
              :src="logo"
              class="login-logo"
              alt="Lead Pulse"/>
          </div>
          <div class="card-content ma--top-1">
            <h3
              class="
                text--weight-bold text--size-1-5
                ma--bottom-1
                text--align-center
              ">
              {{ caption }}
            </h3>
            <form @submit.prevent="login">
              <div
                class="form-field form-field__standard ma--y-2"
                :class="{
                  'form-field--is-invalid': v$.request.username.$error,
                  'form-field--is-active': !v$.request.username.$invalid,
                }">
                <div class="form-field__control form-field__control--icon">
                  <input id="input-email"
                    type="text"
                    class="form-field__input"
                    v-model="request.username"
                    v-focus/>
                  <label for="input-email" class="form-field__label">Email</label>
                  <div class="form-field__control--icon__prefix">
                    <i class="fa fa-user"></i>
                  </div>
                </div>
              </div>

              <div
                class="form-field form-field__standard ma--y-2"
                :class="{
                  'form-field--is-invalid': v$.request.password.$error,
                  'form-field--is-active': !v$.request.password.$invalid,
                }">
                <div class="form-field__control form-field__control--icon">
                  <input id="input-password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-field__input"
                    v-model="request.password"
                    v-focus/>
                  <label for="input-password" class="form-field__label">Password</label>
                  <div class="form-field__control--icon__prefix">
                    <i class="fa fa-key"></i>
                  </div>
                  <div class="form-field__control--icon__suffix">
                    <i
                      class="fa"
                      :class="{
                        'fa-eye': showPassword,
                        'fa-eye-slash': !showPassword,
                      }"
                      @click="showPassword = !showPassword">
                    </i>
                  </div>
                </div>
              </div>
              <div class="form-field form-field__standard ma--y-2">
                <input id="remember" type="checkbox" v-model="remember" />
                <label for="remember">Remember my email</label>
              </div>

              <div class="ma--y-1 text--align-center">
                <button type="submit" class="btn btn--primary btn--large">
                  <span v-if="!loading">Login</span>
                  <div class="loading-circle" v-else>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </button>
              </div>
            </form>

            <VerifyOTP
              :phone="userProfile.phone"
              @resend="sendOTP"
              v-if="showVerificationOTP"/>

            <div class="ma--y-1 text--align-center">
              <router-link
                to="/forgot-password"
                tag="a"
                class="forgot--password">
                Forgot password?
              </router-link>
            </div>

            <div class="ma--y-1 text--align-center" v-if="enableRegistration">
              <div class="pa--bottom-1">Need new account?</div>

              <router-link to="/registration" tag="a" class="forgot--password">
                Create an account
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
import axios from "axios";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import {
  AuthenticationRequest,
  AuthenticationResponse,
  CreateUserRequestModel,
  VerifyOTPRequest,
} from "@/model";
import { IUserService } from "@/service";

import VerifyOTP from "./components/VerifyOTP.vue";
import { Settings } from "@/config";

@Options({
  components: {
    VerifyOTP,
  },
  validations: {
    request: {
      username: { required, email },
      password: { required },
    },
  },
})
export default class Login extends Vue {
  @Inject("userService") service: IUserService;

  public store = useStore();
  public request = new AuthenticationRequest();
  public userProfile = new CreateUserRequestModel();

  public v$ = setup(() => this.validate());

  public showPassword: boolean = false;
  public loading: boolean = false;
  public enableOTP: boolean = false;
  public enableRegistration: boolean = false;

  public showVerificationOTP: boolean = false;
  public remember: boolean = false;

  validate() {
    return useVuelidate();
  }

  created() {
    this.enableOTP = Settings.EnableOTP;
    this.enableRegistration = Settings.EnableRegistration;

    let userName = localStorage.getItem("loginEmail");
    if (userName){
      this.request.username = userName;
      this.remember = true;
    }
  }

  login() {
    this.v$.$touch();

    if (!this.v$.$invalid) {
      if (this.remember)
        localStorage.setItem("loginEmail", this.request.username);
      else
        localStorage.removeItem("loginEmail");

      this.loading = true;
      this.store
        .dispatch("login", this.request)
        .then((response: AuthenticationResponse) => {
          this.loading = false;
          if (response.success) {
            this.getCurrentUser();
          } else {
            this.store.dispatch("showSnack", {
              message:
                response.error == "Bad credentials" ||
                response.error == "No value present"
                  ? "Email / Password incorrect"
                  : response.error,
              snackBarClass: "snack--bar__error",
            });
          }
        },
        error => {
          this.loading = false;
          this.store.dispatch("showSnack", {
              message: "Invalid credentials",
              snackBarClass: "snack--bar__error",
            });
        });
    }
  }

  public getCurrentUser() {
    // this.service.getCurrentUser().then((response) => {
    //   this.userProfile = response;
    //   localStorage.setItem("user", JSON.stringify(this.userProfile));

    //   if (this.enableOTP) {
    //     this.sendOTP();
    //   } else {
        // localStorage.setItem("accessToken", this.store.getters.accessToken);
        // localStorage.setItem("refreshToken", this.store.getters.refreshToken);
        this.$router.push("/");
    //   }
    // });
  }

  public sendOTP() {
    this.loading = true;

    let xhttp = new XMLHttpRequest(),
      data = new URLSearchParams();

    data.append("To", this.userProfile.phone);
    data.append("Channel", "sms");

    let url =
      "https://verify.twilio.com/v2/Services/VA659f1a0a830b7ae16605368d517701e3/Verifications";

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader(
      "Authorization",
      "Basic " +
        window.btoa(
          "AC668a2d02dfeecfbcd46a537fc7cf478b:cab75b3ca5413186f07cb7a51be06d49"
        )
    );

    xhttp.send(data);

    let self = this;

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        self.loading = false;
        self.showVerificationOTP = true;
      }
    };
  }

  get logo() {
    return Settings.AppLogo;
  }

  get caption() {
    return Settings.AppCaption;
  }
}
</script>