const express = require("express");
const { addFinancial } = require("../controllers/financial.controller");
const { getFinancials } = require("../controllers/financial.controller");
const { getFinancialById } = require("../controllers/financial.controller");
const { updateFinancial } = require("../controllers/financial.controller");
const { deleteFinancial } = require("../controllers/financial.controller");
const{BulkaddFinancial} =require("../controllers/financial.controller");

const router = express.Router();

router.post("/Addfinancials", addFinancial);
router.post("/BulkAddfinancials", BulkaddFinancial);
router.get("/GetAllfinancials/:userId",getFinancials);
router.get("/:id/Getfinancials/:financialId", getFinancialById);
router.put("/:id/Updatefinancials/:financialId", updateFinancial);
router.delete("/:id/Deletefinancials/:financialId", deleteFinancial);

module.exports = router;
