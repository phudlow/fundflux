const { query } = require('../db');
const router = require('express').Router();

router.post('/project', async (req, res) => {
    const result = await query(
        `INSERT INTO project (user_id, name, description) VALUES ($1, $2, $3)
         RETURNING id, name, description`,
        [req.user.id, req.body.name, req.body.description]);

    res.json({ 
        message: 'PROJECT_CREATED',
        data: result.rows[0]
    });
});

router.delete('/project/:id', async (req, res) => {
    const result = await query('SELECT * FROM project WHERE id=$1', [req.params.id]);
    if (!result.rows.length) {
        res.sendStatus(404);
    }
    if (result.rows[0].user_id !== req.user.id) {
        res.sendStatus(403);
    } 
    await query('DELETE FROM project WHERE id=$1 RETURNING id', [req.params.id]);
    res.json({ 
        message: 'PROJECT_DELETED'
    });
});

// TODO: will send this with initial state, probably not needed
router.get('/project/:id', async (req, res) => {
    const result = await query('SELECT * FROM project WHERE id=$1', [req.params.id]);
    if (!result.rows.length) {
        res.sendStatus(404);
    }
    if (result.rows[0].user_id !== req.user.id) {
        res.sendStatus(403);
    } 
    res.json({ 
        data: result.rows[0]
    });
});

module.exports = router;
