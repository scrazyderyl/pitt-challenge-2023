const fs = require('fs');
const express = require('express');

const PORT = 4000;

const requests = express();
const fileNamePattern = new RegExp("[^0-9a-z_]", "i");

requests.use(express.json());

requests.get("/:username", (req, res) => {
    if (fileNamePattern.test(req.params.username)) {
        res.json({"message": "Invalid username!"});
        return;
    }

    fs.readFile(`./saves/${req.params.username}.json`, (error, data) => {
        if (error) {
            res.json({"message": error.code});
            return;
        }

        res.send(data);
    });
});

requests.put("/:username", (req, res) => {
    if (fileNamePattern.test(req.params.username)) {
        res.json({"message": "Invalid username!"});
        return;
    }

    fs.writeFile(`./saves/${req.params.username}.json`, JSON.stringify(req.body), (error) => {
        if (error) {
            res.json({"message": error.code});
            return;
        }
        
        res.json({"message": "Successfully saved"});
    });
});

requests.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})