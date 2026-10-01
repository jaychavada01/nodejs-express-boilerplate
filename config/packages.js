/*
 * CENTRALIZED PACKAGE REGISTRY
 * Re-exports all third-party npm libraries and built-in Node.js modules as capitalized identifiers.
 */

// Node.js Built-in Modules
const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Web, Security & Infrastructure
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

// Validation, Cryptography & Auth
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4, v1: uuidv1 } = require("uuid");

// Database & Caching
const { Sequelize, DataTypes, Op } = require("sequelize");
const Redis = require("ioredis");

// Background Tasks & Queues
const cron = require("node-cron");
const amqp = require("amqplib");

// Communication & Storage Services
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const handlebars = require("handlebars");
const XLSX = require("xlsx");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

module.exports = {
  // Built-in Node modules
  HTTP: http,
  PATH: path,
  FS: fs,
  FS_PROMISES: fs.promises,
  CRYPTO: crypto,

  // Express & Security
  EXPRESS: express,
  CORS: cors,
  HELMET: helmet,
  RATE_LIMIT: rateLimit,
  DOTENV: dotenv,

  // Validation & Auth
  JOI: Joi,
  JWT: jwt,
  BCRYPT: bcrypt,
  UUID: { v4: uuidv4, v1: uuidv1 },
  UUIDV4: uuidv4,

  // Database & ORM
  SEQUELIZE: { Sequelize, DataTypes, Op },
  Sequelize,
  DataTypes,
  Op,

  // Cache & Queues
  REDIS: Redis,
  AMQPLIB: amqp,
  CRON: cron,

  // Communication & Media
  FIREBASE_ADMIN: admin,
  SENDGRID_MAIL: sgMail,
  HANDLEBARS: handlebars,
  MOMENT: require("moment"),
  XLSX: XLSX,
  MULTER: multer,

  // AWS S3
  AWS_S3: {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
  },
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3_PRESIGNER: {
    getSignedUrl,
  },
  getSignedUrl,
};
