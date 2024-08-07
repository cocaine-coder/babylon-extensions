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
</template>

<script setup lang="ts">
import { ref , watch } from 'vue';
import { IMeasure } from '../../../../lib';
import BabylonScene from '../../base/BabylonScene.vue';
import * as BABYLON from '@babylonjs/core';

const enable = ref(true);
const props = defineProps<{
    measureCreator: (scene:BABYLON.Scene)=> IMeasure
}>();

let measure : IMeasure;

watch(enable,a=>{
    if(a){
        measure.start();
    }else{
        measure.stop();
    }
});

function onLoad(scene: BABYLON.Scene){
    measure = props.measureCreator(scene);
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