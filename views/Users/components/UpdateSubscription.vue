<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px" v-if="request">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-dollar-sign"></i>
          Add/Update Subscription
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <form @submit.prevent="update">
        <div class="modal__content" style="max-height: 520px">
          <p class="pa--y-1">Update Subscription  for {{ user.email }}</p>

            <label for="Update Subscription">Update Subscription</label>
            <input type="checkbox" v-model="isUpdateSubscription" >

          <div class="form-field__control">
            <input type="text" class="form-field__input" readonly />
            <label for="Credit" class="form-field__label">Current Credits: {{ user.credits ? user.credits : 0 }}</label>
          </div>

          <div
            class="form-field form-field__standard ma--top-1"
            :class="{
              'form-field--is-invalid':
                v$.request.subscriptionCredits.$error || invalidCredit,
              'form-field--is-active': !v$.request.subscriptionCredits.$invalid,
            }">
            <!--<div class="form-field__control">
              <input type="text" class="form-field__input" readonly />
              <label for="Credit" class="form-field__label">Price:</label>
            </div>-->
           <!-- <li
                class="dropdown-item"
                :class="{ 'dropdown-item-active': siteName == item.siteName }"
                v-for="(item, index) in siteResponse.data"
                :key="index"
                @click="updateSiteId(item)">
              <div class="color--primary-green text--style-italic text--size-1-1 text--align-left"
                   v-if="hasSiteAvailableLeads(item)">leads available
              </div>
              {{ item.siteName }}<span class="color--primary text--style-italic text--size-1-1 text--align-left"
                                       v-if="hasSiteAvailableLeads(item)">({{ getSiteAvailableLeads(item) }})</span>
            </li>-->
           <!-- <div class="form-field form-field__outline ma--x-3">
              <div class="form-field__outline--control">
                <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="request.subscriptionCredits"
                    v-outline
                    style="width: 300px"/>
                <label for="site-url" class="form-field__outline--control__label">Price -</label>
              </div>
            </div>-->
            Price -
            <div class="form-field__control">
              <input
                type="number"
                class="form-field__input"
                v-model="request.subscriptionCredits"
                v-focus
                @change="invalidCredit = false"/>
              <label for="Credit" class="form-field__label">Price *</label>
            </div>
            Subscription start date -
            <div class="form-field__control">
              <input
                  type="number"
                  class="form-field__input"
                  v-model="request.subscriptionStartDay"
                  v-focus
                  @change="invalidStartDay = false"/>
              <!--<datepicker></datepicker>-->
              <label for="Credit" class="form-field__label">Subscription start date *</label>
            </div>
            <div class="form-field__errors" v-if="invalidCredit">
              You don't have enough credit
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button type="submit" class="btn btn--primary">Update</button>
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
//import vuejsDatepicker from "vuejs-datepicker"
import { required, minValue } from "@vuelidate/validators";

import { UpdateSubscriptionRequestModel, UsersResponseModel } from "@/model";
import { ICreditHistoryService } from "@/service";

import { useStore } from "vuex";

@Options({
  validations: {
    request: {
      subscriptionCredits: {
        required
      },
      subscriptionStartDay: {
        required
      },
    },
  },
})
export default class UpdateSubscription extends BaseComponent {
  @Prop() user: UsersResponseModel;

  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public request = new UpdateSubscriptionRequestModel();
  public invalidCredit: boolean = false;
  public invalidStartDay: boolean = false;
  public isUpdateSubscription: boolean = false;

  public v$ = setup(() => this.validate());
  public store = useStore();

  validate() {
    return useVuelidate();
  }

  public close() {
    this.$emit("close");
  }

  public update() {
    this.v$.$touch();
    this.request.toUserId = this.user.id;
    this.request.subscriptionCredits = this.request.subscriptionCredits;
    this.request.subscriptionStartDay = this.request.subscriptionStartDay;
    if (!this.v$.$invalid) {
      /**
      let credits = this.store.getters.getCredits
        ? this.store.getters.getCredits
        : 0;
      **/
      if ( this.store.getters.isSuperAdmin) {
        this.confirm(
          `Are you sure you want to subscribe  ${this.request.subscriptionCredits} credits to '${this.user.email}'?`
        ).then((confirm: boolean) => {
          if (confirm) {
            this.service
              .updateSubscription(this.request)
              .then((response) => {
                this.$emit("updated");
              })
              .catch((error) => {
                if (error.response.status == 400)
                  this.store.dispatch("showAlert", {
                    message: "The subscription has failed",
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

  public getNumbers(start: number,stop: number,step : number = 1){
  return new Array(stop / step).fill(start).map((n,i)=>(i+1)*step);
}
}
</script>
