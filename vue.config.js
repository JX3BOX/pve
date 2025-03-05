const path = require("path");
const pkg = require("./package.json");
const { JX3BOX, SEO } = require("@jx3box/jx3box-common");

module.exports = {
    // map
    productionSourceMap: false,
    //❤️ Multiple pages ~
    pages: {
        tool: {
            title: "工具资源 - JX3BOX",
            entry: "src/pages/tool/index.js",
            template: "public/index.html",
            filename: "tool/index.html",
        },
        app: {
            title: "工具资源 - JX3BOX",
            entry: "src/pages/tool/index.js",
            template: "public/index.html",
            filename: "tool/index.html",
        },
        macro: {
            title: "剑三宏 - JX3BOX",
            entry: "src/pages/macro/index.js",
            template: "public/index.html",
            filename: "macro/index.html",
        },
        bps: {
            title: "职业专栏 - JX3BOX",
            entry: "src/pages/bps/index.js",
            template: "public/index.html",
            filename: "bps/index.html",
        },
        dbm: {
            title: "数据构建 - JX3BOX",
            entry: "src/pages/dbm/index.js",
            template: "public/index.html",
            filename: "dbm/index.html",
        },
        battle: {
            title: "战斗统计 - JX3BOX",
            entry: "src/pages/battle/index.js",
            template: "public/index.html",
            filename: "battle/index.html",
        },
        fb: {
            title: "副本专栏 - JX3BOX",
            entry: "src/pages/fb/index.js",
            template: "public/index.html",
            filename: "fb/index.html",
        },
        team: {
            title: "团队管理平台 - JX3BOX",
            entry: "src/pages/team/index.js",
            template: "public/index.html",
            filename: "team/index.html",
        },
    },

    //❤️ Proxy ~
    devServer: {
        proxy: {
            "/api/horn": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/inspire": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/vip": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/cny": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/summary": {
                target: "https://next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/comment": {
                target: "https://next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/cms": {
                // target: process.env["DEV_SERVER"] == "true" ? "http://localhost:7100" : "https://cms.jx3box.com",
                target: "https://cms.jx3box.com",
            },
            "/api/summary-any": {
                target: "https://next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/team": {
                target: "https://team.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/search": {
                target: "https://gs.jx3box.com",
                changeOrigin: true,
            },
            "/pay/web": {
                target: "https://ipay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/pay": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/summary-any": {
                target: "https://next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/letter": {
                target: "https://dev.next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/next2": {
                target: "https://dev.next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/lua": {
                target: "https://lua.jx3box.com/",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api": {
                target: "https://dev.next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
        },
        disableHostCheck: true,
    },

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : "dist", // 指定构建输出的目录

    //❤️ define path for static files ~
    publicPath:
        //FOR Localhost => development
        (process.env.NODE_ENV === "development" && "/") ||
        //BY relative path
        (process.env.BUILD_MODE === "preview" && `/${pkg.name}/`) ||
        //BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
        //BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
        //BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
        //BY OSS=>CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
        //BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
        //BY root path or bind a domain
        (process.env.STATIC_PATH == "root" && "/") ||
        //for lost
        "/",

    // 奇怪的打包错误 ThreadLoader 会和 WorkerLoader 冲突
    // 禁用并行打包
    parallel: false,
    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        // config.plugin("html").tap((args) => {
        //     args[0].meta = {
        //         //------设置SEO信息
        //         Keywords: Setting.keys,
        //         Description: Setting.desc,
        //     };
        //     args[0].title = Setting.title + SEO.title; //------自动添加标题后缀
        //     return args;
        // });

        //💝 in-line small imgs ~
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap((options) => Object.assign(options, { limit: 10240, esModule: false }));

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        // web worker
        config.module
            .rule("worker")
            .test(/\.worker\.js$/)
            .use("worker-loader")
            .loader("worker-loader")
            .options({ inline: "fallback" })
            .end()
            .use("babel-loader")
            .loader("babel-loader")
            .end();

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        var preload_styles = [];
        preload_styles.push(
            path.resolve(__dirname, "./node_modules/csslab/base.less"),
            path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
            path.resolve(__dirname, "./src/assets/css/var.less")
        );
        function addStyleResource(rule) {
            rule.use("style-resource").loader("style-resources-loader").options({
                patterns: preload_styles,
            });
        }
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
    },
};
