import * as BABYLON from '@babylonjs/core';
import { AbstractSceneClipper } from './AbstractSceneClipper';
import { Utils } from '../utils';

export class SceneClipperBox extends AbstractSceneClipper {

    constructor(scene: BABYLON.Scene, private filter?: (mesh: BABYLON.AbstractMesh) => boolean) {
        super(scene);
    }

    setAuxiliaryMeshOpacity(value: number) {
        value = value > 1 ? 1 : value < 0 ? 0 : value;
        const material = this.auxiliaryMesh.material as BABYLON.StandardMaterial;
        material.alpha = value;
    }

    protected createAuxiliaryMesh(): BABYLON.Mesh {
        const scene = this.scene;
        const filter = this.filter;

        const { worldSize, worldCenter } = Utils.getMeshesExtendsInfo(scene, filter);

        const material = new BABYLON.StandardMaterial("clip-box-material", scene);
        material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        material.alpha = 0.2;

        const box = BABYLON.MeshBuilder.CreateBox("clip-box", {
            width: worldSize.x,
            height: worldSize.y,
            depth: worldSize.z,
        }, scene)!;

        box.position = worldCenter;
        box.material = material;

        return box;
    }

    protected createGizmoManager(auxiliaryMesh: BABYLON.Mesh): BABYLON.GizmoManager {
        const gizmoManager = new BABYLON.GizmoManager(this.scene);
        gizmoManager.boundingBoxGizmoEnabled = true;
        gizmoManager.attachableMeshes = [auxiliaryMesh];
        gizmoManager.attachToMesh(auxiliaryMesh);
        gizmoManager.gizmos.boundingBoxGizmo!.fixedDragMeshScreenSize = true;
        gizmoManager.gizmos.boundingBoxGizmo!.fixedDragMeshBoundsSize = true;
        gizmoManager.enableAutoPicking = false;
        gizmoManager.boundingBoxDragBehavior.disableMovement = true;

        return gizmoManager;
    }

    protected setClipperEnable(value: boolean) {
        this._gizmoManager.boundingBoxGizmoEnabled = value;
        const meshes = this.filter ? this.scene.meshes.filter(this.filter) : this.scene.meshes;

        if (value) {
            const scene = this.scene;

            meshes.forEach(m => {
                if (!(m instanceof BABYLON.Mesh) || this.auxiliaryMesh === m) return;

                m.onBeforeRenderObservable.add(() => {
                    const box = this.auxiliaryMesh;

                    const data = BABYLON.VertexData.ExtractFromMesh(box);
                    const positions = new Array<{ x: number, y: number, z: number }>();
                    for (let i = 0; i < data.positions!.length; i += 3) {
                        const x = data.positions![i + 0];
                        const y = data.positions![i + 1];
                        const z = data.positions![i + 2];

                        if (positions.some(p => p.x === x && p.y === y && p.z === z)) continue;
                        positions.push({ x, y, z });
                    }

                    const zSort = positions.concat([]).sort((a, b) => a.z - b.z);
                    const ySort = positions.concat([]).sort((a, b) => a.y - b.y);
                    const xSort = positions.concat([]).sort((a, b) => a.x - b.x);

                    const zMax = new BABYLON.Vector3((zSort[7].x + zSort[6].x + zSort[5].x + zSort[4].x) / 4, (zSort[7].y + zSort[6].y + zSort[5].y + zSort[4].y) / 4, (zSort[7].z + zSort[6].z + zSort[5].z + zSort[4].z) / 4);
                    const zMin = new BABYLON.Vector3((zSort[0].x + zSort[1].x + zSort[2].x + zSort[3].x) / 4, (zSort[0].y + zSort[1].y + zSort[2].y + zSort[3].y) / 4, (zSort[0].z + zSort[1].z + zSort[2].z + zSort[3].z) / 4);
                    const yMax = new BABYLON.Vector3((ySort[7].x + ySort[6].x + ySort[5].x + ySort[4].x) / 4, (ySort[7].y + ySort[6].y + ySort[5].y + ySort[4].y) / 4, (ySort[7].z + ySort[6].z + ySort[5].z + ySort[4].z) / 4);
                    const yMin = new BABYLON.Vector3((ySort[0].x + ySort[1].x + ySort[2].x + ySort[3].x) / 4, (ySort[0].y + ySort[1].y + ySort[2].y + ySort[3].y) / 4, (ySort[0].z + ySort[1].z + ySort[2].z + ySort[3].z) / 4);
                    const xMax = new BABYLON.Vector3((xSort[7].x + xSort[6].x + xSort[5].x + xSort[4].x) / 4, (xSort[7].y + xSort[6].y + xSort[5].y + xSort[4].y) / 4, (xSort[7].z + xSort[6].z + xSort[5].z + xSort[4].z) / 4);
                    const xMin = new BABYLON.Vector3((xSort[0].x + xSort[1].x + xSort[2].x + xSort[3].x) / 4, (xSort[0].y + xSort[1].y + xSort[2].y + xSort[3].y) / 4, (xSort[0].z + xSort[1].z + xSort[2].z + xSort[3].z) / 4);

                    scene.clipPlane = BABYLON.Plane.FromPositionAndNormal(zMax.multiply(box.scaling).add(box.position), box.forward);
                    scene.clipPlane2 = BABYLON.Plane.FromPositionAndNormal(zMin.multiply(box.scaling).add(box.position), box.forward.multiply(new BABYLON.Vector3(-1, -1, -1)));
                    scene.clipPlane3 = BABYLON.Plane.FromPositionAndNormal(yMax.multiply(box.scaling).add(box.position), box.up);
                    scene.clipPlane4 = BABYLON.Plane.FromPositionAndNormal(yMin.multiply(box.scaling).add(box.position), box.up.multiply(new BABYLON.Vector3(-1, -1, -1)));
                    scene.clipPlane5 = BABYLON.Plane.FromPositionAndNormal(xMax.multiply(box.scaling).add(box.position), box.right);
                    scene.clipPlane6 = BABYLON.Plane.FromPositionAndNormal(xMin.multiply(box.scaling).add(box.position), box.right.multiply(new BABYLON.Vector3(-1, -1, -1)));
                });

                m.onAfterRenderObservable.add(() => {
                    scene.clipPlane = null;
                    scene.clipPlane2 = null;
                    scene.clipPlane3 = null;
                    scene.clipPlane4 = null;
                    scene.clipPlane5 = null;
                    scene.clipPlane6 = null;
                });
            });
        } else {
            meshes.forEach((m) => {
                if (!(m instanceof BABYLON.Mesh)) return;
                m.onBeforeRenderObservable.clear();
                m.onAfterRenderObservable.clear();
            })
        }
    }
}