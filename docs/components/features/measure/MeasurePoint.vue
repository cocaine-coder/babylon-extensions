<template>
    <BabylonScene :onload="onLoad"></BabylonScene>
</template>

<script setup lang="ts">
import { MeasurePoint } from '../../../../lib';
import BabylonScene from '../../base/BabylonScene.vue';
import * as BABYLON from '@babylonjs/core';

function onLoad(scene: BABYLON.Scene){
    const measure = new MeasurePoint({scene});
    measure.start();
}
</script>