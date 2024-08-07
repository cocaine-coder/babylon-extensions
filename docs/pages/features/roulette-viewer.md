## 说明

这是一个控制`ArcRotateCamera`视图朝向的控件，UI 抄的 blender。

键盘输入 \` （esc 下面，tab 上面那个键）唤醒轮盘控件。再次点击 \` 或者点击esc 取消操作。

你会感到很别扭，因为这个轮盘上面缺了一角（右下角），我实在想不出要加入什么操作，你可以参照 api 参数自行填充该位置控件，如：飞入到所选择的位置，但是需要自己实现该功能。

## 示例

<RouletteViewer></RouletteViewer>

## 编码

```ts
const viewer = new RouletteViewer({
  camera: scene.activeCamera as BABYLON.ArcRotateCamera,
});

// 如果不想要了，请执行dispose方法
// viewer.dispose();
```

## 参数

`RouletteViewerOptions`  
| 参数         | 类型                      | 必填 | 默认值 | 说明       |
| ------------ | ------------------------- | ---- | ------ | ---------- |
| camera       | `BABYLON.ArcRotateCamera` | 是   |        | 圆弧相机   |
| style        | [object](#style)          | 否   |        | UI 样式    |
| customAction | [object](#customAction)   | 否   |        | 自定义操作 |
| lang         | [object](#lang)           | 否   |        | ui 语言    |

<span id="style">`RouletteViewerOptions.style`</span>
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| ------ | ------------------------- | ---- | ------ | -------- |
| hoverColor | `string` | 否 | `#545454` | 鼠标悬停颜色 |

<span id="customAction">`RouletteViewerOptions.customAction`</span>
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| ------ | ------------------------- | ---- | ------ | -------- |
| title | `string` | 是 | | 按钮文字 |
| action | `() => void` | 是 | | 按钮点击事件 |

<span id="lang">`RouletteViewerOptions.lang`</span>
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| ------ | ------------------------- | ---- | ------ | -------- |
| top | `string` | 是 | | 顶视图 |
| bottom | `string` | 是 | | 底视图 |
| left | `string` | 是 | | 左视图 |
| right | `string` | 是 | | 右视图 |
| front | `string` | 是 | | 前视图 |
| back | `string` | 是 | | 后视图 |
| all | `string` | 是 | | 所有 |

<script setup>
import RouletteViewer from '../../components/features/RouletteViewer.vue';
</script>
