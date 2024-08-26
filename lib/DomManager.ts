
import { Scene, Vector3, Observer, Matrix } from '@babylonjs/core';
import { Utils } from './utils';

export interface FollowCameraDomElementOptions {
    id: string;
    scene: Scene;
    position: Vector3;
    content: HTMLElement | string;
    parent: HTMLElement;
}

export class FollowCameraDomElement {
    private _obs: Observer<Scene>;

    readonly id: string;
    readonly wapper = document.createElement('div');

    /**
     *
     */
    constructor(private options: FollowCameraDomElementOptions) {
        this.id = options.id;

        const style = this.wapper.style;
        style.position = 'absolute';
        style.pointerEvents = "visible";
        style.transform = "translate(-50%, -50%)";
        style.userSelect = 'none';

        this.wapper.append(options.content);

        this._obs = options.scene.onBeforeRenderObservable.add((s, e) => {
            const transformMatrix = options.scene.getTransformMatrix();

            const coordScale = Vector3.Project(
                options.position,
                Matrix.Identity(),
                transformMatrix,
                options.scene.activeCamera!.viewport);

            style.top = options.parent.clientHeight * coordScale.y + "px";
            style.left = options.parent.clientWidth * coordScale.x + "px";
        });

        options.parent.appendChild(this.wapper);
    }

    setContent(content: HTMLElement) {
        this.wapper.childNodes.forEach(n => {
            n.remove();
        });

        this.wapper.append(content);
    }

    setPosition(position: Vector3) {
        this.options.position = position;
    }

    setVisible(value: boolean) {
        this.wapper.style.display = value ? 'block' : 'none';
    }

    dispose() {
        this.options.scene.onBeforeRenderObservable.remove(this._obs);
        this.wapper.remove();
    }
}

export class FollowDomManager {
    private readonly _containerId = "babylonjs-follow-dom-container";
    private _container: HTMLDivElement;
    private _elements: FollowCameraDomElement[] = []

    /**
     *
     */
    constructor(private scene: Scene) {
        this._container = this.createContainer();
    }

    set(id: string, content: HTMLElement | string, position: Vector3) {
        const element = new FollowCameraDomElement({
            id,
            scene: this.scene,
            content,
            position: position.clone(),
            parent: this._container
        });
        this._elements.push(element);
        return element;
    }

    get(id: string) {
        return this._elements.filter(x => x.id === id);
    }

    clear() {
        this._elements.forEach(x => x.dispose());
    }

    setVisible(value: boolean) {
        this._elements.forEach(x => x.setVisible(value));
    }

    private createContainer() {
        let div = document.getElementById(this._containerId) as HTMLDivElement | undefined;
        if (!div) {
            div = Utils.createElement('div', {
                id : this._containerId,
                style : {
                    position : 'relative',
                    overflow : 'hidden',
                    width : '100%',
                    height : '100%'
                }
            });

            const canvas = this.scene.getEngine().getRenderingCanvas()!;
            canvas.parentElement?.insertBefore(div, canvas);
            div.append(canvas);
        }

        return div;
    }
}