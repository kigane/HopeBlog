const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig({
    '/guide/': require("./guide"),
    '/blog/': require("./blog"),
    '/thesis/': require("./thesis"),
    '/note/algorithm/': require("./note/algorithm"),
    '/note/cs/': require("./note/cs"),
    '/note/cpp/': require("./note/cpp"),
    '/note/python/': require("./note/python"),
    '/note/js/': require("./note/js"),
    '/': ['']
})