const router   = require('express').Router();

router.get('/', (req, res) => {
    res.sendFile('app.html', { root: './dist' });
});

module.exports = router;
