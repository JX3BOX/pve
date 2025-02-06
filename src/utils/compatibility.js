// 处理旧路由的兼容。跳转到新路由
export function compatibilityRoute(path) {
    switch (path) {
        case '/app/bhhj':
            return '/fb/bahuang';
        case '/app/facedata':
            return '/face/facedata';
        case '/app/fightlog-analyzer':
            return '/battle';
        case '/app/furniture':
            return '/furniture';
        case '/app/haste':
            return '/bps/haste';
        case '/app/icons':
            return '/app/design/icon';
        case '/app/jx3-icons':
            return '/app/design/icon';
        case '/app/jx3-price':
            return '/pvg/price';
        case '/app/jx3-query':
            return '/app/database';
        case '/app/jx3-servers':
            return '/pvg/gonggao/server';
        case '/app/logos':
            return '/app/design/icon';
        case '/app/macroeditor':
            return '/macro/macroeditor';
        case '/app/meridians':
            return '/macro/meridians';
        case '/app/qixue-simulator':
            return '/macro/talent';
        case '/app/sandbox':
            return '/pvp/sandbox';
        case '/app/talent':
            return '/macro/talent';
        case '/app/talent2':
            return '/macro/talent2';
        default:
            return path;
    }
}
