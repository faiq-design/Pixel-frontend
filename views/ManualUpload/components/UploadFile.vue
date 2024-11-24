<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-upload"></i>
          Manual Upload
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <div class="modal__content" style="max-height: 520px">
        <div class="form-field form-field__standard ma--top-1">
          <div class="form-field__control">
            <input type="file" class="form-field__input" ref="upload" />
          </div>
        </div>
        <div style="font-size: 80%">
          <a :href="templateUrl" download="template.csv">Download Template</a>
        </div>
      </div>
      <div class="modal__footer">
        <button type="button" class="btn btn--primary" @click="upload">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ISitesService } from "@/service";
import { Vue } from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
import { useStore } from "vuex";

export default class UploadFile extends Vue {
  @Prop() adminSiteId: number;

  @Inject("sitesService") service: ISitesService;
  templateUrl: string = require("../../../assets/ManualUpload_Template.csv");

  public store = useStore();

  public close() {
    this.$emit("close");
  }

  public upload() {
    let control: any = this.$refs.upload;

    if (control.files.length) {
      this.service
        .uploadSiteTraffic(this.adminSiteId, control.files[0])
        .then((response) => {
          this.store.dispatch("showAlert", {
            message: "Your file uploaded successfully and getting proceesed.",
            snackBarClass: "fa-check",
            type: "success",
          });

          this.close();
        });
    }
  }
}
</script>