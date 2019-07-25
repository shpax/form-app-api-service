const express = require('express');
const _ = require('lodash');
const { Fill } = require('../db');

const router = express.Router();

router.post('/:domain/fills/:formId', async function (req, res, next) {
  const { fields } = req.body;
  const { domain, formId } = req.params;

  try {
    const response = await Fill.create({
      domain,
      formId: +formId,
      fields,
    })

    res.send({ id: response.id });
  } catch (error) {
    res.status(500).send(500, { error: error.message });
  }
});

router.get('/:domain/fills/:formId', async function (req, res, next) {
  const { domain, formId } = req.params;
  const { offset = 0, count: limit = 100 } = req.query;

  try {
    const response = await Fill.findAll({
      where: {
        domain,
        formId: +formId
      },
      offset: +offset,
      limit: +limit,
    })

    const fills = response.map(({ id, fields}) => ({ id, fields }));

    res.send(fills);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
