const { config } = require("vuepress-theme-hope");

module.exports = config({
  title: "My Blog",
  description: "想，都是问题。做，才是答案。",

  dest: "./dist",

  head: [
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" },
    ],
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js",
      },
    ],
    ["script", { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js" }],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js" },
    ],
  ],

  locales: {
    "/": {
      lang: "en-US",
    }
  },

  themeConfig: {
    logo: "/link.png",
    hostname: "https://kigane.github.io/",

    author: "Leonhardt",
    repo: "https://github.com/kigane/HopeBlog",
    // 导航栏
    nav: [
      { text: 'Home', link: '/', icon: "home" },
      { text: "Project Home", link: "/home/", icon: "home" },
      { text: 'Guide', link: '/guide/', icon: "creative", },
      { text: 'Blog', link: '/blog/', icon: "blog" },
      {
        text: 'Note', icon: "note", prefix: "/note/",
        items: [
          { text: 'Algorithm', link: 'algorithm/' },
          { text: 'Computer Science', link: 'cs/' },
          { text: 'Computer Vision', link: 'cv/' },
          { text: 'C/C++', link: 'cpp/' },
          { text: 'OpenGL', link: 'opengl/' },
          { text: 'JavaScript', link: 'js/' },
        ]
      },
      { text: 'Hazel', link: '/hazel/' },
    ],
    // 侧边栏
    // displayAllHeaders: true, // Default: false
    sidebar: {
      '/guide/': [
        '',
        'configuration',
        "page",
        "markdown",
        "disable",
        "encrypt",
      ],
      '/blog/': [
        '',
        'katex-cheatsheet',
        'game-engine-overview',
        'python',
      ],
      '/note/cs/': [
        '',
        'isa-i386',
        'isa-riscv',
        'gdb-cheatsheet',
        'shell-cheatsheet',
        'vim',
        'git',
        'regex',
        'linux',
        'ECF',
        'VM',
      ],
      '/note/cpp/': [
        '',
        'c',
        'cpp-random',
        'file-io',
        'macro',
      ],
      '/note/algorithm/': [
        '',
      ],
      '/note/cv/': [
        '',
      ],
      '/note/opengl/': [
        '',
        'gl-framebuffer',
        'software-renderer',
        'eigen',
        'opencv',
      ],
      '/hazel/': [
        '',
      ],
      '/note/js/': [
        '',
        'js-base',
        'js-object',
        'js-bom-dom',
        'vue',
        'css-basic',
        'css-layout',
        'css-modular',
        'css-advance',
        'css-sass',
        'css-tricks',
      ],
      '/': [''],
    },
    editLinks:false, // 编辑此页链接
    blog: {
      intro: "/intro/",
      sidebarDisplay: "mobile",
      links: {
        Zhihu: "https://zhihu.com",
        Baidu: "https://baidu.com",
        Github: "https://github.com",
      },
    },

    footer: {
      display: true,
      content: "Less interests, more interest.",
    },

    // comment: {
    //   type: "waline",
    //   serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    // },

    copyright: {
      status: "global",
    },

    git: {
      timezone: "Asia/Shanghai",
    },

    mdEnhance: {
      sub: true, 
      sup: true, // 角标
      footnote: true, // 脚注
      tex: true,
      flowchart: true,
      demo: true,
      presentation: {
        plugins: [
          "highlight",
          "math",
          "search",
          "notes",
          "zoom",
          "anything",
          "audio",
          "chalkboard",
        ],
      },
    },

    pwa: {
      favicon: "/favicon.ico",
      cachePic: true,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      msTile: {
        image: "/assets/icon/ms-icon-144.png",
        color: "#ffffff",
      },
      manifest: {
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-mask-192.png",
            sizes: "192x192",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Guide",
            short_name: "Guide",
            url: "/guide/",
            icons: [
              {
                src: "/assets/icon/guide-maskable.png",
                sizes: "192x192",
                purpose: "maskable",
                type: "image/png",
              },
              {
                src: "/assets/icon/guide-monochrome.png",
                sizes: "192x192",
                purpose: "monochrome",
                type: "image/png",
              },
            ],
          },
        ],
      },
    },
  },
});
