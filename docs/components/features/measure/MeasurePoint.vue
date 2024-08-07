<template>
    <Measure :measure-creator="scene => new MeasurePoint({ scene })"></Measure>
</template>

<script setup lang="ts">
import { MeasurePoint } from '../../../../lib';
import Measure from './Measure.vue';
</script>