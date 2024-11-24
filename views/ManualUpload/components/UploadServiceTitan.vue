<template>
  <div class="modal-container show">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="blocker"></div>
    <div class="modal" style="width: 1020px">
      <div class="modal__content pa-1">
        <div class="stepper--bar">
          <div class="stepper--bar__header">
            <ul>
              <li
                  :class="{
                  active: stepper == 1,
                }">
                <span class="stepper--bar__header--title-count">1</span>
                <span class="stepper--bar__header--title">Upload Service Titan File</span>
              </li>
              <li
                  :class="{
                  active: stepper == 2,
                }">
                <span class="stepper--bar__header--title-count">2</span>
                <span class="stepper--bar__header--title">Submit</span>
              </li>
            </ul>
          </div>
          <div
              class="
                stepper--bar__content--label stepper--bar__content--label-1
              "
              :class="{
                'label--active': stepper == 1,
              }">
            <div class="pa--y-1 pa--left-1">
              <h4>Upload Service Titan<span
                  class="text--style-italic"
                  style="font-size: 80%"></span></h4>
              <div class="form-field form-field__standard ma--top-1">
                <div class="form-field__control">
                  <input type="file" class="form-field__input" ref="upload" />
                </div>
              </div>
              <div class="form-field form-field__outline--control ma--x-1">
                <div class="form-checkbox">
                  <input
                      type="checkbox"
                      v-model="isDryRun"/>
                  <label style="font-size:small; color:gray" for="isStartSubscriptionImmediately">Dry Run</label>
                </div>
              </div>
              <div style="font-size: 80%">
                <a :href="templateUrl" download="template.csv">Download Template</a>
              </div>
              <div>
                <div style="font-size: 80%">Template screenshot(below)</div>
                <img :src="templateImage"/>
              </div>
            </div>
          </div>
            <div
                class="
                stepper--bar__content--label stepper--bar__content--label-3
              "
                :class="{
                'label--active': stepper == 2,
              }">

            </div>
          </div>
        </div>
      <div class="modal__footer">
        <button
            type="button"
            class="btn btn--secontary"
            @click="close">
          Cancel
        </button>
        <button
            type="button"
            class="btn btn--secontary"
            v-if="stepper != 1"
            @click="stepper = 1">
          Back
        </button>

        <button
            type="button"
            class="btn btn--primary"
            @click="proceed2"
            v-if="stepper == 1 ">
          Proceed
        </button>
        <button
            type="button"
            class="btn btn--primary"
            @click="processServiceTitan"
            v-else>
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import {
  FieldsModel,
  LeadsRequestModel,
  ListItem,
  PurchasedFieldsModel,
  PurchasedLeadsModel,
  PurchaseLeadsRequestModel,
  RepurchaseLeadsRequestModel,
} from "@/model";

import { ILeadsService, StripeService,ISitesService } from "@/service";
import { Settings } from "@/config";

export default class UploadFilePurchaseLeads extends Vue {
  @Prop() adminSiteId: number;
  @Prop() selectedLeads: Array<number>;
  @Prop() leadRequest: LeadsRequestModel;
  @Prop() totalLeads: number;
  @Prop() purchasedLead: Array<number>;
  @Prop() siteId: string;
  @Prop() purchaseType: string;
  @Prop() order: PurchasedLeadsModel;
  @Inject("leadsService") service: ILeadsService;
  @Inject("sitesService") siteService: ISitesService;
  templateUrl: string = require("../../../assets/ManualUpload_Template.csv");
  templateImage: string = "../../../img/ManualUpload_Template.png";

  public store = useStore();

  public fields: Array<FieldsModel> = [];
  public stepper: number = 1;
  public response: number = 0;
  public selectedFields: Array<any> = [];

  public insufficentCredits: boolean = false;
  public fieldsError: boolean = false;
  public selectAll: boolean = false;

  public loading: boolean = false;

  public isDryRun:boolean = false;

  mounted() {
  }



  public proceed2() {
    if(this.stepper == 1)
    {
      this.stepper = 2;
    }


  }

  public processServiceTitan() {
    this.loading = true;

let control: any = this.$refs.upload;

    if (control.files.length) {
      let dryRun: string = this.isDryRun?"yes":"no";
      this.siteService
          .uploadServiceTitan(control.files[0],dryRun)
          .then((response: any) => {
            this.loading = false;
            if (response.includes("SUCCESS:")) {
              this.store.dispatch("showAlert", {
                message: response,
                snackBarClass: "fa-check",
                type: "success",
              });
              this.close();
            } else {
              this.store.dispatch("showAlert", {
                message: response,
                snackBarClass: "fa-times",
                type: "error",
              });
            }
          }).catch((error: any) => {
        this.loading = false;
        this.store.dispatch("showAlert", {
          message: "Error in processing File, the File Type needs to be a csv and in correct format.",
          snackBarClass: "fa-times",
          type: "error",
        });
      });
    }
    else
    {
      this.loading = false;
      this.store.dispatch("showAlert", {
        message: "No file uploaded",
        snackBarClass: "fa-times",
        type: "error",
      });
    }

  }

  public close() {
    this.$emit("close", false);
  }

}
</script>
