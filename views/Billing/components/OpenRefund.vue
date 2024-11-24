<template>
  <div class="modal-container show">
    <div class="blocker">
    </div>
    <div class="modal" style="width:500px; max-height:500px">
      <div class="modal__header modal__header--success justify--space-between">
        <h3 class="modal__header--title">Refundable Orders</h3>
        <button type="button" class="btn btn--secontary" @click="cancel" style="font-weight:bolder; color:red; background-color:white; border-radius:500px; wi">
          X
        </button>
      </div>
      <div style="overflow:auto">
        <div v-for=" (item,index) in possibleRefunds" :key="index">
          <div style="height:50px; border-bottom:1px solid gray; display:flex;">
            <div style="flex:3; align-self:center; text-align:left; margin-left:20px;">Date: {{ item[0] }}</div>
            <div style="flex:3; align-self:center; text-align:left;">Credits: {{ item[1] }}</div>
            <div style="flex:1; align-self:center;">
              <button
                :id="'refund-' + index "
                class="btn btn--secondary"
                style="margin-right:20px"
                @click="refundOrder(item)">refund</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { useStore } from "vuex";
import axios from "axios";
import { ListItem } from "@/model";



export default class OpenRefund extends Vue {
  public refundResponse: Array<ListItem> = [];
  public possibleRefunds: Array<any> = [];
  public toggleConfirmRefund: boolean = false;
  public store = useStore();
  public credits: number = 0;
  public userId: number = 0;

  mounted () {
    this.userId = this.store.getters.getCurrentUser["id"]; 
    this.credits = this.store.getters.getCurrentUser["credits"]
    axios
      .get("https://justinarnold.pythonanywhere.com/refunds/"+this.userId+"/")
      .then((response) => { 
        const allCharges = response.data['data'];
        for (let e in allCharges) {
          let transaction = allCharges[e];
          let transactionAge = (Date.now()- (transaction['created']*1000))/86400000
          let transactionDate = new Date(transaction['created']*1000).toLocaleDateString("en-US")
          let transactionAmount = transaction['amount']/100
          let transactionId = transaction['id']
          if (transactionAge <= 30 && (transactionAmount+100)<this.credits && transaction['captured'] == true && transaction['refunded'] != true) {
            let refundableOrder = [transactionDate,transactionAmount,transactionId];
            this.possibleRefunds.push(refundableOrder)
          }
        }
      }
    )
  }
  public cancel() {
    this.$emit("cancel");
  }
  public refundOrder(item: any) {
    axios
      .post('https://justinarnold.pythonanywhere.com/refunds/', {
        userId: item.userId,
        transactionId: item[2]
      }).then((response) => {
        alert('Success!')
        this.$emit("cancel");
      }) 
  }
}
</script>