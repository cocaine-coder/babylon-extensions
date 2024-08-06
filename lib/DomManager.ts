import * as BABYLON from '@babylonjs/core';

export interface FollowCameraDomElementOptions {
    id: string;
    scene: BABYLON.Scene;
    position: BABYLON.Vector3;
    content: HTMLElement;
    parent: HTMLElement;
}

export class FollowCameraDomElement {
    private _wapper = document.createElement('div');
    private _obs: BABYLON.Observer<BABYLON.Scene>;

    readonly id: string;

    /**
     *
     */
    constructor(private options: FollowCameraDomElementOptions) {
        this.id = options.id;

        const style = this._wapper.style;
        style.position = 'absolute';
        style.pointerEvents = "visible";
        style.transform = "translate(-50%, -50%)";

        this._wapper.append(options.content);

        this._obs = options.scene.onBeforeRenderObservable.add((s, e) => {
            const transformMatrix = options.scene.getTransformMatrix();

            const coordScale = BABYLON.Vector3.Project(
                options.position,
                BABYLON.Matrix.Identity(),
                transformMatrix,
                options.scene.activeCamera!.viewport);

            style.top = options.parent.clientHeight * coordScale.y + "px";
            style.left = options.parent.clientWidth * coordScale.x + "px";
        });

        options.parent.appendChild(this._wapper);
    }

    setContent(content: HTMLElement) {
        this._wapper.childNodes.forEach(n => {
            n.remove();
        });

        this._wapper.append(content);
    }

    setPosition(position: BABYLON.Vector3) {
        this.options.position = position;
    }

    dispose() {
        this.options.scene.onBeforeRenderObservable.remove(this._obs);
        this._wapper.remove();
    }
}

export class FollowDomManager {
    private readonly _containerId = "follow-dom-container";
    private _container: HTMLDivElement;
    private _elements: FollowCameraDomElement[] = []

    /**
     *
     */
    constructor(private scene: BABYLON.Scene) {
        this._container = this.createContainer();
    }

    set(id: string, content: HTMLElement, position: BABYLON.Vector3) {
        this._elements.push(new FollowCameraDomElement({
            id,
            scene: this.scene,
            content,
            position:position.clone(),
            parent: this._container
        }));
    }

    get(id: string) {
        return this._elements.filter(x=>x.id === id);
    }

    clear(){
        this._elements.forEach(x=>x.dispose());
    }

    private createContainer() {
        let div = document.getElementById(this._containerId) as HTMLDivElement | undefined;
        if (!div) {
            div = document.createElement('div');
            div.id = this._containerId;

            div.style.position = 'relative';
            div.style.overflow = 'hidden';

            const canvas = this.scene.getEngine().getRenderingCanvas()!;
            canvas.parentElement?.insertBefore(div, canvas);
            div.append(canvas);
        }

        return div;
    }
}