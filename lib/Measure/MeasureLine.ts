import { Scene, Color4, Plane, Observer, PointerInfo, Vector3, LinesMesh, PointerEventTypes, MeshBuilder, GUID } from "@babylonjs/core";

import { AbstractMeasure } from "./AbstractMeasure";
import { Utils } from '../utils';
import { Snap } from '../Snap';

export interface MeasureLineOptions {
    scene: Scene;
    style?: {
        color?: string;
        size?: number;
        lineColor?: Color4;
    };

    format?: (length: number) => string;
    clipPlanes?: Plane[];
    snap?: Snap;
    operationDomEnable?: boolean;
}

export class MeasureLine extends AbstractMeasure {
    private pointerObserver: Observer<PointerInfo> | undefined;


    /**
     *
     */
    constructor(private options: MeasureLineOptions) {
        super(options.scene, options.snap);

        options.style ??= {};
        options.style.color ??= "white";
        options.style.size ??= 14;
        options.style.lineColor ??= new Color4(1, 0, 0, 1);
        options.format ??= (length: number) => length.toFixed(2) + "m";
    }

    protected onStart(): void {
        const linesMeshOptions = {
            points: new Array<Vector3>(),
            updatable: true,
            colors: [
                this.options.style!.lineColor!,
                this.options.style!.lineColor!,
            ]
        } as {
            id: string | undefined,
            points: Vector3[];
            updatable: boolean;
            instance?: LinesMesh;
            colors: Color4[];
        }

        let timer: number | undefined;
        let isDrag = false;

        const escKeyDownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if(!linesMeshOptions.id) return;

                linesMeshOptions.points.length = 0;
                if(linesMeshOptions.instance){
                    this.scene.removeMesh(linesMeshOptions.instance)
                    linesMeshOptions.instance = undefined;
                }
                
                const el = this.followDomManager.get(linesMeshOptions.id)[0];
                el.dispose();

                document.removeEventListener('keydown', escKeyDownHandler);
            }
        }

        this.pointerObserver = this.scene.onPointerObservable.add((e, s) => {
            // 左键
            if (e.event.inputIndex !== 2 && e.event.inputIndex !== 12) {
                return;
            };

            /**
             * 鼠标按下
             * 计时判断是否是拖拽行为
             */
            if (e.type === PointerEventTypes.POINTERDOWN) {
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
            else if (e.type === PointerEventTypes.POINTERUP) {
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }

                const pickInfo = Utils.pickSceneWithClipPlanes(this.scene, this.options.clipPlanes);

                if (!isDrag &&
                    e.pickInfo &&
                    pickInfo.pickedPoint &&
                    pickInfo.pickedMesh) {

                    const points = linesMeshOptions.points;
                    const position = this.snap?.snapPoint ? this.snap?.snapPoint : pickInfo.pickedPoint;

                    // 结束本次测量，绘制测量数据
                    if (linesMeshOptions.points.length === 2) {
                        // 删除动态点
                        points.pop();
                        points.push(position);

                        linesMeshOptions.instance = MeshBuilder.CreateLines(linesMeshOptions.id!, linesMeshOptions);
                        linesMeshOptions.instance.isPickable = false;
                        linesMeshOptions.instance.renderingGroupId = 1;

                        const distance = Vector3.Distance(points[0], points[1]);
                        this.followDomManager.get(linesMeshOptions.id!).forEach(x => {
                            x.wapper.innerText = this.options.format!(distance);
                            x.setPosition(points[0].add(points[1]).scale(0.5));

                            if (this.options.operationDomEnable) {
                                x.wapper.style.pointerEvents = 'visible';
                                x.wapper.style.cursor = 'pointer';
                                this.createMeasureOperationDom(x, {
                                    removeCallback: () => {
                                        x.dispose();
                                        this.meshes.forEach(m => {
                                            if (m.name === x.id) {
                                                this.scene.removeMesh(m);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        this.meshes.push(linesMeshOptions.instance!);

                        linesMeshOptions.instance = undefined;
                        linesMeshOptions.id = undefined;
                        points.length = 0;
                    } else {
                        linesMeshOptions.id = GUID.RandomId();
                        const el = this.followDomManager.set(linesMeshOptions.id, "", position);
                        el.wapper.style.pointerEvents = 'none';
                        el.wapper.style.fontSize = this.options.style!.size! + "px";
                        el.wapper.style.backgroundColor = "rgba(31,31,31,0.3)";
                        el.wapper.style.paddingInline = "4px";
                        el.wapper.style.color = 'white';
                        points.push(position);

                        document.addEventListener('keydown', escKeyDownHandler);
                    }
                }

                isDrag = false;
            }

            /**
             * 鼠标移动绘制动态线
             */
            else if (e.type === PointerEventTypes.POINTERMOVE && linesMeshOptions.id) {
                let point = this.snap?.snapPoint;
                if (!point) {
                    const pickInfo = Utils.pickSceneWithClipPlanes(this.scene, this.options.clipPlanes);
                    if (!pickInfo || !pickInfo.pickedPoint) return;

                    point = pickInfo.pickedPoint;
                }

                const points = linesMeshOptions.points;
                if (points.length === 2) points.pop();
                points.push(point);

                // 防止按下esc键后继续执行mousemove
                if(points.length !== 2) {
                    points.length = 0; 
                    return;
                }

                linesMeshOptions.instance = MeshBuilder.CreateLines(linesMeshOptions.id, linesMeshOptions);
                linesMeshOptions.instance.isPickable = false;
                linesMeshOptions.instance.renderingGroupId = 1;

                const distance = Vector3.Distance(points[0], points[1]);
                this.followDomManager.get(linesMeshOptions.id!).forEach(x => {
                    x.wapper.innerText = this.options.format!(distance);
                    x.setPosition(points[0].add(points[1]).scale(0.5));
                });
            }
        });
    }

    protected onStop(): void {
        if (this.pointerObserver)
            this.scene.onPointerObservable.remove(this.pointerObserver);
    }
}