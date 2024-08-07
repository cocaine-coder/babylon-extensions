<template>
    <Measure :measure-creator="scene => new MeasureLine({ scene })"></Measure>
</template>

<script setup lang="ts">
import { MeasureLine } from '../../../../lib';
import Measure from './Measure.vue';
</script>