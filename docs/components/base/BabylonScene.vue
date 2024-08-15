<template>
    <canvas id="babylon-container"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader } from "@babylonjs/loaders";
import { Utils } from '../../../lib';

// @ts-ignore
import url_monkey from "../../public/monkey.glb?url";

const props = defineProps<{
    onload(scene: BABYLON.Scene): void
}>();

let engine: BABYLON.Engine;

function onWindowResize() {
    engine.resize();
}

onMounted(() => {
    document.getElementById("babylon-container")?.addEventListener('mouseenter', e => {
        document.body.style.overflow = 'hidden';
    });

    document.getElementById("babylon-container")?.addEventListener('mouseout', e => {
        document.body.style.overflow = 'auto';
    });

    BABYLON.SceneLoader.RegisterPlugin(new GLTFFileLoader());
    engine = new BABYLON.Engine(document.getElementById("babylon-container")! as HTMLCanvasElement, true, {
        adaptToDeviceRatio: true,
        useHighPrecisionMatrix: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
        antialias: true,
        forceSRGBBufferSupportState: true
    }, true);

    const scene = new BABYLON.Scene(engine);

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', onWindowResize);
    scene.createDefaultCameraOrLight(true);
    const camera = scene.activeCamera as BABYLON.ArcRotateCamera;
    camera.attachControl(engine.getRenderingCanvas(), true);

    BABYLON.SceneLoader.LoadAssetContainerAsync("", new URL(url_monkey, import.meta.url).href, scene).then(c => {
        c.addAllToScene();
        c.createRootMesh().clone().position.y += 3;

        const { worldSize, worldCenter } = Utils.getMeshesExtendsInfo(scene);

        const radius = worldSize.length() * 1.5;
        camera.target = worldCenter;
        camera.radius = radius;
        camera.alpha = Math.PI / 4;
        camera.beta = Math.PI / 3;
        camera.minZ = radius * 0.01;
        camera.maxZ = radius * 1000;

        camera.lowerRadiusLimit = camera.radius * 0.01;
        camera.upperRadiusLimit = camera.radius * 1;

        props.onload(scene);
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize);
    engine.dispose();
})
</script>

<style scoped>
#babylon-container {
    width: 100%;
    height: 100%;
}

#babylon-container:focus-visible {
    outline: none !important;
}
</style>