<template>
    <BabylonScene :onload="onLoaded"></BabylonScene>
    <ClipperBoxParams v-if="clipper" :clipper="clipper"></ClipperBoxParams>
</template>

<script setup lang="ts">
import * as BABYLON from '@babylonjs/core';
import { ref, watch } from 'vue';
import BabylonScene from '../../base/BabylonScene.vue';
import { SceneClipperBox, RouletteViewer } from '../../../../lib';
import ClipperBoxParams from '../common/ClipperBoxParams.vue';

const clipper = ref<SceneClipperBox>();
function onLoaded(scene: BABYLON.Scene) {
    clipper.value = new SceneClipperBox({
        scene
    });
    // clipper.setEnable(true);

    new RouletteViewer({
        camera: scene.activeCamera as BABYLON.ArcRotateCamera,
    });
}


</script>

<style scoped></style>