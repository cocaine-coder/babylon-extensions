import { readFileSync, writeFileSync } from 'fs';
import { UserConfig, DefaultTheme, Plugin } from 'vitepress';

function serialize(obj, name) {
    var result = "";
    function serializeInternal(o, path) {
        for (const p in o) {
            var value = o[p];
            if (typeof value != "object") {
                if (typeof value == "string") {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "] = " + "\"" + value.replace(/\"/g, "\\\"") + "\"" + ";";
                } else {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "] = " + value + ";";
                }
            }
            else {
                if (Array.isArray(value)) {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]" + "=" + "new Array();";
                    serializeInternal(value, path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]");
                } else {
                    result += "\n" + path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]" + "=" + "new Object();";
                    serializeInternal(value, path + "[" + (isNaN(p as any) ? "\"" + p + "\"" : p) + "]");
                }
            }
        }
    }
    serializeInternal(obj, name);
    return result;
}

const FilterDataJSPlugin = {
    apply: (c, e) => {
        c.plugins?.forEach((p: any) => {
            if (p["name"] === "vitepress:data") {
                const orgLoad = p.load;
                p.load = async (id: string) => {
                    if (id.endsWith("KHR_animation_pointer.data.js"))
                        return;

                    await orgLoad(id);
                }
            }
        });
    }
} as Plugin;

export default {
    title: 'babylonjs-toolkits',
    description: 'babylonjs 小工具',
    appearance: 'dark',
    base: '/babylonjs-toolkits/',
    head: [
        [
            'link', { rel: 'icon', href: '/logo.svg' }
        ]
    ],
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        logo: '/logo.svg',
        sidebar: [
            {
                text: '介绍',
                collapsed: false,
                items: [
                    { text: 'toolkits', link: '/pages/' },
                    { text: '安装', link: '/pages/install' },
                    { text: '反馈', link: '/pages/feedback' }
                ]
            },
            {
                text: '功能',
                collapsed: true,
                base: "/pages/features/",
                items: [
                    {
                        text: "视图转盘",
                        link: "roulette-viewer"
                    },
                    {
                        text: "切割",
                        items: [
                            { text: "盒子切割", link: 'clipper/box' }
                        ]
                    }, {
                        text: "测量",
                        items: [
                            { text: "点", link: 'measure/point' },
                            { text: "长度", link: 'measure/length' }
                        ]
                    }, {
                        text: "捕捉",
                        link: "snap"
                    }
                ]
            }
        ],
        socialLinks: [{ icon: 'github', link: "https://github.com/cocaine-coder/babylonjs-toolkits" }],
    },
    vite: {
        'plugins': [FilterDataJSPlugin]
    }
} as UserConfig<DefaultTheme.Config>