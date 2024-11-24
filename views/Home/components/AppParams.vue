<template>
  <div class="modal-container show">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="blocker"></div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success">
        <h3 class="clipboard__header--title">
          <i class="fa fa-briefcase"></i>
          Application Parameters</h3>
        <a class="fa fa-times clipboard__header--clear" @click="close">
        </a>
      </div>
      <div class="modal__content pa-1">
          <form
              @submit.prevent="updateParams()">

            <div class="pa--y-1 pa--left-1">
              <h4>Enter Application Parameters<span
                  class="text--style-italic"
                  style="font-size: 80%"></span></h4>
              <div v-for="(item, index) in appResponse.data" :key="index">
              <div class="form-field form-field__outline ma--x-1">
                <div class="form-field__outline--control">
                  <input
                      type="text"
                      class="form-field__outline--control__input"
                      v-model="item.paramValue"
                      v-outline
                      style="width: 400px"/>
                  <label for="app-param" class="form-field__outline--control__label">{{ item.paramName }}</label>
                </div>
              </div>
              </div>
            </div>
            <div class="modal__footer">
              <button type="submit" class="btn btn--primary">
                Submit
              </button>
            </div>
          </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue} from "vue-class-component";
import {Inject, Prop} from "vue-property-decorator";
import {useStore} from "vuex";

import {DataResponse, AppParamsModel, AppParamsRequestModel} from "@/model";
import {Settings} from "@/config";
import {IAppService} from "@/service/app.service";

export default class AppParams extends Vue {
  @Prop() appResponse: DataResponse<AppParamsModel> ;
  @Inject("appService") appService: IAppService;

  public request = new AppParamsRequestModel();

  public email: string;

  created() {

  }

  mounted() {
  }

  public getAllAppParams() {
    this.request._loading = true;
    this.appService.getAllAppParams().then((response: any) => {
      this.request._loading = false;
      this.appResponse = response;
    });
  }

  public updateParams() {

    this.appService.setAllAppParams(this.appResponse).then((response: any) => {
    });
  }


  public close() {
    this.$emit("close");
  }


  get appName() {
    return Settings.AppName;
  }
}
</script>
