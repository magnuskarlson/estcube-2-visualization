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
        const bitmap = document.createElement('canvas');
        const g = bitmap.getContext('2d');
        bitmap.width = 400;
        bitmap.height = 400;
        g.font = '40px Arial';

        const text = "TODO: some text";

        g.fillStyle = 'white';
        g.fillRect(0, 0, bitmap.width, bitmap.height)

        g.fillStyle = 'black';
        g.fillText(text, 0, 40);


        const texture = new THREE.Texture(bitmap)
        texture.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry( 0.5, 0.5, 64 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: texture, transparent: true} );
        const plane = new THREE.Mesh( geometry, material );
        plane.position.copy(pos);
        plane.quaternion.copy(camera.quaternion);

        scene.add(plane);

        let line = createTrackingLine(pos, model, targetName);

        scene.add( line );

        console.log(line);

        return {
            plane: plane,
            line: line,
            scene: scene,

            destroy() {
                this.scene.remove(this.plane);
                this.plane.geometry.dispose();
                this.plane.material.dispose();

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