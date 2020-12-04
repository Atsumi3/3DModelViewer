import GlobalManager from "./global_manager";
import Model from "./model"

export default class Renderer {
  constructor(props) {
    this.props = props;
    this.init();
  }

  init() {
    GlobalManager.init(this.props.$canvas);
    this.shape = new Model();
    window.addEventListener("resize", this.resize.bind(this));
    this.loop();
  }

  resize() {
    GlobalManager.resize();
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    this.shape.update();
    GlobalManager.render();
  }
}
