import * as BABYLON from "@babylonjs/core";
export namespace Utils {
    export function getMeshesExtendsInfo(scene: BABYLON.Scene, filter?: (mesh: BABYLON.AbstractMesh) => boolean) {
        const worldExtends = scene.getWorldExtends(filter);
        const worldSize = worldExtends.max.subtract(worldExtends.min);
        const worldCenter = worldExtends.min.add(worldSize.scale(0.5));

        return { extends: worldExtends , center: worldCenter, size: worldSize };
    }
}