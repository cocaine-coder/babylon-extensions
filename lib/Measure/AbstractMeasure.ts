import * as BABYLON from "@babylonjs/core";
import { FollowCameraDomElement, FollowDomManager } from "../DomManager";
import { Snap } from "../Snap";
import { Utils } from "../utils";

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
    protected followDomManager: FollowDomManager;

    /**
     *
     */
    constructor(protected scene: BABYLON.Scene, protected snap?: Snap) {
        this.followDomManager = new FollowDomManager(scene);
    }

    protected abstract onStart(): void;
    protected abstract onStop(): void;

    start() {
        if (!this._started) {
            this.onStart();
        }

        this._started = true;
    }

    stop(): void {
        if (this._started) {
            this.onStop();
        }

        this._started = false;
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
        this.followDomManager.setVisible(value);
    }

    setSnap(snap: Snap | false) {
        this.snap = snap || undefined;
    }

    dispose() {
        this.stop();
        this.clear();
    }

    protected createMeasureOperationDom(el: FollowCameraDomElement, options: {
        removeCallback(): void
    }) {
        el.wapper.innerHTML += `<style> 
        .measure-opration-active > .measure-opration{
            opacity : 1 !important;
            pointer-events : auto !important;
        }
    
        .measure-opration-btn:hover{
        }
        </style>`
    
        el.wapper.addEventListener('click', () => {
            el.wapper.classList.toggle("measure-opration-active");
        });
    
        function createOperationBtn(dom: HTMLElement | string, callback: (() => void) | undefined) {
            if (!callback) return "";
    
            return Utils.createElement('div', {
                class: "measure-opration-btn",
                style: {
                    borderRadius: "50%",
                    background: "#5d5d6b",
                    padding: '4px'
                },
                children: [dom],
                onCreate: e => {
                    e.addEventListener('click', callback);
                }
            })
        }
    
        const dom = Utils.createElement('div', {
            class: "measure-opration",
            style: {
                display: "flex",
                position: "absolute",
                top: "50%",
                right: "-4px",
                transform: "translate(100%, -50%)",
                opacity: "0",
                transition: "opacity 0.3s",
                pointerEvents: 'none'
            },
            children: [
                createOperationBtn(`<svg viewBox="0 0 1024 1024" width="18" height="18">
                    <path fill="#ddd" d="M880 240H704v-64c0-52.8-43.2-96-96-96H416c-52.8 0-96 43.2-96 96v64H144c-17.6 0-32 14.4-32 32s14.4 32 32 32h48v512c0 70.4 57.6 128 128 128h384c70.4 0 128-57.6 128-128V304h48c17.6 0 32-14.4 32-32s-14.4-32-32-32z m-496-64c0-17.6 14.4-32 32-32h192c17.6 0 32 14.4 32 32v64H384v-64z m384 640c0 35.2-28.8 64-64 64H320c-35.2 0-64-28.8-64-64V304h512v512z"></path>
                    <path fill="#ddd" d="M416 432c-17.6 0-32 14.4-32 32v256c0 17.6 14.4 32 32 32s32-14.4 32-32V464c0-17.6-14.4-32-32-32z m192 0c-17.6 0-32 14.4-32 32v256c0 17.6 14.4 32 32 32s32-14.4 32-32V464c0-17.6-14.4-32-32-32z">
                    </path>
                </svg>`, options.removeCallback),
            ],
        });
    
        el.wapper.append(dom);
    }
}