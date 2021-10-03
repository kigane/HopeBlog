const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig({
    '/guide/': require("./guide"),
    '/blog/': require("./blog"),
    '/hazel/': require("./hazel"),
    '/note/cs/': require("./note/cs"),
    '/note/cpp/': require("./note/cpp"),
    '/note/algorithm/': require("./note/algorithm"),
    '/note/cv/': require("./note/cv"),
    '/note/js/': require("./note/js"),
    '/note/opengl/': require("./note/opengl"),
    '/': ['']
})