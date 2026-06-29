"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const panchang_controller_1 = require("../controllers/panchang.controller");
const router = (0, express_1.Router)();
router.get('/', panchang_controller_1.PanchangController.getPanchang);
exports.default = router;
