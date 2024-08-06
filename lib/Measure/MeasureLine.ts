import * as BABYLON from '@babylonjs/core';
import { AbstractMeasure } from "./AbstractMeasure";
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

        const linesMeshOptions = {
            points: new Array<BABYLON.Vector3>(),
            updatable: true,
            colors: [
                new BABYLON.Color4(1, 0, 0, 1),
                new BABYLON.Color4(1, 0, 0, 1),
                new BABYLON.Color4(1, 0, 0, 1)
            ]
        } as {
            id: string | undefined,
            points: BABYLON.Vector3[];
            updatable: boolean;
            instance?: BABYLON.LinesMesh;
            colors: BABYLON.Color4[];
        }

        let timer: number | undefined;
        let isDrag = false;

        this.pointerObserver = this.scene.onPointerObservable.add((e, s) => {
            // 左键
            if (e.event.inputIndex !== 2 && e.event.inputIndex !== 12) {
                return;
            };

            /**
             * 鼠标按下
             * 计时判断是否是拖拽行为
             */
            if (e.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                timer = setTimeout(() => {
                    isDrag = true;
                }, 200);
            }

            /**
             * 鼠标抬起
             * 1 清除拖拽判断计时
             * 
             * 2 make measure data
             * 
             * 3 重置isDrag状态
             */
            else if (e.type === BABYLON.PointerEventTypes.POINTERUP) {
                if (timer) clearTimeout(timer);

                if (!isDrag &&
                    e.pickInfo &&
                    e.pickInfo.pickedPoint &&
                    e.pickInfo.pickedMesh &&
                    e.pickInfo.pickedMesh !== linesMeshOptions.instance) {

                    const points = linesMeshOptions.points;
                    const position = e.pickInfo.pickedPoint;

                    // 结束本次测量，绘制测量数据
                    if (linesMeshOptions.points.length === 2) {
                        // 删除动态点
                        points.pop();
                        points.push(position);

                        const distance = BABYLON.Vector3.Distance(points[0], points[1]).toFixed(2) + " m";
                        this.followDomManager.get(linesMeshOptions.id!).forEach(x => {
                            x.wapper.innerText = distance;
                            x.setPosition(points[0].add(points[1]).scale(0.5));
                        });
                        this.meshes.push(linesMeshOptions.instance!);

                        linesMeshOptions.instance = undefined;
                        linesMeshOptions.id = undefined;
                        points.length = 0;
                    } else {
                        linesMeshOptions.id = BABYLON.GUID.RandomId();
                        this.followDomManager.set(linesMeshOptions.id, "", position);
                        points.push(position);
                    }
                }

                isDrag = false;
            }

            /**
             * 鼠标移动绘制动态线
             */
            else if (e.type === BABYLON.PointerEventTypes.POINTERMOVE && linesMeshOptions.id) {
                const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                if (!pickInfo || !pickInfo.pickedPoint) return;

                const points = linesMeshOptions.points;
                if (points.length === 2) points.pop();
                points.push(pickInfo.pickedPoint);

                linesMeshOptions.instance = BABYLON.MeshBuilder.CreateLines(linesMeshOptions.id, linesMeshOptions);
                linesMeshOptions.instance.isPickable = false;
                linesMeshOptions.instance.renderingGroupId = 1;

                const distance = BABYLON.Vector3.Distance(points[0], points[1]).toFixed(2) + " m";
                this.followDomManager.get(linesMeshOptions.id!).forEach(x => {
                    x.wapper.innerText = distance;
                    x.setPosition(points[0].add(points[1]).scale(0.5));
                });
            }
        });
    }

    onStop(): void {
        if (this.pointerObserver)
            this.scene.onPointerObservable.remove(this.pointerObserver);
    }
}