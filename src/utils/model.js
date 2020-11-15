import loader from './modelLoader'
import {Mesh} from "three";

const scale = 0.0008

const allowMaterialOpacity = (mesh) => {
    if (mesh.material) {

        if (mesh.material instanceof Array) {
            for (let i = 0; i < mesh.material.length; i++) {
                let m = mesh.material[i];
                m.transparent = true;
                m.opacity = 1;
                mesh.material[i] = m.clone();
            }
        } else {
            mesh.material.transparent = true;
            mesh.material.opacity = 1;

            mesh.material = mesh.material.clone();
        }

    }

    for (const child of mesh.children) {
        allowMaterialOpacity(child);
    }
}

Mesh.prototype.setOpacity = function (val) {
    if (this.material) {
        if (this.material instanceof Array) {
            this.material.forEach(m => m.opacity = val);
        } else {
            this.material.opacity = val;
        }
    }

    for (const child of this.children) {
        child.setOpacity(val);
    }
};

export default {
    async create() {
        const model = await loader.load("/estcube.fbx");
        model.scale.x = scale;
        model.scale.y= scale;
        model.scale.z = scale;

        model.childMap = model.children.reduce((prev, curr) => {
            prev[curr.name] = curr;
            return prev;
        }, {})

        allowMaterialOpacity(model);

        model.setOpacity = function (val) {
            for (const child of this.children) {
                child.setOpacity(val);
            }
        }

        model.highlighted = [];

        model.highlightPart = function (...names) {
            this.setOpacity(0.1);

            for (const name of names) {
                let target = this.childMap[name];
                target.renderOrder = -1;
                target.setOpacity(1.0);
                model.highlighted.push(target);
            }
        }

        model.resetHighlight = function () {
            this.setOpacity(1.0);
            for (const highlightedElement of this.highlighted) {
                highlightedElement.renderOrder = 0;
            }

            this.highlighted = [];
        }

        console.log(model);

        return model;
    }
};
