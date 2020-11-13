import * as FBXLoader from 'three/examples/jsm/loaders/FBXLoader'

const loader = new FBXLoader.FBXLoader()

export default {
    load(path, onProgress) {
        return new Promise((resolve, reject) => {
            loader.load(path,
                obj => {
                    resolve(obj);
                },
                onProgress,
                error => {
                    reject(error);
                })
        });
    }
};