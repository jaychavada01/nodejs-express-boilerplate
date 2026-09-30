"use strict";

const Joi = require("joi");

const createSampleSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().max(500).allow("", null),
  status: Joi.string().valid("active", "inactive", "pending").default("active"),
});

const updateSampleSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().max(500).allow("", null),
  status: Joi.string().valid("active", "inactive", "pending"),
}).min(1);

const querySampleSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(""),
  status: Joi.string().valid("active", "inactive", "pending"),
});

const pushDemoSchema = Joi.object({
  deviceToken: Joi.string().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  osType: Joi.string().valid("ios", "android", "web").default("android"),
  data: Joi.object().optional(),
});

const emailDemoSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().required(),
  name: Joi.string().default("User"),
  message: Joi.string().optional(),
});

const queueDemoSchema = Joi.object({
  queueName: Joi.string().optional(),
  payload: Joi.object().required(),
});

module.exports = {
  createSampleSchema,
  updateSampleSchema,
  querySampleSchema,
  pushDemoSchema,
  emailDemoSchema,
  queueDemoSchema,
};
