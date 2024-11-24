<template>
  <footer class="footer">
    Copyright {{ appName }}, 2022. All Rights Reserved.
  </footer>
</template>
<script lang="ts">
import { Settings } from "@/config";
import { Vue } from "vue-class-component";

export default class AppFooter extends Vue {
  get appName() {
    return Settings.AppName;
  }
}
</script>
