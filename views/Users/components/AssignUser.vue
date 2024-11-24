<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px" v-if="request">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-id-card-alt"></i>
          Assign user
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <form @submit.prevent="assign">
        <div class="modal__content" style="max-height: 520px">
          <div
            class="form-field form-field__standard ma--top-1"
            :class="{
              'form-field--is-invalid': v$.request.email.$error,
              'form-field--is-active': !v$.request.email.$invalid,
            }">
            <div class="form-field__control">
              <input
                type="text"
                class="form-field__input"
                v-model="request.email"
                v-focus/>
              <label for="Email" class="form-field__label">Email *</label>
            </div>
          </div>
          <div
            class="form-field form-field__standard ma--top-1">
            <div class="form-field__control">
              <ul>
                <li v-for="(item, index) in sites">
                  <input type="checkbox" v-model="request.siteIds" :value="item.id" :id="item.id">
                  <label :for="item.id">{{ item.siteName}}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <div class="form-checkbox">
            <input
                type="checkbox"
                v-model="isUnAssign"
                @change="OnChangeAssignChange($event)"/>
            <!-- @click="isSelectedAllAvailableLeads=!isSelectedAllAvailableLeads" -->
            <label style="font-size:small; color:gray" for="isStartSubscriptionImmediately">UnAssign</label>
          </div>
          <button type="submit" class="btn btn--primary">{{isUnAssign?"UnAssign":"Assign"}}</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";

import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import { AssignUserToMultiSiteRequestModel, SitesModel, SitesRequestModel } from "@/model";
import { ISitesService, IUserService } from "@/service";

import { useStore } from "vuex";

@Options({
  validations: {
    request: {
      email: { required, email },
    },
  },
})
export default class AssignUser extends Vue {
  @Inject("userService") service: IUserService;
  @Inject("sitesService") sitesService: ISitesService;

  public request = new AssignUserToMultiSiteRequestModel();
  public sites: Array<SitesModel> = [];
  public isUnAssign = false;

  public v$ = setup(() => this.validate());
  public store = useStore();

  validate() {
    return useVuelidate();
  }

  created() {
    const request = new SitesRequestModel();
    this.sitesService.getSites(request).then((response) => {
      this.sites = response.data;

      this.request.siteIds = [this.store.getters.getSiteId];
    });
  }

  public OnChangeAssignChange(e:any)
  {
    this.$nextTick(() => {
      if(this.isUnAssign)
      {
        this.request.siteIds = [];
      }
      else
      {
        this.request.siteIds = [this.store.getters.getSiteId];
      }
    });
  }
  public close() {
    this.$emit("close");
  }

  public assign() {
    this.v$.$touch();
    if (!this.v$.$invalid) {
      this.request.unAssign = this.isUnAssign;
      this.service
        .assignUserToMultiSite(this.request)
        .then((response) => {
          if(this.isUnAssign)
          {
            this.$emit("unassigned");
          }
          else
          {
            this.$emit("assigned");
          }


        })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: "Please enter already registered user email",
              snackBarClass: "fa-times",
              type: "error",
            });
        });
    }
  }
}
</script>
