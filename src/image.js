const im = require('imagemagick');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

const request = require('request');
const rp = require("request-promise");

async function download(url, filename){
    const res = await rp.head(url, {
        resolveWithFullResponse: true
    });

    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    return new Promise((resolve, reject) => {
        request(url).pipe(fs.createWriteStream(filename))
        .on('close', ()=>{
            console.log("Image downloaded to " + filename);
            resolve(filename);
        })
        .on('error', reject);
    });
}

async function getMimeType(filename) {
    return new Promise((resolve, reject) => {
        im.identify(filename, (err, features) => {

            if(err){
                reject(err);
            }

            let mimeType;
            switch (features.format) {
                case 'GIF':
                    mimeType = 'image/gif';
                    break;
                case 'PNG':
                    mimeType = 'image/png';
                    break;
                default:
                    mimeType = 'image/jpeg';
            }

            resolve(mimeType);
        })
    })
}

function resizedCB(err, filename, resizedFilename, resolve, reject){
    return (async () => {
        if(err){
            reject(err);
        }
        resolve({
            mimeType: await getMimeType(resizedFilename),
            filename: resizedFilename
        })
    })().finally(()=>{
        unlink(filename).then();
    }).catch(reject);
}

async function resize(url, width, height) {
    const filename = `/tmp/src_${Math.random().toString(36).substring(2, 15)}.jpg`;
    const resizedFilename = `/tmp/dst_${Math.random().toString(36).substring(2, 15)}.jpg`;

    await download(url, filename);

    return new Promise((resolve, reject) => {

        if(height){
            im.crop({
                width,
                srcPath: filename,
                dstPath: resizedFilename,
                height,
                quality: 1,
                gravity: "Center"
            }, (err) => resizedCB(err, filename, resizedFilename, resolve, reject));
        } else {
            im.resize({
                width,
                srcPath: filename,
                dstPath: resizedFilename
            }, (err) => resizedCB(err, filename, resizedFilename, resolve, reject));
        }

        
    });
}

module.exports = {
    resize
}