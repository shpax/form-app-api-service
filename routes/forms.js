const express = require('express');
const _ = require('lodash');
const { Form } = require('../db');

const router = express.Router();

router.post('/:domain/forms/new', async function (req, res, next) {
  const { fields, name } = req.body;
  const { domain } = req.params;

  try {
    const response = await Form.create({
      domain,
      name,
      fields,
      fields_count: fields.length
    })

    res.send({ id: response.id });
  } catch (error) {
    res.status(500).send(500, { error: error.message });
  }
});

router.put('/:domain/forms/:formId', async function (req, res, next) {
  const { fields, name } = req.body;
  const { domain, formId } = req.params;

  const fieldsUpdate = {};
  if (fields) {
    fieldsUpdate.fields = fields;
    fieldsUpdate.fields_count = fields.length;
  }
  try {
    const response = await Form.update({
      domain,
      name,
      ...fieldsUpdate
    }, {
      where: {
        id: formId,
      }
    })

    res.send({ id: response.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/:domain/forms/list', async function (req, res, next) {
  const { domain } = req.params;

  try {
    const response = await Form.findAll({
      where: {
        domain: domain,
      }
    })

    const forms = response.map(f => {
      return {
        ..._.pick(f, ['id', 'name']),
        fields: f.fields_count,
      }
    })

    res.send(forms);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.get('/:domain/forms/:formId', async function (req, res, next) {
  const { domain, formId } = req.params;

  try {
    const response = await Form.findOne({
      where: {
        id: formId,
        domain: domain,
      }
    })

    if (!response) {
      res.status(404).send({ error: 'form not found' });
    } else {
      res.send(_.pick(response, ['id', 'name', 'fields']));
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
