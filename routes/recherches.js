const express = require('express');
const router = express.Router();

const recherche = async (req, res) => {
    try {

        res.send('test');
    } catch(err) {
        console.error(err);
    }
};

router
    .route('/recherche')
    .get(recherche);

module.exports = router;