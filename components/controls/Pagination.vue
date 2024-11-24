<template>
  <div class="pagination--container">
    <div class="pagination--page__count ma--left-1">
      {{ pageSize * (page - 1) + 1 }} -
      {{ pageSize * (page - 1) + showPage }} of
      {{ $filters.numberDisplay(totalResults) }}
    </div>
    <div class="pagination--options">
      <button
        class="btn btn--icon ma--left-1"
        :disabled="page == 1"
        @click="prev">
        <i class="fa fa-chevron-left"></i>
      </button>
      <button
        class="btn btn--icon ma--left-1"
        :disabled="totalPages == page"
        @click="next">
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class Pagination extends Vue {
  @Prop() totalResults: number;
  @Prop() showPage: number;
  @Prop() totalPages: number;
  @Prop() page: number = 1;

  public pageSizeOptions: Array<number> = [10, 25, 50];
  public pageSize: number = 50;
  public triggerAutocomplete: boolean = false;

  public prev() {
    this.onChange("prev");
  }

  public next() {
    this.onChange("next");
  }

  onChange(action: string) {
    this.$emit("applyPagination", action);
  }
}
</script>