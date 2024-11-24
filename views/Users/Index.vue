<template>
  <div class="users--container ma--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <div class="btn--group">
              <button
                  class="btn btn--primary bottom right"
                  @click="createUser('Add User')"
                  data-tooltip="Create a new user account."
                  v-if="isAdmin">
                <i class="fa fa-user-plus btn--icon__prefix"></i>
                <span class="btn--name">Add User</span>
              </button>
              <button
                  class="btn btn--purple ma--x-1 bottom right"
                  @click="toggleAssignUserModel = true"
                  data-tooltip="Assign existing user to current site."
                  v-if="isAdmin">
                <i class="fa fa-id-card-alt btn--icon__prefix"></i>
                <span class="btn--name">Assign User</span>
              </button>
              <button
                  class="btn btn--green bottom right"
                  @click="toggleInviteUserModel = true"
                  data-tooltip="Invite new user to current site."
                  v-if="isAdmin">
                <i class="fa fa-id-card-alt btn--icon__prefix"></i>
                <span class="btn--name">Invite User</span>
              </button>
            </div>
          </div>
          <div class="card-content">
            <table class="table table--striped">
              <thead>
              <tr>
                <th class="text--align-left">Email</th>
                <th class="text--align-left">Firstname</th>
                <th class="text--align-left">Lastname</th>
                <th class="text--align-left" v-if="isAdmin || isSuperAdmin">
                  Role
                </th>
                <th class="text--align-left" v-if="isAdmin || isSuperAdmin">
                  Status
                </th>
                <th class="text--align-right" v-if="isAdmin || isSuperAdmin">
                  Action
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in response" :key="index">
                <td class="text--align-left">{{ item.email }}</td>
                <td class="text--align-left">{{ item.firstName }}</td>
                <td class="text--align-left">{{ item.lastName }}</td>
                <td class="text--align-left" v-if="isAdmin || isSuperAdmin">
                  {{ item.role }}
                </td>
                <td
                    class="text--align-left legend__item"
                    :class="{
                      'before--color-blue': item.enabled,
                      'before--color-red': !item.enabled,
                    }"
                    v-if="isAdmin || isSuperAdmin">
                  <div
                      :data-tooltip="
                        item.enabled
                          ? 'User is actively registered and logged in portal.'
                          : 'User has not accepted the invite yet.'
                      ">
                    {{ item.enabled ? "ACTIVE" : "PENDING" }}
                  </div>
                </td>
                <td class="text--align-right" v-if="isAdmin || isSuperAdmin">
                  <template
                      v-if="
                        (item.role == 'CLIENT' || item.role == 'ADMIN') &&
                        item.id != currentUserId
                      ">
                    <button
                        class="btn--inline btn--green btn--currency"
                        @click="updateSubscription(item)"
                        data-tooltip="Update Subscription"
                        v-if="item.enabled && isSuperAdmin"
                        :disabled="true">
                      <i
                          class="fa"
                          :class="{
                          'fa-ban': (item.additionalInfo ==null),
                          'fa-strikethrough': (item.additionalInfo !=null),
                        }"></i>
                    </button>
                    <button
                        class="btn--inline btn--green"
                        @click="approveUser(item)"
                        data-tooltip="Approve User"
                        v-if="!item.enabled && isSuperAdmin">
                      <i class="fa fa-check"></i>
                    </button>
                    <button
                        class="btn--inline btn--lock"
                        :data-tooltip="
                          item.locked
                            ? 'Unlock user access'
                            : 'Lock user access'
                        "
                        @click="restrictUser(item)"
                        v-if="item.enabled">
                      <i
                          class="fa"
                          :class="{
                            'fa-lock-open': item.locked,
                            'fa-lock': !item.locked,
                          }">
                      </i>
                    </button>
                    <button
                        class="btn--inline btn--secondary ma--right-1"
                        @click="changePassword(item)"
                        data-tooltip="Change Password"
                        v-if="isSuperAdmin">
                      <i class="fa fa-key"></i>
                    </button>
                    <button
                        class="btn--inline btn--primary"
                        @click="createUser('Update User', item)"
                        data-tooltip="Edit Profile"
                        :disabled="!item.enabled && !isSuperAdmin">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                        class="btn--inline btn--delete"
                        @click="deleteUser(item)"
                        data-tooltip="Permanently delete the user."
                        :disabled="!item.enabled && !isSuperAdmin">
                      <i class="fa fa-trash"></i>
                    </button>
                  </template>
                </td>
              </tr>
              <tr v-if="response.length == 0">
                <td colspan="7">
                  <div class="table__body--empty">
                    <div>No data to display</div>
                    <img src="../../assets/no-data.png" alt="No Data" />
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <CreateUser
                :accessType="accessType"
                :data="request"
                @closeModel="onCloseCreateUserModel"
                v-if="toggleCreateModel"/>
            <AssignUser
                @close="onCloseAssignModel"
                @assigned="assignedEmail"
                @unassigned="unAssignedUser"
                v-if="toggleAssignUserModel"/>

            <UpdateSubscription
                :user="selectedUser"
                @close="onCloseUpdateSubscription"
                @updated="updatedSubscription"
                v-if="toggleUpdateSubscriptionModel"/>
            <ChangePassword
                :user="selectedUser"
                @close="toggleChangePasswordModel = false"
                v-if="toggleChangePasswordModel"/>
            <InviteUser
                @close="onCloseInviteModel"
                @assigned="invitedEmail"
                v-if="toggleInviteUserModel"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import axios from "axios";
import { BaseComponent } from "@/components/BaseComponent";

import { useStore } from "vuex";

import { IUserService } from "@/service";
import {
  UsersRequestModel,
  UsersResponseModel,
  CreateUserRequestModel,
} from "@/model";

import CreateUser from "./components/CreateUser.vue";
import AssignUser from "./components/AssignUser.vue";
import AssignCredit from "./components/AssignCredit.vue";
import UpdateSubscription from "./components/UpdateSubscription.vue";
import ChangePassword from "./components/ChangePassword.vue";
import InviteUser from "./components/InviteUser.vue";

@Options({
  components: {
    CreateUser,
    AssignUser,
    AssignCredit,
    UpdateSubscription,
    ChangePassword,
    InviteUser,
  },
})
export default class Users extends BaseComponent {
  @Inject("userService") service: IUserService;

  public store = useStore();
  public subscription: any = null;

  public siteId: number = 0;
  public firstName: string = "";

  public accessType: string = "Add User";

  public toggleCreateModel: boolean = false;
  public toggleAssignUserModel: boolean = false;
  public toggleAssignCreditModel: boolean = false;
  public toggleUpdateSubscriptionModel: boolean = false;
  public toggleInviteUserModel: boolean = false;
  public toggleChangePasswordModel: boolean = false;
  public loading: boolean = false;
  public selectedUser: UsersResponseModel;

  public request = new UsersResponseModel();
  public response: Array<UsersResponseModel> = [];

  public isAdmin: boolean = false;
  public isSuperAdmin: boolean = false;
  public currentUserId: number;

  created() {
    this.getUsers();

    let user: CreateUserRequestModel = this.store.getters.getCurrentUser;

    this.isAdmin = user.role.indexOf("ADMIN") > -1;
    this.isSuperAdmin = user.role.indexOf("SUPERADMIN") > -1;
    this.currentUserId = user.id;
  }

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getUsers();
    });
  }

  public getUsers() {
    if (this.store.getters.getSiteId) {
      this.loading = true;
      const request = new UsersRequestModel();
      request.siteId = this.store.getters.getSiteId;
      this.service.getUser(request).then((response) => {
        this.loading = false;
        if (!this.isSuperAdmin)
          response = response.filter((r) => r.role != "SUPERADMIN");

        this.response = response.sort((n1, n2) => {
          if (n1.email > n2.email) {
            return 1;
          }

          if (n1.email < n2.email) {
            return -1;
          }

          return 0;
        });
      });
    } else this.$router.push("/sites");
  }

  public changePassword(request: UsersResponseModel) {
    this.selectedUser = request;

    this.toggleChangePasswordModel = true;
  }

  public updateSubscription(request: UsersResponseModel) {
    this.selectedUser = request;

    this.toggleUpdateSubscriptionModel = true;
  }

  public onCloseAssignCredit() {
    this.toggleAssignCreditModel = false;
  }

  public onCloseUpdateSubscription() {
    this.toggleUpdateSubscriptionModel = false;
  }

  public assignedCredit() {
    window.location.reload();
  }

  public updatedSubscription() {
    window.location.reload();
  }

  public createUser(accessType: string, request?: UsersResponseModel) {
    if (request) this.request = request;
    this.accessType = accessType;
    this.toggleCreateModel = true;
  }

  public onCloseCreateUserModel(trigger: boolean) {
    this.toggleCreateModel = false;
    this.accessType = "";
    if (trigger) this.getUsers();
  }

  public onCloseAssignModel() {
    this.toggleAssignUserModel = false;
  }

  public assignedEmail() {
    this.toggleAssignUserModel = false;
    this.store.dispatch("showAlert", {
      message: "User Assignment Request was successful. You will Receive an Email Once approved",
      snackBarClass: "fa-check",
      type: "suceess",
    });
    this.getUsers();
  }

  public unAssignedUser() {
    this.toggleAssignUserModel = false;
    this.store.dispatch("showAlert", {
      message: "User UnAssignment Request was successful. ",
      snackBarClass: "fa-check",
      type: "success",
    });
    this.getUsers();
  }

  public onCloseInviteModel() {
    this.toggleInviteUserModel = false;
  }

  public invitedEmail() {
    this.toggleInviteUserModel = false;
    this.store.dispatch("showAlert", {
      message: "User Invite Request was successful. You will Receive an Email Once approved",
      snackBarClass: "fa-check",
      type: "suceess",
    });
    this.getUsers();
  }

  private deleteUser(item: UsersResponseModel) {
    this.confirm(
        `Are you sure you want the user "${item.firstName} ${item.lastName}, ${item.email}"?`
    ).then((confirm: boolean) => {
      if (confirm) {
        axios.defaults.headers.common["Authorization"] = "";
        this.service.deleteUser(item.id).then((response) => {
          this.store.dispatch("showAlert", {
            message: "User deleted successfully",
            snackBarClass: "fa-check",
            type: "suceess",
          });
          axios.defaults.headers.common["Authorization"] =
              "Bearer " + this.store.getters.accessToken;
          this.getUsers();
        });
      }
    });
  }

  approveUser(item : UsersResponseModel) {
    item.enabled = true;
    item.type = "ADDUSER";
    item.siteId = this.store.getters.getSiteId;
    let restrict: any = item;
    this.loading = true;
    axios.defaults.headers.common["Authorization"] = "";
    this.service
        .updateUser(restrict)
        .then((response) => {
          this.loading = false;
          this.store.dispatch("showAlert", {
            message: item.locked
                ? "User approved successfully"
                : "User approved successfully",
            snackBarClass: "fa-check",
            type: "suceess",
          });
          axios.defaults.headers.common["Authorization"] =
              "Bearer " + this.store.getters.accessToken;
          this.getUsers();
        })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: error.response.data,
              snackBarClass: "fa-times",
              type: "error",
            });
          this.loading = false;
        });
  }

  public restrictUser(item: UsersResponseModel) {
    item.locked = !item.locked;
    item.type = "ADDUSER";
    item.siteId = this.store.getters.getSiteId;
    let restrict: any = item;
    this.loading = true;
    axios.defaults.headers.common["Authorization"] = "";
    this.service
        .updateUser(restrict)
        .then((response) => {
          this.loading = false;
          this.store.dispatch("showAlert", {
            message: item.locked
                ? "User locked successfully"
                : "User unlocked successfully",
            snackBarClass: "fa-check",
            type: "suceess",
          });
          axios.defaults.headers.common["Authorization"] =
              "Bearer " + this.store.getters.accessToken;
          this.getUsers();
        })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: error.response.data,
              snackBarClass: "fa-times",
              type: "error",
            });
          this.loading = false;
        });
  }
}
</script>
