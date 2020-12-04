import * as THREE from "three";

class GlobalManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.size = {
      windowW: null,
      windowH: null
    };

    this.clock = null;

    this.time = {
      total: null,
      delta: null
    };

    this.boneHelpers = null
  }

  init($canvas) {
    this.setSize();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.size.windowW / this.size.windowH,
      0.1,
      10000
    );
    this.camera.position.set(0, 10, -10);
    this.camera.lookAt(this.scene.position);

    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.setClearColor(0xEAF2F5);
    this.renderer.setSize(this.size.windowW, this.size.windowH);

    this.clock = new THREE.Clock();
    this.clock.start();

    this.light = new THREE.HemisphereLight(0xffffff, 0xFFFFFF);
    this.light.position.set(0, 200, 0);
    this.light.userData = {keepMe: true};
    this.scene.add(this.light);
  }

  setSize() {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
  }

  resize() {
    this.setSize();
    this.camera.aspect = this.size.windowW / this.size.windowH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.size.windowW, this.size.windowH);
  }

  render() {
    this.time.delta = this.clock.getDelta();
    this.time.total += this.delta;

    this.renderer.render(this.scene, this.camera);
  }

  showSkeleton(object) {
    if (this.boneHelpers != null) {
      this.scene.remove(this.boneHelpers)
      this.boneHelpers = null
    }
    this.boneHelpers = new THREE.SkeletonHelper(object);
    this.scene.add(this.boneHelpers)
  }

  fitCameraToObject(object, offset = 0.5) {
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    const startDistance = center.distanceTo(this.camera.position);
    const endDistance = this.camera.aspect > 1 ?
      ((size.y / 2) + offset) / Math.abs(Math.tan(this.camera.fov / 2)) :
      ((size.y / 2) + offset) / Math.abs(Math.tan(this.camera.fov / 2)) / this.camera.aspect;
    this.camera.position.set(
      this.camera.position.x * endDistance / startDistance,
      this.camera.position.y * endDistance / startDistance,
      this.camera.position.z * endDistance / startDistance,
    );
    this.camera.lookAt(center);
  }
}

export default new GlobalManager();
