<template>
  <section class="nav">
    <label>
      <input type="file" accept=".fbx" @change="loadModel">
    </label>
    <ul>
      <li v-for="item of textures">
        <span>{{ item }}<input type="file" @change="loadTexture" v-bind:name="item"></span>
      </li>
    </ul>
    <ul class="scrollable_list">
      <li v-for="item of shapeKeys">
        <label>
          <input type="range" min="0" max="100" value="0" @change="changeShapeKeyValue" v-bind:name="item">
          {{ item }}
        </label>
      </li>
    </ul>
  </section>
</template>
<script>
import EventBus from "~/utils/event-bus";
import EVENT_NAME from "~/utils/event_name";
import fbxLoader from "~/utils/fbx_loader";
import GlobalManager from "@/components/MainContent/js/global_manager";
import {modelManager} from "~/utils/model_manager";

export default {
  components: {},
  data: function () {
    return {
      textures: [],
      shapeKeys: []
    }
  },
  created() {
    EventBus.$on(EVENT_NAME.onModelDisplayed, () => {
      this.textures = Object.keys(modelManager.textures)
      this.shapeKeys = Object.keys(modelManager.shapeKeys)
    });
  },
  methods: {
    loadModel: function (event) {
      const fileData = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        GlobalManager.model = fbxLoader.parse(reader.result, './')
        EventBus.$emit(EVENT_NAME.onLoadModel)
      };
      reader.readAsArrayBuffer(fileData);
    },

    loadTexture: function (e) {
      const materialName = e.target.name;
      const fileData = e.target.files[0];
      if (!fileData.type.match('image.*')) {
        alert('画像を選択してください');
        return;
      }
      const reader = new FileReader();
      reader.onload = function () {
        modelManager.onLoadTexture(reader.result, materialName)
      };
      reader.readAsDataURL(fileData);
    },

    changeShapeKeyValue: function (e) {
      const shapeKey = e.target.name
      const shapeValue = (e.target.value / 100) // 0 ~ 1.0
      modelManager.onChangeShapeValue(shapeKey, shapeValue)
    }
  }
}
</script>
<style lang="scss">
.nav {
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px 30px;

  h1 {
    // font-weight: normal;
    font-size: 20px;
    margin-bottom: 40px;
  }

  ul {
    padding: 0;

    li {
      list-style: none;
      font-size: 18px;
      letter-spacing: 0.01em;
      margin-bottom: 20px;

      a {
        color: #000;
        text-decoration: none;
        opacity: 0.5;

        &.nuxt-link-exact-active {
          opacity: 1;
        }

        &:hover {
          opacity: 1;
        }
      }

    }
  }

  .scrollable_list {
    height: 400px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
