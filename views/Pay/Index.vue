<template>
    <div>
        <stripe-element-card
            ref="elementRef"
            :pk="publishableKey"
            @token="tokenCreated"
            v-if="payNow"/>
        <button @click="submit">Generate token</button>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";

import { useStore } from "vuex";
import { StripeElementCard } from '@vue-stripe/vue-stripe';

import { Settings } from "@/config";

@Options({
    components: {
        StripeElementCard
    }
})
export default class Pay extends Vue {
    public store = useStore();
    public publishableKey: string = "";
    public payNow: boolean = true;

    mounted() {
        this.publishableKey = Settings.PublicKey;
    }

    submit () {
        (this.$refs.elementRef as any).submit();
    }

    tokenCreated(token: any) {
    }
    
}
</script>