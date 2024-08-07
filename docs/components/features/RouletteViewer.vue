<template>
    <BabylonScene :onload="onload"></BabylonScene>
</template>
<script setup lang="ts">
import * as BABYLON from '@babylonjs/core';
import BabylonScene from '../base/BabylonScene.vue';
import { RouletteViewer } from '../../../lib';

function onload(scene: BABYLON.Scene){
    new RouletteViewer({
        camera : scene.activeCamera as BABYLON.ArcRotateCamera,
    });
}
</script>