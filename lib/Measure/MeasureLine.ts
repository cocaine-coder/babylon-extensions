import * as BABYLON from '@babylonjs/core';
import { AbstractMeasure } from "./AbstractMeasure";
import { Utils } from '../utils';
export interface MeasureLineOptions {
    scene: BABYLON.Scene;
}

export class MeasureLine extends AbstractMeasure {
    private pointerObserver: BABYLON.Observer<BABYLON.PointerInfo> | undefined;

    /**
     *
     */
    constructor(options: MeasureLineOptions) {
        super(options.scene);
    }

    onStart(): void {

        const points = new Array<BABYLON.Vector3>();

        function createLinesMesh() {
            const line = BABYLON.MeshBuilder.CreateLines("lines", {
                points: points,
                colors: [
                    new BABYLON.Color4(1, 0, 0, 1),
                    new BABYLON.Color4(1, 0, 0, 1),
                    new BABYLON.Color4(1, 0, 0, 1)
                ]
            });
            line.isPickable = false;
            line.renderingGroupId = 1;

            return line;
        }

        let timer: number | undefined;
        let isDrag = false;
        let drawing = false;

        let currentLine: BABYLON.LinesMesh | undefined;

        this.pointerObserver = this.scene.onPointerObservable.add((e, s) => {
            // 左键
            if(e.event.inputIndex !== 2 && e.event.inputIndex !== 12) {
                return;
            };

            if (e.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                timer = setTimeout(() => {
                    isDrag = true;
                }, 200);
            }
            else if (e.type === BABYLON.PointerEventTypes.POINTERUP) {
                if (timer) clearTimeout(timer);
                if (!isDrag && e.pickInfo && e.pickInfo.pickedPoint && e.pickInfo.pickedMesh && e.pickInfo.pickedMesh !== currentLine) {
                    const position = e.pickInfo.pickedPoint;
                    if (points.length === 2) {
                        points.pop();
                        drawing = false;
                    } else {
                        drawing = true;
                    }

                    points.push(position);
                    if (points.length === 2) {
                        currentLine = undefined;
                        if (currentLine) this.scene.removeMesh(currentLine);
                        const line = createLinesMesh();

                        const div = document.createElement('div');
                        div.innerText = BABYLON.Vector3.Distance(points[0], points[1]).toFixed(2) + " m";
                        Utils.createHtmlElementFollowCamera(this.scene, div, points[0].add(points[1]).scale(0.5));
                
                        points.length = 0;
                    }
                }

                isDrag = false;
            }
            else if (e.type === BABYLON.PointerEventTypes.POINTERMOVE && drawing) {
                const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                if (!pickInfo || !pickInfo.pickedPoint) return;

                if (points.length === 2) points.pop();
                points.push(pickInfo.pickedPoint);

                if (currentLine) this.scene.removeMesh(currentLine);
                currentLine = createLinesMesh();
            }
        });
    }

    onStop(): void {
        if (this.pointerObserver)
            this.scene.onPointerObservable.remove(this.pointerObserver);
    }
}