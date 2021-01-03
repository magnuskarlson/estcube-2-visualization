import loader from './modelLoader'
import {Mesh} from "three";
import * as THREE from "three";

const scale = 0.0008

const allowMaterialOpacity = (mesh) => {
    if (mesh.material) {

        if (mesh.material instanceof Array) {
            for (let i = 0; i < mesh.material.length; i++) {
                let m = mesh.material[i];
                m.transparent = true;
                m.side = THREE.DoubleSide;
                m.opacity = 1;
                mesh.material[i] = m.clone();
            }
        } else {
            mesh.material.transparent = true;
            mesh.material.opacity = 1;
            mesh.material.side = THREE.DoubleSide;
            mesh.material = mesh.material.clone();
        }

    }

    for (const child of mesh.children) {
        allowMaterialOpacity(child);
    }
}

Mesh.prototype.setOpacity = function (val) {
    if (this.material) {
        this.visible = val !== 0;
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

function setViewpoint(viewpoint) {
    switch (viewpoint) {
        // Front
        case 1: {
            this.rotation.x = 0.0;
            this.rotation.y = THREE.MathUtils.degToRad(90.0);
            this.rotation.z = THREE.MathUtils.degToRad(90.0);
            break;
        }

        // Back
        case 2: {
            this.rotation.x = 0.0;
            this.rotation.y = THREE.MathUtils.degToRad(270.0);
            this.rotation.z = THREE.MathUtils.degToRad(90.0);
            break;
        }

        // Left
        case 3: {
            this.rotation.x = 0.0;
            this.rotation.y = THREE.MathUtils.degToRad(0.0);
            this.rotation.z = THREE.MathUtils.degToRad(90.0);
            break;
        }

        // Right
        case 4: {
            this.rotation.x = 0.0;
            this.rotation.y = THREE.MathUtils.degToRad(180.0);
            this.rotation.z = THREE.MathUtils.degToRad(90.0);
            break;
        }

        // Top
        case 5: {
            this.rotation.x = THREE.MathUtils.degToRad(60.0);
            this.rotation.y = THREE.MathUtils.degToRad(90.0);
            this.rotation.z = 0.0;
            break;
        }

        // Bottom
        case 6: {
            this.rotation.x = THREE.MathUtils.degToRad(240.0);
            this.rotation.y = THREE.MathUtils.degToRad(90.0);
            this.rotation.z = 0.0;
            break;
        }
    }
}

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

        model.highlightPart = function (scene, ...names) {
            this.setOpacity(0);
            this.childMap["panels_and_stuff"].setOpacity(0.2);

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

        model.setViewpoint = setViewpoint;

        console.log(model);

        return model;
    }
};
