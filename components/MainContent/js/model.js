import GlobalManager from "./global_manager";

import EventBus from "~/utils/event-bus";
import EVENT_NAME from "~/utils/event_name";
import {modelManager} from "~/utils/model_manager";

export default class Model {

  constructor() {
    this.init();
  }

  init() {
    EventBus.$on(EVENT_NAME.onLoadModel, this.onLoadModel.bind(this));
    EventBus.$on(EVENT_NAME.onTextureLoaded, this.onTextureLoaded.bind(this));
    EventBus.$on(EVENT_NAME.onShapeValueChanged, this.onShapeValueChanged.bind(this));
  }

  onLoadModel(e) {
    if (this.loadedModel != null) {
      GlobalManager.scene.remove(this.loadedModel);
    }
    this.loadedModel = GlobalManager.model
    modelManager.initModel(this.loadedModel)
    GlobalManager.scene.add(this.loadedModel);
    GlobalManager.fitCameraToObject(this.loadedModel)
    // Common.showSkeleton(this.loadedModel)
  }

  onTextureLoaded(e) {
    modelManager.updateTextures(this.loadedModel)
  }

  onShapeValueChanged(e) {
    modelManager.updateShape(this.loadedModel, e)
  }

  update() {
    if (this.loadedModel == null) {
      return;
    }
    this.loadedModel.rotation.y += GlobalManager.time.delta;
  }
}
