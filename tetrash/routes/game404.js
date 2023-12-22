const express = require('express');
const {existsSync, mkdirSync, readFileSync, writeFileSync} = require("fs");
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (!existsSync("./saved/")) {
        mkdirSync("./saved/");
    }

    let json = []
    try {
        const data = readFileSync("./saved/data.json")
        for (const item of Object.values(JSON.parse(data))) {
            json.push(`${item.name} : ${item.score}`)
        }
    } catch (e) {
    }
    res.render('game', {title: '404', winners: json});
});

router.post('/', function (req, res) {

    if (!existsSync("./saved/")) {
        mkdirSync("./saved/");
    }

    let json = {}
    try {
        json = JSON.parse(readFileSync("./saved/data.json"))
    } catch (e) {
    }

    const data = req.body;

    if (json[data.name] && json[data.name].score >= data.score) {
        console.log("Not a highscore");
        res.redirect('/404');
        return;
    }

    console.log("New highscore")
    json[data.name] = {name: data.name, score: data.score};
    writeFileSync("./saved/data.json", JSON.stringify(json));

    res.redirect('/404');
})

module.exports = router;
