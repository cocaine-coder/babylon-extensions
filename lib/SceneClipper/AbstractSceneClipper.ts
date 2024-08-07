import * as BABYLON from '@babylonjs/core';

export interface ISceneClipper {
    setEnable(value: boolean): void;
    setGizmoMeshVisibility(visible: boolean): void;
    setAuxiliaryMeshOpacity(value: number): void;
    reset(): void;
    dispose(): void;
}

export abstract class AbstractSceneClipper implements ISceneClipper {
    private _disposed = false;
    private _enable = false;
    private _originPosition: Array<number>;
    readonly gizmoManager: BABYLON.GizmoManager;
    readonly auxiliaryMesh: BABYLON.Mesh;

    /**
     *
     */
    constructor(protected scene: BABYLON.Scene, protected filter? : (mesh: BABYLON.AbstractMesh) => boolean) {
        this.auxiliaryMesh = this.createAuxiliaryMesh();  
        this._originPosition = this.auxiliaryMesh.position.asArray();
        this.gizmoManager = this.createGizmoManager(this.auxiliaryMesh);

        this.auxiliaryMesh.isVisible = false;
    }

    protected abstract createAuxiliaryMesh(): BABYLON.Mesh;

    protected abstract createGizmoManager(auxiliaryMesh: BABYLON.Mesh): BABYLON.GizmoManager;

    protected abstract setClipperEnable(value: boolean): void;

    abstract setAuxiliaryMeshOpacity(value: number): void;

    setEnable(value: boolean) {
        if (this._disposed) return;
        if (this._enable === value) return;

        this.auxiliaryMesh.isVisible = value;

        this.setClipperEnable(value);
        this._enable = value;
    }

    setGizmoMeshVisibility(visible: boolean) {
        if (!this._enable) return;
        const gizmos = this.gizmoManager.gizmos;
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
    }

    reset(): void {
        this.auxiliaryMesh.position = new BABYLON.Vector3(this._originPosition[0], this._originPosition[1], this._originPosition[2]);
        this.auxiliaryMesh.rotation = BABYLON.Vector3.Zero();
        this.auxiliaryMesh.scaling = BABYLON.Vector3.One();
    }

    dispose(): void {
        if(this._disposed) return;
        this.setEnable(false);
        this.scene.removeMesh(this.auxiliaryMesh, true);
        this.gizmoManager.dispose();
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