## 说明

点测量。点击 scene 中的 mesh，绘制测量结果。默认绘制标高。

## 示例

<MeasurePoint></MeasurePoint>

## 编码

```ts
const measure = new MeasurePoint({ scene });
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
| format | `(position: BABYLON.Vector3) => string` | 否 |`(position:BABYLON.Vector3) => position.y.toFixed(2) + "m" ` | 测量数据格式化 |
| style | [object](#style) | 否 | | 测量样式 |

`MeasurePointOptions.style`
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| ------------ | ------------------------- | ---- | ------ | ---------- |
| color | `string` | 否 | white | 文字颜色 |
| size | `number` | 否 | 14 | 文字大小 |
| iconColor | `string` | 否 | red | 图标颜色 |

<script setup>
import MeasurePoint from '../../../components/features/measure/MeasurePoint.vue';
</script>
