<template>
    <div class="loading--spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { useStore } from "vuex";

export default class CancelSubscription extends Vue {
    public store = useStore();

    mounted() {
        this.goToSitePage();
    }

    private goToSitePage() {
        this.$router.push('/sites');
    }
}
</script>
