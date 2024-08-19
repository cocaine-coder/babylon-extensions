<template>
    <Measure :measure-creator="createMeasure"></Measure>
</template>

<script setup lang="ts">
import * as BABYLON from '@babylonjs/core';
import { MeasureLine, SceneClipperBox, Snap } from '../../../../lib';
import Measure from './Measure.vue';

function createMeasure(scene: BABYLON.Scene, clipper: SceneClipperBox, snap: Snap) {
    return new MeasureLine({
        scene,
        clipPlanes: clipper.clipPlanes,
        snap,
        operationDomEnable : true
    });
}
</script>