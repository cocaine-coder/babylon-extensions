import { GizmoManager, Mesh, Plane, Scene, AbstractMesh, Vector3 } from "@babylonjs/core";

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
    readonly gizmoManager: GizmoManager;
    readonly auxiliaryMesh: Mesh;
    readonly clipPlanes: Array<Plane> = [];

    /**
     *
     */
    constructor(protected scene: Scene, protected filter?: (mesh: AbstractMesh) => boolean) {
        this.gizmoManager = new GizmoManager(scene);
        this.gizmoManager.enableAutoPicking = false;
        this.gizmoManager.utilityLayer.utilityLayerScene.autoClearDepthAndStencil = false;
        this.createGizmo(this.gizmoManager);

        this.auxiliaryMesh = this.createAuxiliaryMesh(this.gizmoManager);
        this.auxiliaryMesh.isPickable = false;
        this.auxiliaryMesh.isVisible = false;
        this._originPosition = this.auxiliaryMesh.position.asArray();


        this.gizmoManager.attachableMeshes = [this.auxiliaryMesh];
        this.gizmoManager.attachToMesh(this.auxiliaryMesh);
    }

    protected abstract createAuxiliaryMesh(gizmoManager: GizmoManager): Mesh;

    protected abstract createGizmo(gizmoManager: GizmoManager): void;

    protected abstract setClipperEnable(value: boolean): void;

    abstract setAuxiliaryMeshOpacity(value: number): void;

    setEnable(value: boolean) {
        if (this._disposed || this._enable === value) return;

        this.auxiliaryMesh.isVisible = value;
        this.setClipperEnable(value);
        this._enable = value;
    }

    setGizmoMeshVisibility(visible: boolean) {
        if (this._disposed || !this._enable) return;
        const gizmos = this.gizmoManager.gizmos;
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
        this.setMeshVisibleRecursive(gizmos.boundingBoxGizmo?._rootMesh, visible);
    }

    reset(): void {
        if (this._disposed) return;

        this.auxiliaryMesh.position = new Vector3(this._originPosition[0], this._originPosition[1], this._originPosition[2]);
        this.auxiliaryMesh.rotation = Vector3.Zero();
        this.auxiliaryMesh.scaling = Vector3.One();
    }

    dispose(): void {
        if (this._disposed) return;
        this.setEnable(false);
        this.clipPlanes.length = 0;
        this.scene.removeMesh(this.auxiliaryMesh, true);
        this.gizmoManager.dispose();
        this._disposed = true;
    }

    private setMeshVisibleRecursive(mesh?: Mesh, visible: boolean = true) {
        if (!mesh) return;

        mesh.isVisible = visible;
        mesh.getChildMeshes().forEach(m => {
            m.isVisible = visible;
        });
    }
}