## 说明

线测量。点击 scene 中的 mesh，绘制测量结果。默认绘制长度。

## 示例
<MeasureLine></MeasureLine>

## 编码

```ts
const measure = new MeasureLine({ scene });
measure.start();

// 停止测量
measure.stop();

// 隐藏测量数据
measure.setVisible(false);

// 清除测量
measure.clear();

// 销毁测量
measure.dispose();
```

## 参数

`MeasurePointOptions`  
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| ------------ | ------------------------- | ---- | ------ | ---------- |
| scene | `BABYLON.Scene` | 是 | | 场景 |
| format | `(length: number) => string` | 否 |` (length: number) => length.toFixed(2) + "m" ` | 测量数据格式化 |
| style | [object](#style) | 否 | | 测量样式 |

`MeasurePointOptions.style`
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| ------------ | ------------------------- | ---- | ------ | ---------- |
| color | `string` | 否 | white | 文字颜色 |
| size | `number` | 否 | 14 | 文字大小 |
| lineColor | `string` | 否 | red | 线颜色 |

<script setup>
import MeasureLine from '../../../components/features/measure/MeasureLine.vue';
</script>