const { query } = require('../db');
const router = require('express').Router();

router.post('/account', async (req, res) => {
    const result = await query(
        `INSERT INTO account (project_id, name, description) VALUES ($1, $2, $3)
         RETURNING *`,
        [req.body.project_id, req.body.name, req.body.description]);

    res.json({ 
        message: 'ACCOUNT_CREATED',
        data: result.rows[0]
    });
});

router.delete('/account/:id', async (req, res) => {
    let result = await query('SELECT * FROM account WHERE id=$1', [req.params.id]);
    if (!result.rows.length) {
        return res.sendStatus(404);
    }

    result = await query(
        'SELECT user_id FROM project WHERE id=$1',
        [result.rows[0].project_id]);
    if (result.rows[0].user_id !== req.user.id) {
        return res.sendStatus(403);
    } 
    await query('DELETE FROM account WHERE id=$1 RETURNING id', [req.params.id]);
    res.json({ 
        message: 'ACCOUNT_DELETED'
    });
});

module.exports = router;
