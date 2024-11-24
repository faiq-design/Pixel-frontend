<template>
  <div 
    class="container-fluid fill-height account--background"
    :class="{
      'height--percentage': !showMessage,
      'height--vh': showMessage
    }">
    <div class="background--overlay"></div>
    <div class="row">
      <div 
        :class="{
          'col-xl-5 col-lg-5 col-sm-12 col-md-6': !showMessage,
          'col-xl-4 col-lg-4 col-sm-12 col-md-6': showMessage
        }">
        <div class="card" v-if="!showMessage">
          <div class="row">
            <div class="col-9 pa-0">
              <h3 class="text--weight-bold text--size-1-5 ma--top-0 ma--bottom-1">Welcome to Powerful Data.</h3>
              <h4 class="text--size-1 ma-0">Unlock new levels of innovation and analysis.</h4>
            </div>
            <div class="col-3 pa-0">
              <img
                :src="logo"
                width="120"
                alt="Lead Pulse"/>
            </div>
          </div>
          
          <div class="card-header ma--top-1">
            <div class="card-header--title login--card-title">
              Create Account
            </div>
          </div>
          <div class="card-content">
            <div>
              Already have account?
              <router-link to="/login" tag="a" class="forgot--password">
                Login here
              </router-link>
            </div>

            <form @submit.prevent="newUser()">
              <div class="row no-gutters">
                <div class="col-lg-6 col-sm-12">
                  <div
                    class="form-field form-field__standard ma--top-1 pa--right-1"
                    :class="{ 
                        'form-field--is-invalid': v$.request.firstName.$error,
                        'form-field--is-active': !v$.request.firstName.$invalid 
                    }">
                    <div class="form-field__control">
                      <input
                        type="text"
                        class="form-field__input"
                        v-focus
                        v-model="request.firstName"/>
                      <label for="email" class="form-field__label">First Name *</label>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-sm-12">
                  <div 
                    class="form-field form-field__standard ma--top-1" 
                    :class="{ 
                        'form-field--is-invalid': v$.request.lastName.$error,
                        'form-field--is-active': !v$.request.lastName.$invalid 
                    }">
                    <div class="form-field__control">
                      <input
                        type="text"
                        class="form-field__input"
                        v-focus
                        v-model="request.lastName"/>
                      <label for="Lastname" class="form-field__label">Last Name *</label>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
                :class="{ 
                  'form-field--is-invalid': v$.request.email.$error,
                  'form-field--is-active': !v$.request.email.$invalid 
                }">
                <div class="form-field__control">
                  <input
                    type="text"
                    class="form-field__input"
                    v-focus
                    v-model="request.email"/>
                  <label for="email" class="form-field__label">Email *</label>
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
                :class="{ 
                  'form-field--is-invalid': v$.request.password.$error,
                  'form-field--is-active': !v$.request.password.$invalid 
                }">
                <div class="form-field__control">
                  <label for="new-password" class="form-field__label">Password *</label>
                  <input
                    type="password"
                    class="form-field__input"
                    v-focus
                    v-model="request.password"/>
                </div>
                <div class="form-field__error--box">
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.minLength.$invalid)"></i>
                    Minimum 8 characters
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.number.$invalid)"></i>
                    At least one number
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.special.$invalid)"></i>
                    At least one special character
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.uppercase.$invalid)"></i>
                    At least one Uppercase
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.lowercase.$invalid)"></i>
                    At least one Lowercase
                  </div>
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
                :class="{ 
                  'form-field--is-invalid': v$.request.confirmPassword.$error,
                  'form-field--is-active': !v$.request.confirmPassword.$invalid 
                }">
                <div class="form-field__control">
                  <label for="confirm-password" class="form-field__label">Confirm Password *</label>
                  <input
                    type="password"
                    class="form-field__input"
                    v-focus
                    v-model="request.confirmPassword"
                    v-sameAs="request"/>
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
                :class="{ 
                  'form-field--is-invalid': v$.request.phone.$error,
                  'form-field--is-active': !v$.request.phone.$invalid 
                }">
                <div class="form-field__control" title="Phone number only numeric">
                  <input
                    type="text"
                    class="form-field__input"
                    v-focus
                    v-model="request.phone"/>
                  <label for="phone" class="form-field__label">Phone *</label>
                </div>
              </div>

              <div 
                class="form-field form-field__standard">
                <div class="form-field__control">
                  <input
                    type="text"
                    class="form-field__input"
                    v-model="request.companyName"
                    v-focus/>
                  <label for="company-name" class="form-field__label">Company Name</label>
                </div>
              </div>  

              <p class="terms"> 
                <input type="checkbox" v-model="termsAndConditions"/>
                By clicking here, I am creating an account and agree to abide by the terms and conditions and privacy policy of {{ appName }}, which includes protecting the rights of consumers by complying with all Federal and State laws, and to behave in a legal, ethical and responsible manner with the data that I purchase.
              </p>          

              <div class="text--align-center">
                <button type="submit" class="btn btn--primary btn--large">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="card" v-if="showMessage">
          <div class="row">
            <div class="col-9 pa-0">
              <h3 class="text--weight-bold text--size-2 ma--top-0 ma--bottom-1">Check your email.</h3>
            </div>
            <div class="col-3 pa-0">
              <img
                src="../../assets/lp-logo.png"
                width="120"
                alt="Lead Pulse"/>
            </div>
          </div>
          <div class="card-content">
            <p class="line--height-1-5">We’ve sent an email to (enter email). Please click on the activation button to initialize your account.</p>
            <h4 class="text--size-1-2 ma--top-1 ma--bottom-0 line--height-1">Don’t see it?</h4>
            <br/>
            <p class="ma--top-0 line--height-1-3">If you don’t see it in your inbox in a few minutes, there are several things to check:</p>
            <ul class="pa--left-1 ma--bottom-1 line--height-1-5">
              <li>Check your spam folder</li>
              <li>Maybe you made a typo? (It happens.)</li>
              <li>You entered the wrong email address.</li>
              <li>Company firewalls or filters won’t let us deliver the email.</li>
            </ul>

            <router-link 
              to="/login" 
              tag="a" 
              class="forgot--password">
              Click here to login
            </router-link>

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
import {
  required,
  email,
  numeric,
  minLength,
  maxLength,
} from "@vuelidate/validators";

import { IAuthenticationService } from "@/service";
import { CreateUserRequestModel } from "@/model";
import { Settings } from "@/config";

@Options({
  validations: {
    request: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      password: {
        required,
        minLength: function(value: any) {
          let validation = false;
          if(value && value != '' && value.length >= 8 )  validation = true;

          return validation;
        },
        uppercase: function(value: any) {
          let validation = false;
          if(value && value != '')  validation = /^(?=.*?[A-Z])/.test(value);

          return validation;
        },
        lowercase: function (value: any) {
          let validation = false;
          if(value && value != '')  validation = /^(?=.*?[a-z])/.test(value);
          return validation;
        },
        number: function (value: any) {
          let validation = false;
          if(value && value != '')  validation = /[0-9]/.test(value);
          return validation;
        },
        special: function (value: any) {
          let validation = false;
          if(value && value != '')  validation = /[#?!@$%^&*-]/.test(value);
          return validation;
        }
      },
      confirmPassword: {
        required
      },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10),
      },
    },
  },
})
export default class Registration extends Vue {
  @Inject("authService") service: IAuthenticationService;

  public store = useStore();
  public request = new CreateUserRequestModel();
  public v$ = setup(() => this.validate());

  public termsAndConditions: boolean = false;

  public showMessage:boolean = false;

  validate() {
    return useVuelidate();
  }

  public newUser() {
    this.v$.$touch();

    if (
      !this.v$.$invalid &&
      this.request.password == this.request.confirmPassword &&
      this.termsAndConditions
    ) {
      this.request.type = "REGISTERUSER";
      this.service.createNewUser(this.request).then(
        (response) => {
          //this.store.dispatch("showSnack", { message: "Account created successfully", snackBarClass: 'snack--bar__success' });
          //this.$router.push("/");
          this.showMessage = true;
        }).catch((error) => {
        if(error.response.status == 400)
          this.store.dispatch("showSnack", {
            message: error.response.data,
            snackBarClass: "snack--bar__error",
          });
      });
    } 
  }

  public getErrors(request: boolean) {
    return request
      ? "fa-times-circle fa--danger"
      : "fa-check-circle fa--success";
  }

  get logo() {
    return Settings.AppLogo;
  }

  get appName() {
    return Settings.AppName;
  }
}
</script>