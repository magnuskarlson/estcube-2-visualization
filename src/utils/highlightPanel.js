import * as THREE from 'three'

function createTrackingLine(pos, model, targetName) {
    const material = new THREE.LineBasicMaterial( { color: 0xFF0000 } );
    const geometry = new THREE.Geometry();
    geometry.dynamic = true;
    geometry.vertices.push(pos);

    geometry.vertices.push(new THREE.Vector3(0,0,0));

    console.log(model.childMap[targetName])

    let line = new THREE.Line(geometry, material);
    line.panelPos = pos;
    return line;
}

export default {
    createHighlightPlane(pos, camera, scene, model, targetName) {
        let line = createTrackingLine(pos, model, targetName);
        scene.add( line );

        return {
            line: line,
            scene: scene,

            destroy() {
                this.scene.remove(this.line);
                this.line.geometry.dispose();
                this.line.material.dispose();
            },

            updatePanel() {
                console.log(this.line);
                return (() => {
                    let child = model.childMap[targetName];
                    child.updateWorldMatrix();
                    this.line.geometry.vertices[1].setFromMatrixPosition(child.matrixWorld);
                    this.line.geometry.vertices[0] = this.line.panelPos.clone();
                    this.line.geometry.verticesNeedUpdate = true;
                });
            }
        };
    }
}