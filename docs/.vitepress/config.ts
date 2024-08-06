import { UserConfig, DefaultTheme } from 'vitepress';

export default {
    title: 'babylon-toolkits',
    description: 'babylonjs 小工具',
    appearance: 'dark',
    base: '/babylon-toolkits/',
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
                        text: "切割",
                        items: [
                            { text: "盒子切割", link: 'clipper/box' }
                        ]
                    }, {
                        text: "测量",
                        items: [
                            { text: "高度", link: 'measure/elevation' },
                            { text: "长度", link: 'measure/length' }
                        ]
                    }
                ]
            }
        ],
        socialLinks: [{ icon: 'github', link: "https://github.com/cocaine-coder/babylon-toolkits" }],
    }
} as UserConfig<DefaultTheme.Config>