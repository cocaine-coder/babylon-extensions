import * as BABYLON from '@babylonjs/core';
import { AbstractMeasure } from "./AbstractMeasure";

export interface MeasurePointOptions {
    scene: BABYLON.Scene;
    style?: {
        color?: string;
        iconColor?: string;
    }

    format?: (position: BABYLON.Vector3) => string;
}

export class MeasurePoint extends AbstractMeasure {
    private pointerObserver: BABYLON.Observer<BABYLON.PointerInfo> | undefined;

    /**
     *
     */
    constructor(private options: MeasurePointOptions) {
        super(options.scene);

        options.style ??= {};
        options.style.color ??= "white";
        options.style.iconColor ??= "red";
        options.format ??= (position:BABYLON.Vector3) => position.y.toFixed(2) + "m";
    }

    onStart(): void {
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
                    e.pickInfo.pickedMesh) {

                    const position = e.pickInfo.pickedPoint;

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
                }

                isDrag = false;
            }
        });
    }
    onStop(): void {
        if (this.pointerObserver)
            this.scene.onPointerObservable.remove(this.pointerObserver);
    }
}