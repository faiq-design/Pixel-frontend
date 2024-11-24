<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="modal" style="width: 1000px">
      <div class="modal__header">
        <h3 class="modal__header--title">
          <i class="fa fa-file-invoice"></i>
          Print Leads Receipt
        </h3>
        <i class="fa fa-times modal__header--clear" @click="close"> </i>
      </div>
      <div class="modal__content" style="max-height: 500px">
        <div id="app">
          <a
              v-for="link in links"
              :key="link.name"
              :href="link.href"
              :target="link.target"
              @click="windowOpen(link)">
            {{ link.name }}
          </a>
          <button @click="printWindow()">Print</button>
        </div>

        <div v-html="htmlStrFunc"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue} from "vue-class-component";


export default class PrintLeadsReceipt extends Vue {
  public links: Array<any> = [
    { name: "Home", href: "/dashboard", target: "_self" },
    { name: "Google", href: "http://dev.aerolead.net:8081/api/v1/leadsreceipt/pdftemplate/189", target: "_blank" },
  ];
  public loading: boolean = false;

  public htmlStr: string = '' +
      '<input type="button" onclick="window.print()" value="print receipt"/>' +
      '<h1 style="color: #5e9ca0; text-align: center;"><span style="color: #000000;">Receipt</span></h1> <p>&nbsp;</p> <p><span style="color: #000000;"><strong>eMedia Augmentation \n' +
      'Company&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp;Date:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</strong>2022-03-06T03:21:15.637160<br />1950 N. Meridian Street&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<strong>Receipt #:&nbsp; &nbsp;</strong>Leads-Receipt-189<br />Indianapolis, IN 46202 USA</span></p> <p>&nbsp;</p> <p><span \n' +
      'style="color: #000000;"><strong>Bill To</strong><br />Roosevelt Smith<br />rsmith@ewebdata.com<br />3179703904</span></p> <hr /> <p><span style="color: #5e9ca0;"><span style="color: \n' +
      '#000000;"><strong>DESCRIPTION&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; UNIQUES&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; CREDITS USED</strong></span></span></p> <hr /> <p><span style="color: \n' +
      '#5e9ca0;"><span style="color: #000000;">Leads&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; 24</span></span></p> <hr /> <p><span style="color: #5e9ca0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \n' +
      '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span style="color: #000000;"><strong>Total (CREDITS): \n' +
      '24</strong></span></span></p>\n' +
      '<hr /> <p style="text-align: center;">&nbsp;</p> <p style="text-align: center;">&nbsp;</p> <p style="text-align: center;">Please Quote Invoice Number in all correspondence</p> <p \n' +
      'style="text-align: center;">&nbsp;</p>\n' +
      '<p style="text-align: center;"><strong>Thank You For Your Business!</strong></p>\n';



  public close() {
    this.$emit("closeReceiptPrintModel", false);
  }

  public printWindow() {
    window.print();
  }

  get htmlStrFunc() {
    return this.htmlStr;
  }

  public windowOpen(item: any){
  // Here you will be able to see all the
  // custom attributes in camelCase
   window.open(item.href, item.target,'width=1000,height=1000');
   return false;
}


}
</script>
