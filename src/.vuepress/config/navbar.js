const { navbarConfig } = require("vuepress-theme-hope");

module.exports = navbarConfig([
    { text: 'Home', link: '/', icon: "home" },
    { text: "Target", link: "/home/", icon: "notice" },
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
    { text: 'Thesis', link: '/thesis/', icon: "article" },
])