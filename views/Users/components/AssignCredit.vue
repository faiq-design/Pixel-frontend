<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px" v-if="request">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-dollar-sign"></i>
          Assign Credit
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <form @submit.prevent="assign">
        <div class="modal__content" style="max-height: 520px">
          <p class="pa--y-1">Assigning credit to {{ user.email }}</p>

          <div class="form-field__control">
            <input type="text" class="form-field__input" readonly />
            <label for="Credit" class="form-field__label">Current Credits: {{ user.credits ? user.credits : 0 }}</label>
          </div>

          <div
            class="form-field form-field__standard ma--top-1"
            :class="{
              'form-field--is-invalid':
                v$.request.creditToTransfer.$error || invalidCredit,
              'form-field--is-active': !v$.request.creditToTransfer.$invalid,
            }">
            <div class="form-field__control">
              <input
                type="number"
                class="form-field__input"
                v-model="request.creditToTransfer"
                v-focus
                @change="invalidCredit = false"/>
              <label for="Credit" class="form-field__label">Credits to add *</label>
            </div>
            <div class="form-field__errors" v-if="invalidCredit">
              You don't have enough credit
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button type="submit" class="btn btn--primary">Assign</button>
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

import { AssignCreditRequestModel, UsersResponseModel } from "@/model";
import { ICreditHistoryService } from "@/service";

import { useStore } from "vuex";

@Options({
  validations: {
    request: {
      creditToTransfer: {
        required,
        minValue: minValue(1),
      },
    },
  },
})
export default class AssignCredit extends BaseComponent {
  @Prop() user: UsersResponseModel;

  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public request = new AssignCreditRequestModel();
  public invalidCredit: boolean = false;

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
    this.request.toUserId = this.user.id;
    if (!this.v$.$invalid) {
      let credits = this.store.getters.getCredits
        ? this.store.getters.getCredits
        : 0;

      if (credits >= this.request.creditToTransfer || this.store.getters.isSuperAdmin) {
        this.confirm(
          `Are you sure you want to assign ${this.request.creditToTransfer} credits to '${this.user.email}'?`
        ).then((confirm: boolean) => {
          if (confirm) {
            this.service
              .delegateCredit(this.request)
              .then((response) => {
                this.$emit("assigned");
              })
              .catch((error) => {
                if (error.response.status == 400)
                  this.store.dispatch("showAlert", {
                    message: "There is not enough credit to transfer",
                    snackBarClass: "fa-times",
                    type: "error",
                  });
              });
          }
        });
      } else {
        this.invalidCredit = true;
      }
    }
  }
}
</script>