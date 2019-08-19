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

router.post('/project/:id', async (req, res) => {
    const { name, description } = req.body;
    const id = req.params.id;
    await query(
        `UPDATE project SET name=$1, description=$2 WHERE id=$3`,
        [name, description, id]);

    res.json({ 
        message: 'PROJECT_UPDATED',
        data: { name, description, id }
    });
});

router.delete('/project/:id', async (req, res) => {
    let result = await query('SELECT * FROM project WHERE id=$1', [req.params.id]);
    if (!result.rows.length) {
        return res.sendStatus(404);
    }
    if (result.rows[0].user_id !== req.user.id) {
        return res.sendStatus(403);
    } 
    await query('DELETE FROM project WHERE id=$1 RETURNING id', [req.params.id]);
    res.json({ 
        message: 'PROJECT_DELETED'
    });
});

module.exports = router;
