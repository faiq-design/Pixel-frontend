<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px" v-if="user">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-key"></i>
          Change Password
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <form @submit.prevent="assign">
        <div class="modal__content" style="max-height: 520px">
          <p class="pa--y-1">Changing password for {{ user.email }}</p>

          <div
            class="form-field form-field__standard ma--top-1"
            :class="{
              'form-field--is-invalid': v$.password.$error,
              'form-field--is-active': !v$.password.$invalid,
            }">
            <div class="form-field__control">
              <input class="form-field__input" v-model="password" v-focus />
              <label for="Credit" class="form-field__label">New Password</label>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button type="submit" class="btn btn--primary">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, setup } from "vue-class-component";
import { BaseComponent } from "@/components/BaseComponent";
import { Prop, Inject } from "vue-property-decorator";

import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";

import { UsersResponseModel } from "@/model";
import { IUserService } from "@/service";

import { useStore } from "vuex";

@Options({
  validations: {
    password: {
      required,
    },
  },
})
export default class ChangePassword extends BaseComponent {
  @Prop() user: UsersResponseModel;

  @Inject("userService") service: IUserService;

  password: string = "";

  public v$ = setup(() => this.validate());
  public store = useStore();

  validate() {
    return useVuelidate();
  }

  public close() {
    this.$emit("close");
  }

  public assign() {
    this.v$.$touch();
    if (!this.v$.$invalid) {
      this.service
        .changePasswordByAdmin(this.user.email, this.password)
        .then((response:any) => {
          if (response === true)
          {
            this.store.dispatch("showAlert", {
              message: "Error in changing password",
              snackBarClass: "fa-times",
              type: "error",
            });
          }
          else
          {
            if(typeof(response.data) !== 'undefined')
            {
              this.store.dispatch("showAlert", {
                message: "Password change successful",
                snackBarClass: "fa-check",
                type: "success",
              });
            }
            else
            {
              this.store.dispatch("showAlert", {
                message: "Something went wrong, Please try again later",
                snackBarClass: "fa-times",
                type: "error",
              });
            }

          }
          this.$emit("close");
        })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: `<p>Error updating password.</p><p>${error.response.data.message}</p>`,
              snackBarClass: "fa-times",
              type: "error",
            });
        });
    }
  }
}
</script>
