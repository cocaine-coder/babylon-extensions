## 说明

使用一个长方体（六个面）对模型进行切割，可以使用 gizmo 对长方体缩放或旋转以达到你的观察需求。

## 示例

<ClipperBox></ClipperBox>

## 编码

```ts
const clipper = new SceneClipperBox({ scene });
clipper.setEnable(true);

// 设置是否显示gizmo
clipper.setGizmoMeshVisibility(false);

// 设置辅助mesh(长方体) 不透明度
clipper.setAuxiliaryMeshOpacity(0.5);

// 恢复切割状态
clipper.reset();

// 销毁
clipper.dispose();
```

## 参数

`SceneClipperBoxOptions`  
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| ------------ | ------------------------- | ---- | ------ | ---------- |
| scene | `BABYLON.Scene` | 是 | | 场景 |
| filter | `(mesh: BABYLON.AbstractMesh) => boolean` | 否 | | 过滤器 |

<script setup>
import ClipperBox from '../../../components/features/clipper/ClipperBox.vue';
</script>
