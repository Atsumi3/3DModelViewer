<template>
  <div>
    <MainContent/>
    <nuxt/>
    <FrontUI/>
  </div>
</template>

<script>
import MainContent from "~/components/MainContent";
import FrontUI from "@/components/front";

export default {
  components: {
    MainContent,
    FrontUI,
  }
}
</script>

<style>
</style>
