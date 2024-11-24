<template>
  <div class="pa--top-1">
    <div class="tabs ma--x-1 ma--top-1">
      <div
        class="tabs--item"
        :class="{
          'tabs--item__active': selectedLeadsType == 'Available',
        }"
        @click="selectedLeadsType = 'Available'">
        <div class="bottom" :data-tooltip="`New ${leadName}s for purchase.`">Available</div>
      </div>
      <div
        class="tabs--item"
        :class="{
          'tabs--item__active': selectedLeadsType == 'Purchased',
        }"
        @click="selectedLeadsType = 'Purchased'">
        <div class="bottom" :data-tooltip="`${leadName.charAt(0).toUpperCase() + leadName.slice(1)}s already purchased`">Purchased</div>
      </div>
    </div>
    <AvaliableLeads v-if="selectedLeadsType == 'Available'" @purchaseCompleted="onPurchaseCompleted" />
    <PurchasedLeads v-if="selectedLeadsType == 'Purchased'" />
  </div>
</template>
<script lang="ts">
import { Settings } from "@/config";
import { Vue, Options } from "vue-class-component";
import AvaliableLeads from "./AvaliableLeads/Index.vue";
import PurchasedLeads from "./PurchasedLeads/Index.vue";

@Options({
  components: {
    AvaliableLeads,
    PurchasedLeads,
  },
})
export default class Leads extends Vue {
  public selectedLeadsType:string | any = "Available";

  created() {
    if(this.$route.params.page)  this.selectedLeadsType = this.$route.params.page;
  }

  onPurchaseCompleted() {
    this.selectedLeadsType = 'Purchased';
  }

  get leadName() {
    return Settings.LeadName;
  }
}
</script>