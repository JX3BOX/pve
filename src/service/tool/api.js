import axios from "axios";

function req(options) {
    return new Promise((resolve, reject) => {
        // axios.defaults.withCredentials = true;
        const instance = axios.create({
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            timeout: 1000 * 10,
        });
        instance(options)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response) {
                    if (error.response.data.code) {
                        reject(error.response.data);
                    } else {
                        reject({
                            msg: error.response.data,
                            code: error.response.status,
                        });
                    }
                } else {
                    reject({
                        msg: "网络请求异常",
                        code: -1,
                    });
                }
            });
    });
}

export function fetch(url, method, withCredentials, data, headers, params) {
    let options = {
        url: (process.env.NODE_ENV === "production" ? "" : "") + url,
        method: method ? method : "GET",
    };
    if (withCredentials === undefined) {
        options["withCredentials"] = false;
    } else {
        options["withCredentials"] = withCredentials;
    }
    if (data != undefined && Object.keys(data).length > 0) {
        options["data"] = data;
    }
    if (headers != undefined && headers !== "") {
        options["headers"] = headers; // {key:value}
    }
    if (params != undefined && Object.keys(params).length > 0) {
        options["params"] = params;
    }
    return req(options);
}

export function realUrl(domain, uri) {
    if (process.env.NODE_ENV === "production") {
        return domain + uri;
    } else {
        return "/" + uri;
    }
}
