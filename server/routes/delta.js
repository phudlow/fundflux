const { query } = require('../db');
const router = require('express').Router();

router.post('/delta', async (req, res) => {
    const result = await query(
        `INSERT INTO delta (transaction_id, account_id, from_account_id, name, description, value, formula) VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [req.body.transaction_id, req.body.account_id, req.body.from_account_id, req.body.name, req.body.description, req.body.value, req.body.formula]);

    res.json({ 
        message: 'DELTA_CREATED',
        data: result.rows[0]
    });
});

router.delete('/delta/:id', async (req, res) => {
    let result = await query('SELECT * FROM delta WHERE id=$1', [req.params.id]);
    if (!result.rows.length) {
        return res.sendStatus(404);
    }
    result = await query(
        'SELECT user_id FROM project WHERE id IN (SELECT project_id FROM plan WHERE id IN (SELECT plan_id FROM transaction_event WHERE id=$1))',
        [result.rows[0].transaction_id]);
    if (result.rows[0].user_id !== req.user.id) {
        return res.sendStatus(403);
    } 
    await query('DELETE FROM delta WHERE id=$1 RETURNING id', [req.params.id]);
    res.json({ 
        message: 'DELTA_DELETED'
    });
});

module.exports = router;
