import * as BABYLON from "@babylonjs/core";
export namespace Utils {
    export function getMeshesExtendsInfo(scene: BABYLON.Scene, filter?: (mesh: BABYLON.AbstractMesh) => boolean) {
        const worldExtends = scene.getWorldExtends(filter);
        const worldSize = worldExtends.max.subtract(worldExtends.min);
        const worldCenter = worldExtends.min.add(worldSize.scale(0.5));

        return { worldExtends, worldCenter, worldSize };
    }

    export function createHtmlElementFollowCamera(scene: BABYLON.Scene, element: HTMLElement, position: BABYLON.Vector3) {
        const wapper = document.createElement('div');
        const style = wapper.style;
        style.position = 'absolute';
        style.pointerEvents = "visible";
        style.transform = "translate(-50%, -50%)";

        wapper.append(element);

        let div = document.getElementById("container-htmlelements-follow-camera");
        if (!div) {
            div = document.createElement("div");
            div.id = "container-htmlelements-follow-camera";
            const canvas = scene.getEngine().getRenderingCanvas()!;
            canvas.parentElement!.insertBefore(div, canvas);
            div.append(canvas);
            
            div.style.position = "relative";
            div.style.overflow = "hidden";
        }
        div.append(wapper);

        const obs = scene.onBeforeRenderObservable.add((s, e) => {
            const transformMatrix = scene.getTransformMatrix();

            const coordScale = BABYLON.Vector3.Project(
                position,
                BABYLON.Matrix.Identity(),
                transformMatrix,
                scene.activeCamera!.viewport);

            style.top = div.clientHeight * coordScale.y + "px";
            style.left = div.clientWidth * coordScale.x + "px";
        });

        return () => {
            scene.onBeforeRenderObservable.remove(obs);
            wapper.remove();
        }
    }
}