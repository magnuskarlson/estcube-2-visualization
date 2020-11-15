import * as THREE from 'three'

export default {
    createHighlightPlane(pos, camera, scene) {
        const bitmap = document.createElement('canvas');
        const g = bitmap.getContext('2d');
        bitmap.width = 100;
        bitmap.height = 100;
        g.font = '10px Arial';

        const text = "TODO: some text";

        g.fillStyle = 'white';
        g.fillText(text, 0, 20);

        const texture = new THREE.Texture(bitmap)
        texture.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry( 1, 1, 64 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: texture, transparent: true} );
        const plane = new THREE.Mesh( geometry, material );
        plane.position.copy(pos);

        plane.quaternion.copy(camera.quaternion);

        scene.add(plane);

        return plane;
    }
}