<template>
    <Measure :measure-creator="createMeasure"></Measure>
</template>

<script setup lang="ts">
import * as BABYLON from '@babylonjs/core';
import { MeasureLine, SceneClipperBox } from '../../../../lib';
import Measure from './Measure.vue';

function createMeasure(scene: BABYLON.Scene) {
    const sceneClipperBox = new SceneClipperBox({ scene })
    sceneClipperBox.setEnable(true);
    return new MeasureLine({ scene, clipPlanes: sceneClipperBox.clipPlanes });
}
</script>