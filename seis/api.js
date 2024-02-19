const express = require('express')
const writeFileSync = require('fs').writeFileSync
const seisConfig = require('./seis.json')

const router = express.Router();

router.get("/", function (req, res) {
    const dateWithouthSecond = new Date();
    const time = dateWithouthSecond.toLocaleTimeString('de-DE', {
        hour: '2-digit', 
        minute:'2-digit',
        timeZone: 'Europe/Amsterdam'
    });

    res.json({...seisConfig, time });
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