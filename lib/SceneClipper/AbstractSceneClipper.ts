import * as BABYLON from '@babylonjs/core';

export interface ISceneClipper {
    setEnable(value: boolean): void;
    setAuxiliaryMeshVisibility(visible: boolean): void;
    setGizmoVisibility(visible: boolean): void;
    reset(): void;
    dispose(): void;
}

export abstract class AbstractSceneClipper implements ISceneClipper {
    protected _disposed = false;
    protected _enable = false;
    protected _originPosition: Array<number>;
    protected _auxiliaryMesh: BABYLON.Mesh;
    protected _gizmoManager: BABYLON.GizmoManager;

    /**
     *
     */
    constructor(protected scene: BABYLON.Scene) {

    }

    protected abstract setClipperEnable(value: boolean): void;

    setEnable(value: boolean) {
        if (this._disposed) return;
        if (this._enable === value) return;

        this._auxiliaryMesh.isVisible = this._enable;
        this._gizmoManager.boundingBoxGizmoEnabled = this._enable;

        this.setClipperEnable(value);
        this._enable = value;
    }

    setAuxiliaryMeshVisibility(visible: boolean) {
        if (!this._enable) return;
        this._auxiliaryMesh.isVisible = visible;
    }

    setGizmoVisibility(visible: boolean) {
        if (!this._enable) return;
        const gizmos = this._gizmoManager.gizmos;
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
    }

    reset(): void {
        this._auxiliaryMesh.position = new BABYLON.Vector3(this._originPosition[0], this._originPosition[1], this._originPosition[2]);
        this._auxiliaryMesh.rotation = BABYLON.Vector3.Zero();
        this._auxiliaryMesh.scaling = BABYLON.Vector3.One();
    }

    dispose(): void {
        this.setEnable(false);
        this.scene.removeMesh(this._auxiliaryMesh, true);
        this._gizmoManager.dispose();
        this._disposed = true;
    }

    private setMeshVisibleRecursive(mesh?: BABYLON.Mesh, visible: boolean = true) {
        if (!mesh) return;

        mesh.isVisible = visible;
        mesh.getChildMeshes().forEach(m => {
            m.isVisible = visible;
        });
    }
}