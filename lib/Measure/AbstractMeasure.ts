import * as BABYLON from "@babylonjs/core";
import { FollowDomManager } from "../DomManager";

export interface IMeasure {
    start(): void;
    stop(): void;
    clear(): void;
    setVisible(value: boolean): void;
    dispose(): void;
}

export abstract class AbstractMeasure implements IMeasure {
    private _started = false;
    protected meshes = new Array<BABYLON.AbstractMesh>();
    protected followDomManager : FollowDomManager;

    /**
     *
     */
    constructor(protected scene: BABYLON.Scene) {
        this.followDomManager = new FollowDomManager(scene);
    }

    abstract onStart(): void;
    abstract onStop(): void;

    start() {
        if (!this._started) {
            this.onStart();
        }
    }

    stop(): void {
        if (this._started) {
            this.onStop();
        }
    }

    clear() {
        this.meshes.forEach(mesh => {
            this.scene.removeMesh(mesh);
        });
        this.followDomManager.clear();
    }

    setVisible(value: boolean) {
        this.meshes.forEach(mesh => {
            mesh.isVisible = value;
        });
    }

    dispose() {
        this.stop();
        this.clear();
    }
}