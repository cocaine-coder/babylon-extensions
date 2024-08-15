<template>
    <BabylonScene :onload="onLoad"></BabylonScene>
    <div class="params">
        <div>
            <div>开/关</div>
            <input type="checkbox" v-model="enable">
        </div>

        <div>
            <button style="border: 2px solid #a8b1ff; padding: 0 4px;" @click="measure.clear()">清空</button>
        </div>
    </div>

    <ClipperBoxParams v-if="clipper" :clipper="clipper"></ClipperBoxParams>

    <div class="params">
        <div>
            <label>允许捕捉</label>
            <input type="checkbox" v-model="allowSnap">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IMeasure, SceneClipperBox, Snap } from '../../../../lib';
import BabylonScene from '../../base/BabylonScene.vue';
import ClipperBoxParams from '../common/ClipperBoxParams.vue';
import * as BABYLON from '@babylonjs/core';

const props = defineProps<{
    measureCreator: (scene: BABYLON.Scene, clipper: SceneClipperBox, snap: Snap) => IMeasure,
}>();

const enable = ref(true);
const clipper = ref<SceneClipperBox>();
const allowSnap = ref(false);

let measure: IMeasure;
let snap: Snap;

watch(enable, a => {
    if (a) {
        measure.start();
    } else {
        measure.stop();
    }
});

watch(allowSnap, a => {
    a ? snap.start() : snap.stop();
});

function onLoad(scene: BABYLON.Scene) {
    clipper.value = new SceneClipperBox({
        scene,
    });
    snap = new Snap({
        scene,
        clipPlanes: clipper.value.clipPlanes
    });
    measure = props.measureCreator(scene, clipper.value, snap);
    measure.start();
}
</script>

<style scoped>
.params {
    margin-top: 16px;
    display: flex;
    column-gap: 24px;
    width: 100%;
}

.params>div {
    display: flex;
    align-items: center;
    column-gap: 6px;
}
</style>