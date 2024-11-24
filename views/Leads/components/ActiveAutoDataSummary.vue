<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success">
        <h3 class="clipboard__header--title">
          <i class="fa fa-briefcase"></i>
          Active Auto Data</h3>
        <a class="fa fa-times clipboard__header--clear" @click="close">
        </a>
      </div>
      <div class="modal__content pa-1">
            <div class="pa--y-1 pa--left-1">
              <h4>Active Auto Data<span
                  class="text--style-italic"
                  style="font-size: 80%"></span></h4>
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                Project Name
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                  {{projectName}}
                  </span>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                Frequency
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                  {{activeAutoData.frequency}}
                  </span>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                No of Leads
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                  {{(activeAutoData.type == "PROCESS_ALL_AVAILABLE_LEADS")?"All Available Leads":activeAutoData.customLeadNumbers}}
                  </span>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" >
                Filters
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                    {{ JSON.parse(activeAutoData.filters) }}
                  </span>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;;border-bottom: 1px solid white">
                Recipients
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;border-bottom: 1px solid white">
                  <div v-html="getFormattedEmail(activeAutoData.emailAddressesDelimited)"></div>
                  </span>

              </div>
              <AutoDataDelivery
                  v-if="toggleAutoDataDeliveryModel"
                  :isEdit=true
                  :selectedLeadsLength=0
                  @closeAutoDataDeliveryModel="closeAutoDataDeliveryModel()"/>
            </div>
            <div class="modal__footer">
              <button
                  type="button"
                  class="btn btn--secontary"
                  v-if="isAdmin || isSuperAdmin"
                  @click="autoLeadConfirm()">
                Edit
              </button>
              <button
                  type="button"
                  class="btn btn--secontary"
                  v-if="isAdmin || isSuperAdmin"
                  @click="deleteAutoLead()">
                Delete
              </button>

              <button
                  type="button"
                  class="btn btn--primary"
                  @click="close">
                Close
              </button>
            </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue,Options} from "vue-class-component";
import { BaseComponent } from "@/components/BaseComponent";
import {Inject, Prop} from "vue-property-decorator";
import {useStore} from "vuex";

import {AutoLeadsModel,CreateUserRequestModel} from "@/model";
import {Settings} from "@/config";
import AutoDataDelivery from "../components/AutoDataDelivery.vue";
import { ILeadsService} from "@/service";

@Options({
  components: {
    AutoDataDelivery,
  },
})

export default class ActiveAutoDataSummary extends BaseComponent {
  @Prop() activeAutoData: AutoLeadsModel ;
  @Prop() projectName: string ;
  @Prop() siteId: number ;
  @Inject("leadsService") service: ILeadsService;


  public store = useStore();
  public isAdmin = false;
  public isSuperAdmin: boolean = false;
  public toggleAutoDataDeliveryModel: boolean = false;


  created() {
    const user: CreateUserRequestModel = this.store.getters.getCurrentUser;
    this.isAdmin = user.role.indexOf("ADMIN") > -1;
    this.isSuperAdmin = user.role.indexOf("SUPERADMIN") > -1;
  }

  mounted() {
  }

  private deleteAutoLead()
  {
    this.confirm(
        `Are you sure you want to  delete Auto Data profile for site `+this.projectName
    ).then((confirm: boolean) => {
      if (confirm) {
         this.service.deleteAutoLeads(this.siteId)
         .then((response: any) => {
              if(response.includes("SUCCESS:"))
              {
                this.store.dispatch("showAlert", {
                  message: response,
                  snackBarClass: "fa-check",
                  type: "success",
                });
                this.store.dispatch("updateSiteId", this.siteId);
                this.close();
              }
              else
              {
                this.store.dispatch("showAlert", {
                  message: response,
                  snackBarClass: "fa-times",
                  type: "error",
                });
              }
            })
      }
    });

  }

  private autoLeadConfirm() {
    this.$emit("closeAndEditAutoDataLead");
}

  public getFormattedDate(dt: string)
  {
    let myDate = new Date(dt);
    return ('00'+(myDate.getMonth()+1)).slice(-2)+"/" + ('00'+((myDate.getDate()))).slice(-2) + "/" + myDate.getFullYear();
  }


  public getFormattedEmail(emailAddressesDelimited: string)
  {
    let emailFormatted: string ="";
    emailAddressesDelimited.split(",").forEach((e) => (emailFormatted += e.trim() + "<br><br>"));
    emailFormatted=emailFormatted.substr(0,emailFormatted.length -"<br><br>".length)
    return emailFormatted;
  }

  public close() {
    this.$emit("close");
  }

  public dummy()
  {

  }

  get appName() {
    return Settings.AppName;
  }

  closeAutoDataDeliveryModel() {
    this.toggleAutoDataDeliveryModel = false;
  }

}
</script>

