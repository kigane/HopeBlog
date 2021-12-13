const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig({
    '/guide/': require("./guide"),
    '/blog/': require("./blog"),
    '/thesis/': require("./thesis"),
    '/note/algorithm/': require("./note/algorithm"),
    '/note/cs/': require("./note/cs"),
    '/note/cpp/': require("./note/cpp"),
    '/note/cv/': require("./note/cv"),
    '/note/js/': require("./note/js"),
    '/note/opengl/': require("./note/opengl"),
    '/': ['']
})