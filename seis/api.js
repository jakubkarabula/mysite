const express = require('express')
const writeFileSync = require('fs').writeFileSync
const seisConfig = require('./seis.json')

const router = express.Router();

router.get("/", function (req, res) {
    const { font, ...rest } = seisConfig

    res.json(rest);
});

router.get("/font", function (req, res) {
    const { font } = seisConfig

    const setFont = req.query.set;
    if (setFont && setFont.length === 1536) {
        seisConfig.font = setFont;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }

    res.json({ font });
});

router.get("/text", function (req, res) {
    const { text } = seisConfig

    const setText = req.query.set;
    if (setText && setText.length > 0 && setText.length < 150) {
        seisConfig.text = setText;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }
    res.json({ text });
})

exports.router = router;