const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const { resize } = require('./image');

module.exports.handler = async function (req, resp, context) {
    const {
        url = 'https://file01.dysucai.com/d/file/lan20191114/51ognjplyhl.jpg',
        width = 200,
        height
    } = req.queries;

    const { mimeType, filename } = await resize(url, width, height);

    resp.setHeader('content-type', mimeType);
    resp.send(await readFile(filename));
    await unlink(filename);
}