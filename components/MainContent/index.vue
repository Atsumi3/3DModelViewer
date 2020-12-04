<template>
  <section class="main_content">
    <canvas ref="canvas" class="main_content__canvas"></canvas>
  </section>
</template>

<script>
import Renderer from "./js/renderer";

export default {
  name: 'main_content',
  mounted() {
    if (!this.mainContentGL) this.mainContentGL = new Renderer({
      $canvas: this.$refs.canvas
    });
  },
};
</script>
<style>
.main_content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #EAF2F5;
}
</style>
