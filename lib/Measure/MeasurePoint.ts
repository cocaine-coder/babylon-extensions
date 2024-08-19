import * as BABYLON from '@babylonjs/core';
import { AbstractMeasure } from "./AbstractMeasure";
import { Utils } from '../utils';
import { Snap } from '../Snap';

export interface MeasurePointOptions {
    scene: BABYLON.Scene;
    style?: {
        color?: string;
        size?: number;
        iconColor?: string;
    }

    format?: (position: BABYLON.Vector3) => string;
    clipPlanes?: BABYLON.Plane[];
    snap?: Snap;
    operationDomEnable?: boolean;
}

export class MeasurePoint extends AbstractMeasure {
    private pointerObserver: BABYLON.Observer<BABYLON.PointerInfo> | undefined;

    /**
     *
     */
    constructor(private options: MeasurePointOptions) {
        super(options.scene, options.snap);

        options.style ??= {};
        options.style.color ??= "white";
        options.style.size ??= 14;
        options.style.iconColor ??= "red";
        options.format ??= (position: BABYLON.Vector3) => position.y.toFixed(2) + "m";
    }

    protected onStart(): void {
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

                const pickInfo = Utils.pickSceneWithClipPlanes(this.scene, this.options.clipPlanes);

                if (!isDrag &&
                    pickInfo &&
                    pickInfo.pickedPoint &&
                    pickInfo.pickedMesh) {

                    const position = this.snap?.snapPoint ? this.snap.snapPoint : pickInfo.pickedPoint;

                    const div = document.createElement('div');
                    div.innerHTML = `
                    <div style="color:${this.options.style?.color}">${this.options.format!(position)}</div>
                    <svg fill="${this.options.style?.iconColor}" viewBox="0 0 2816 1024" width="32" height="13">
                        <path d="M256 0h2560v128H1177.856L631.552 947.328 0 0h256z m-16.768 128l392.32 588.672L1024 128H239.232z">
                        </path>
                    </svg>
                    `

                    const el = this.followDomManager.set(BABYLON.GUID.RandomId(), div, position);
                    el.wapper.style.transform = "translate(-7px, -100%)";
                    el.wapper.style.fontSize = this.options.style!.size! + "px";

                    if (this.options.operationDomEnable) {
                        el.wapper.style.cursor = 'pointer';
                        this.createMeasureOperationDom(el, {
                            removeCallback: () => {
                                el.dispose();
                            }
                        });
                    } else {
                        el.wapper.style.pointerEvents = 'none'
                    }
                }

                isDrag = false;
            }
        });
    }
    protected onStop(): void {
        if (this.pointerObserver)
            this.scene.onPointerObservable.remove(this.pointerObserver);
    }
}