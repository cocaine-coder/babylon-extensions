import * as BABYLON from "@babylonjs/core";
export namespace Utils {
    export function getMeshesExtendsInfo(scene: BABYLON.Scene, filter?: (mesh: BABYLON.AbstractMesh) => boolean) {
        const worldExtends = scene.getWorldExtends(filter);
        const worldSize = worldExtends.max.subtract(worldExtends.min);
        const worldCenter = worldExtends.min.add(worldSize.scale(0.5));

        return { worldExtends, worldCenter, worldSize };
    }

    export function zoomArcRotateCameraToAll(camera: BABYLON.ArcRotateCamera, options: {
        alpha?: number,
        beta?: number,
        duration?: number
    }) {
        const duration = options.duration ?? 200;
        const scene = camera.getScene();
        const { worldCenter, worldSize } = getMeshesExtendsInfo(scene);
        const radius = worldSize.length() * 1.5;
        const target = worldCenter;

        camera.minZ = radius * 0.01;
        camera.maxZ = radius * 1000;
        camera.lowerRadiusLimit = radius * 0.01;
        camera.upperRadiusLimit = radius * 1;

        if (options.alpha !== undefined) {
            const animatable = BABYLON.Animation.CreateAndStartAnimation("camera-fly-to-world-alpha", camera, 'alpha', 60, 60 * duration / 1000, camera.alpha, options.alpha, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, undefined, undefined, scene);
            animatable!.disposeOnEnd = true;
        }
        if (options.beta !== undefined) {
            const animatable = BABYLON.Animation.CreateAndStartAnimation("camera-fly-to-world-beta", camera, 'beta', 60, 60 * duration / 1000, camera.beta, options.beta, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, undefined, undefined, scene);
            animatable!.disposeOnEnd = true;
        }

        const animatable1 = BABYLON.Animation.CreateAndStartAnimation("camera-fly-to-world-target", camera, 'target', 60, 60 * duration / 1000, camera.target, target, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, undefined, undefined, scene);
        animatable1!.disposeOnEnd = true;

        const animatable2 = BABYLON.Animation.CreateAndStartAnimation("camera-fly-to-world-radius", camera, 'radius', 60, 60 * duration / 1000, camera.radius, radius, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, undefined, undefined, scene);
        animatable2!.disposeOnEnd = true;
    }

    export function pickSceneWithClipPlanes(scene: BABYLON.Scene , otherPlanes ?: BABYLON.Plane[]) {
        const clipPlanes = [scene.clipPlane,
        scene.clipPlane2,
        scene.clipPlane3,
        scene.clipPlane4,
        scene.clipPlane5,
        scene.clipPlane6].filter(x => x !== undefined && x !== null);
        if(otherPlanes) clipPlanes.push(...otherPlanes);

        let world: BABYLON.Matrix;

        return scene.pick(scene.pointerX, scene.pointerY,
            (mesh) => {
                if (mesh.isPickable) {
                    world = mesh.computeWorldMatrix();
                }
                return mesh.isPickable;
            },
             undefined,
             undefined,
            
             // TRIANGLE PREDICATE
            (p0, p1, p2, ray, i0, i1, i2) => {

                // fully transparent

                if (i0 < 0.00001)

                    return false;
                    
                if (clipPlanes.length == 0)
                    return true;

                var intersectInfo = ray.intersectsTriangle(p0, p1, p2);

                if (!intersectInfo)

                    return false;

                // Get picked point

                const worldOrigin = new BABYLON.Vector3();
                const direction = new BABYLON.Vector3();

                BABYLON.Vector3.TransformCoordinatesToRef(ray.origin, world, worldOrigin);

                ray.direction.scaleToRef(intersectInfo.distance, direction);

                const worldDirection = BABYLON.Vector3.TransformNormal(direction, world);

                const pickedPoint = worldDirection.addInPlace(worldOrigin);

                for (var plane of clipPlanes) {
                    if (plane.signedDistanceTo(pickedPoint) > 0)
                        return false;
                }

                return true;
            }
        )
    }

    export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: {
        id?: string;
        class?: string | string[];
        style?: Partial<CSSStyleDeclaration>,
        onCreate?: (el: HTMLElementTagNameMap[K]) => void;
        children?: HTMLElement[]
    }): HTMLElementTagNameMap[K] {
        const el = document.createElement(tagName);

        if (!options) return el

        if (options.id) {
            el.id = options.id;
        }

        if (options.class) {
            if (typeof options.class === 'string')
                el.className = options.class;
            else
                el.classList.add(...options.class)
        }

        if (options.style) {
            for (const key in options.style) {
                const value = options.style[key];
                if (value)
                    (el.style as any)[key] = value;
            }
        }

        if (options.children) {
            options.children.forEach(child => el.append(child));
        }

        options?.onCreate?.(el);

        return el;
    }
}