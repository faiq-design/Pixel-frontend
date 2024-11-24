<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px" v-if="request">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-id-card-alt"></i>
          Invite user
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
             <!-- <select class="form-field__input"  v-model="request.siteIds" multiple>
                  <option v-for="(item, index) in sites" :key="index" :value="item.id">
                    {{ item.siteName }}
                  </option>
              </select>-->
              <ul>
                <li v-for="(item, index) in sites">
                  <input type="checkbox" v-model="request.siteIds" :value="item.id" :id="item.id">
                  <label :for="item.id">{{ item.siteName}}</label>
                </li>
              </ul>
            </div>
          </div>
          <Selectbox
            label="Role"
            :value="request.role"
            :fields="roleType"
            @update="onUpdateRole(request, $event)"/>
        </div>
        <div class="modal__footer">
          <button type="submit" class="btn btn--primary">Invite</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { Vue, Options, setup } from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";

import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import {
  CreateUserRequestModel,
  SitesModel,
  SitesRequestModel,
  CreateMultiSiteUserRequestModel
} from "@/model";
import { ISitesService, IUserService } from "@/service";

import { useStore } from "vuex";
import Selectbox from "@/components/controls/Selectbox.vue";

@Options({
  components: {
    Selectbox,
  },
  validations: {
    request: {
      email: { required, email },
    },
  },
})
export default class InviteUser extends Vue {
  @Inject("userService") service: IUserService;
  @Inject("sitesService") sitesService: ISitesService;

  public request = new CreateMultiSiteUserRequestModel();
  public sites: Array<SitesModel> = [];
  public roleType: Array<string> = ["ADMIN", "CLIENT"];

  public v$ = setup(() => this.validate());
  public store = useStore();

  created() {
    this.request.role = "CLIENT";
    this.request.type = "INVITEUSER";
    let user: CreateMultiSiteUserRequestModel = this.store.getters.getCurrentUser;
    this.request.invitedBy = user.id;

    const request = new SitesRequestModel();
    this.sitesService.getSites(request).then((response) => {
      this.sites = response.data;

      this.request.siteIds = [this.store.getters.getSiteId];
    });
  }

  validate() {
    return useVuelidate();
  }

  public close() {
    this.$emit("close");
  }

  public onUpdateRole(request: CreateUserRequestModel, selectedRole: string) {
    request.role = selectedRole;
  }

  public assign() {
    this.v$.$touch();
    axios.defaults.headers.common["Authorization"] = "";
    if (!this.v$.$invalid) {
      if (!this.request.credits) this.request.credits = 0;
      
      this.service
        .addMultiSiteUser(this.request)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + this.store.getters.accessToken;

          this.store.dispatch("showAlert", {
              message: "User Invite Request was successful. You will Receive an Email Once approved",
              snackBarClass: "fa-check",
              type: "success",
            });

          this.$emit("assigned");
        })
        .catch((error) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + this.store.getters.accessToken;

          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: "User email already registered",
              snackBarClass: "fa-times",
              type: "error",
            });
        });
    }
  }
}
</script>

