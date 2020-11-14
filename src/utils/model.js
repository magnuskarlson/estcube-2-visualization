import loader from './modelLoader'

const scale = 0.0008



export default {
    async create() {
        const model = await loader.load("/estcube.fbx");
        model.scale.x = scale;
        model.scale.y= scale;
        model.scale.z = scale;

        return model;
    }
};
