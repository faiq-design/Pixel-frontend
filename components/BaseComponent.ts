import { Vue } from "vue-class-component";

export class BaseComponent extends Vue {
    
    confirm(message: string, yesButtonText?: string, noButtonText?: string) {
        let root: any = this.$root;

        return root.$confirm(message, yesButtonText, noButtonText);
    }

}