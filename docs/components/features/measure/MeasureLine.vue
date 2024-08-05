<template>
    <BabylonScene :onload="onLoad"></BabylonScene>
</template>

<script setup lang="ts">
import { MeasureLine } from '../../../../lib';
import BabylonScene from '../../base/BabylonScene.vue';
import * as BABYLON from '@babylonjs/core';

function onLoad(scene: BABYLON.Scene){
    const measureLine = new MeasureLine({scene});
    measureLine.start();
}
</script>