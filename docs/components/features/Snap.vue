<template>
    <BabylonScene :onload="onload"></BabylonScene>
</template>
<script setup lang="ts">
import * as BABYLON from '@babylonjs/core';
import BabylonScene from '../base/BabylonScene.vue';
import { Snap } from '../../../lib';

function onload(scene: BABYLON.Scene) {
    // BABYLON.MeshBuilder.CreateBox("", { size: 3 })
    new Snap({ scene, tolerance: 12 }).start();
}
</script>