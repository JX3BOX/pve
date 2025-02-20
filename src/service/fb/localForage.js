import localForage from 'localforage'

localForage.config({
    name: 'jx3box'
});

export function setLocalForage(storeName, key, data, cb, cb2) {
    localForage.config({
        storeName: storeName
    });
    localForage
        .setItem(key, data)
        .then(value => {
            if (cb) cb(value)
        })
        .catch(function(err) {
            if (cb2) cb2(err)
        })
}

export function getLocalForage(storeName, key, cb) {
    localForage.config({
        storeName: storeName
    });
    localForage.getItem(key, (err, value) => {
        cb(value, err)
    })
}

export function removeLocalForage(key, cb, cb2) {
    localForage
        .removeItem(key)
        .then(function() {
            cb()
        })
        .catch(function(err) {
            cb2(err)
        })
}

export function clearLocalForage(storeName, cb, cb2) {
    localForage.config({
        storeName: storeName
    });
    localForage
        .clear()
        .then(function() {
            cb()
        })
        .catch(function(err) {
            cb2(err)
        })
}

export function lengthLocalForage(cb) {
    localForage
        .length()
        .then(numberOfKeys => {
            if (cb) cb(numberOfKeys)
            console.log(numberOfKeys)
        })
        .catch(function(err) {
            console.log(err)
        })
}

export function iteratorLocalForage() {
    localForage
        .iterate(function(value, key, iterationNumber) {
            console.log([key, value])
        })
        .then(function() {
            console.log('Iteration has completed')
        })
        .catch(function(err) {
            console.log(err)
        })
}

export function support() {
    const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
    if (indexedDB) {
        return true
    } else {
        return false
    }
}
