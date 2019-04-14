const req = require('request');
const fs = require('fs');

const config = require('./config');

module.exports = {
    itemList,
    itemImage,
    processDataset,
};

const _configs = config.getConfigs();

var _cookieString;
var _cookieStringTimeout;
function getCookies() {
    return new Promise((resolve, reject) => {
        req.post(_configs.BUSINESSONE.SERVICELAYER_APIURL + '/Login', {
            body: {
                "UserName": _configs.BUSINESSONE.USERNAME,
                "Password": _configs.BUSINESSONE.PASSWORD,
                "CompanyDB": _configs.BUSINESSONE.COMPANYDB
            },
            json: true,
            rejectUnauthorized: false
        }, (err, res, body) => {
            if (err) { reject(err); }
            if (body && body.hasOwnProperty('SessionId')) {
                // B1SESSION=b1c5df78-5e69-11e9-8000-02ea2c070d68
                _cookieString = `B1SESSION=${body.SessionId};HttpOnly;`;
                _cookieStringTimeout = Date.now();
                console.log(_cookieString, _cookieStringTimeout);

                resolve(_cookieString);
            } else {
                resolve(null);
            }
        });
    });
}

async function itemList() {
    if (!_cookieString || (Date.now() - _cookieStringTimeout) > 10 * 60 * 1000) {// 10 mins timeout
        const cookie = await getCookies();
        if (!cookie) { return null; }
    }

    return new Promise((resolve, reject) => {
        const j = req.jar();
        const cookie = req.cookie(_cookieString);
        const url = _configs.BUSINESSONE.SERVICELAYER_APIURL + '/Items';
        j.setCookie(cookie, url);
        req.get(url, { json: true, jar: j, rejectUnauthorized: false }, (err, res, body) => {
            if (err) { reject(err); }
            resolve(body);
        });
    });
}

async function itemImage(itemId) {
    if (!_cookieString || (Date.now() - _cookieStringTimeout) > 10 * 60 * 1000) {// 10 mins timeout
        const cookie = await getCookies();
        if (!cookie) { return null; }
    }

    return await new Promise((resolve, reject) => {
        const j = req.jar();
        const cookie = req.cookie(_cookieString);
        const url = _configs.BUSINESSONE.SERVICELAYER_APIURL + `/ItemImages('${itemId}')/$value`;
        j.setCookie(cookie, url);
        req.get(url, {
            json: true,
            jar: j,
            rejectUnauthorized: false,
            headers: {
                'Accept': 'image/jpeg',
                'Accept-Encoding': 'gzip, deflate'
            }
        }).pipe(fs.createWriteStream(`./app/label/pictures/${itemId}.jpg`)).on('close', resolve);
        // (err, res, body) => {
        //     if (err) { reject(err); }
        //     console.log('image:', itemId);
        //     if (body && !body.hasOwnProperty('error')) {
        //         fs.writeFile(`./app/label/pictures/${itemId}.jpg`, body, 'binary', function (err) {
        //             if (err) { next(err); }
        //         });
        //     }
        //     // save the image as file
        //     resolve(body);
        // });
    });
}

function processDataset(raw) {
    if (raw && raw.hasOwnProperty('value') && raw.value.length > 0) {
        for (let item of raw.value) {
            if (item.Picture && item.Picture != '') {
                itemImage(item.ItemCode);
            }
        }
    }
    return raw.value;
}
