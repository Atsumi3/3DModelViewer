import * as THREE from 'three'
import EventBus from "~/utils/event-bus";
import EVENT_NAME from "~/utils/event_name";

const SupportingMaterialType = {
  MeshBasicMaterial: "MeshBasicMaterial",
  MeshNormalMaterial: "MeshNormalMaterial"
}

class ModelManager {
  // name: texture?
  textures = {};

  // name: id
  shapeKeys = {};

  // name: value
  shapeValues = {};

  initModel(model) {
    this.textures = {}
    this.shapeKeys = {}
    this.updateTextures(model)
    EventBus.$emit(EVENT_NAME.onModelDisplayed)
  }

  updateTextures(model) {
    for (let i = 0; i < model.children.length; i++) {
      const child = model.children[i]
      console.log(child.material)
      for (let k in child.morphTargetDictionary) {
        this._registerShapeIfNotExist(k, child.morphTargetDictionary[k])
      }
      if (child.type === "SkinnedMesh" || child.type === "Mesh") {
        if (Array.isArray(child.material)) {
          for (let j = 0; j < child.material.length; j++) {
            const texture = this.textures[child.material[j].name];
            const materialName = child.material[j].name
            if (texture != null) {
              child.material[j] = this._createMaterial(materialName, texture);
            } else {
              this._registerTextureNameIfNotExist(materialName)
            }
          }
        } else {
          const texture = this.textures[child.material.name];
          const materialName = child.material.name
          if (texture != null) {
            child.material = this._createMaterial(materialName, texture);
          } else {
            this._registerTextureNameIfNotExist(materialName)
          }
        }
      }
    }
  }

  updateShape(loadedModel, key) {
    let shapeId = this.shapeKeys[key]
    let shapeValue = this.shapeValues[key]
    for (let i = 0; i < loadedModel.children.length; i++) {
      if (loadedModel.children[i].morphTargetInfluences && loadedModel.children[i].morphTargetInfluences.length > 0) {
        loadedModel.children[i].morphTargetInfluences[shapeId] = shapeValue
      }
    }
  }

  _createMaterial(name, texture, materialType = SupportingMaterialType.MeshBasicMaterial) {
    switch (materialType) {
      case SupportingMaterialType.MeshBasicMaterial:
        return new THREE.MeshBasicMaterial({
          skinning: true,
          map: texture,
          name: name,
          morphTargets: true
        });
      case SupportingMaterialType.MeshNormalMaterial:
        return new THREE.MeshNormalMaterial({});
      default:
        console.log("Unknown MaterialType")
        return new THREE.MeshBasicMaterial()
    }
  }

  _registerTextureNameIfNotExist(name) {
    if (name in this.textures) {
      return
    }
    this.textures[name] = null
  }

  _registerShapeIfNotExist(key, id) {
    if (key in this.shapeKeys) {
      return
    }
    this.shapeKeys[key] = id
    this.shapeValues[key] = 0
  }

  onLoadTexture(base64, textureName) {
    this._loadTextureFromBase64(base64, function (texture) {
      modelManager.textures[textureName] = texture
      EventBus.$emit(EVENT_NAME.onTextureLoaded)
    });
  }

  _loadTextureFromBase64(base64Image, callback) {
    const image = new Image();
    image.src = base64Image;
    const texture = new THREE.Texture();
    texture.image = image;
    image.onload = function () {
      texture.needsUpdate = true;
      callback(texture);
    };
  }

  onChangeShapeValue(shapeKey, shapeValue) {
    this.shapeValues[shapeKey] = shapeValue
    EventBus.$emit(EVENT_NAME.onShapeValueChanged, shapeKey)
  }
}

const modelManager = new ModelManager()
export {
  modelManager,
  SupportingMaterialType
}
