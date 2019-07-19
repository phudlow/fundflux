const { query } = require('../db');
const router = require('express').Router();

router.post('/transaction', async (req, res) => {
    const result = await query(
        `INSERT INTO transaction_event (plan_id, name, description, start_date, frequency) VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [req.body.plan_id, req.body.name, req.body.description, req.body.start_date, req.body.frequency]);

    res.json({ 
        message: 'TRANSACTION_CREATED',
        data: result.rows[0]
    });
});

router.delete('/transaction/:id', async (req, res) => {
    let result = await query('SELECT * FROM transaction_event WHERE id=$1', [req.params.id]);
    if (!result.rows.length) {
        return res.sendStatus(404);
    }

    result = await query(
        'SELECT user_id FROM project WHERE id IN (SELECT project_id FROM plan WHERE id=$1)',
        [result.rows[0].plan_id]);
    if (result.rows[0].user_id !== req.user.id) {
        return res.sendStatus(403);
    } 
    await query('DELETE FROM transaction_event WHERE id=$1 RETURNING id', [req.params.id]);
    res.json({ 
        message: 'TRANSACTION_DELETED'
    });
});

module.exports = router;
