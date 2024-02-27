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
    if (setFont) {
        seisConfig.font = setFont;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }

    res.json({ font });
});

router.get("/clock-sub", function (req, res) {
    if (seisConfig.clock_font_size > 1) {
        seisConfig.clock_font_size -= 1;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }
    res.status(200).send();
})

router.get("/clock-add", function (req, res) {
    if (seisConfig.clock_font_size < 40) {
        seisConfig.clock_font_size += 1;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }
    res.status(200).send();
})

router.get("/text-sub", function (req, res) {
    if (seisConfig.text_font_size > 1) {
        seisConfig.text_font_size -= 1;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }
    res.status(200).send();
})

router.get("/text-add", function (req, res) {
    if (seisConfig.text_font_size < 40) {
        seisConfig.text_font_size += 1;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }
    res.status(200).send();
})

router.get("/text", function (req, res) {
    const text = req.query.set;
    if (text) {
        seisConfig.text = text;
        writeFileSync('./seis.json', JSON.stringify(seisConfig));
    }
    res.status(200).send();
})

exports.router = router;