<template>
    <BabylonScene :onload="onLoaded"></BabylonScene>
    <div class="params">
        <div>
            <div>开/关</div>
            <input type="checkbox" v-model="enable">
        </div>

        <div>
            <div>gizmo</div>
            <input type="checkbox" v-model="gizmo">
        </div>

        <div style="flex:1;">
            <div style="width: 60px;">透明度</div>
            <input type="range" v-model="opacity" :min="0" :max="1" :step="0.1">
        </div>

        <div>
            <button style="border: 2px solid #a8b1ff; padding: 0 4px;" @click="clipper.reset()">重置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as BABYLON from '@babylonjs/core';
import { ref, watch } from 'vue';
import BabylonScene from '../../base/BabylonScene.vue';
import { SceneClipperBox } from '../../../../lib';

const enable = ref(true);
const gizmo = ref(true);
const opacity = ref(0.2);
let clipper: SceneClipperBox;

watch(enable, a => {
    clipper.setEnable(a);
});

watch(gizmo, a => {
    clipper.setGizmoMeshVisibility(a);
});

watch(opacity, a => {
    clipper.setAuxiliaryMeshOpacity(a);
})

function onLoaded(scene: BABYLON.Scene) {
    clipper = new SceneClipperBox(scene);
    clipper.setEnable(true);
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