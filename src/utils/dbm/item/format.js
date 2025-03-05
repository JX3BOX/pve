export default {
    tKungFu: function (val) {
        let arr = [];
        if (val) {
            for (let key in val) {
                if (val[key]) {
                    arr.push(key.split("#").pop());
                }
            }
            return arr;
        } else {
            return null;
        }
    },
    col: function (val) {
        if (val) {
            return `rgb(${val.toString()})`;
        } else {
            return "";
        }
    },
};
