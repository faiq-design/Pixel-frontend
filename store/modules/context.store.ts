import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { UserService } from '@/service';
import { CreditsRequestModel } from '@/model';

const state: any = {
    siteId: localStorage.getItem("siteId") || 0,
    siteName: localStorage.getItem("siteName") || "",
    siteSubscriptionId: localStorage.getItem("siteSubscriptionId") || "",
    message: "",
    snackBarClass: "",
    type: "",
    enableHelpDesk: false,
    credits: 0,
    amount: 0,
    sideBar: false,
    stripeId: sessionStorage.getItem("stripeId") || ""
}
const getters: GetterTree<any, any> = {
    getSideBarStatus: state => {
        return state.sideBar;
    },
    getSiteId: state => {
        return state.siteId;
    },
    getSiteName: state => {
        return state.siteName;
    },
    getHelpDeskStatus: state => {
        return state.enableHelpDesk
    },
    getCredits: state => {
        return state.credits;
    },
    getPurchasedCredits: state => {
        return localStorage.getItem("credits");
    },
    getPurchasedAmount: state => {
        return localStorage.getItem("amount");
    },
    getCurrentUser: state => {
        return {};
    },
    getStripeId: state => {
        return state.stripeId;
    },
    getSiteSubscriptionId: state => {
        return state.siteSubscriptionId;
    },
    
    // isAdmin: state => {
    //     const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "") : {};
    //     return user.role.indexOf("ADMIN") > -1
    // },
    // isSuperAdmin: state => {
    //     debugger;
    //     const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "") : {};
    //     return user.role.indexOf("SUPERADMIN") > -1
    // }
}
const mutations: MutationTree<any> = {
    onShowSnackbar(state, data) {
        state.message = data.message;
        state.snackBarClass = data.snackBarClass;
    },
    onShowAlert(state, data) {
        state.message = data.message;
        state.snackBarClass = data.snackBarClass;
        state.type = data.type;
    },
    onChangeSiteId(state, siteId) {
        state.siteId = siteId;

        localStorage.setItem("siteId", siteId);
    },
    onChangeSiteName(state, siteName) {
        state.siteName = siteName;

        localStorage.setItem("siteName", siteName);
    },
    onChangeSiteSubscriptionId(state, siteSubscriptionId) {
        state.siteSubscriptionId = siteSubscriptionId;

        localStorage.setItem("siteSubscriptionId", siteSubscriptionId);
    },
    onTriggerHelpDesk(state) {
        state.enableHelpDesk = !state.enableHelpDesk;
    },
    onCloseHelpDesk(state) {
        state.enableHelpDesk = false;
    },
    onUpdateCredits(state, credits) {
        state.credits = credits;
    },
    onAddPurchaseCredits(state, payload) {
        localStorage.setItem("credits", payload.credits);
        localStorage.setItem("amount", payload.amount);
    },
    onUpdateSideBar(state) {
        state.sideBar = !state.sideBar;
    },
    onSetStripeId (state, stripeId) {
        sessionStorage.setItem("stripeId", stripeId);
        state.stripeId = stripeId;
    }
}
const actions: ActionTree<any, any> = {
    showSnack(context, payload) {
        context.commit("onShowSnackbar", payload);
    },
    showAlert(context, payload) {
        context.commit("onShowAlert", payload);
    },
    updateSiteId(context, siteId) {
        context.commit('onChangeSiteId', siteId);
    },
    updateSiteName(context, siteName) {
        context.commit('onChangeSiteName', siteName);
    },
    updateSiteSubscriptionId(context, siteSubscriptionId) {
        context.commit('onChangeSiteSubscriptionId', siteSubscriptionId);
    },
    triggerHelpDesk(context) {
        context.commit('onTriggerHelpDesk')
    },
    closeHelpDesk(context) {
        context.commit("onCloseHelpDesk");
    },
    updateCredits(context) {
        const service = new UserService();
        service.getCredits().then((response) => {
            context.commit('onUpdateCredits', response);
        });
    },
    addPurchaseCredits(context, payload) {
        context.commit('onAddPurchaseCredits', payload);
    },
    updateSideBar(context) {
        context.commit('onUpdateSideBar');
    },
    setStripeId(context, stripeId) {
        context.commit('onSetStripeId', stripeId);
    }
}

export const ContextModule = {
    state,
    getters,
    mutations,
    actions
}
