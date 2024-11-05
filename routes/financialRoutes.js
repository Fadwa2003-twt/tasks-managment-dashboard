const express = require("express");
const financialController = require("../controllers/financialController");
const router = express.Router();

// Get all financial records
router.get("/", financialController.getAllFinancials);

// Get financial record by employee ID
router.get("/:employeeId", financialController.getFinancialByEmployee);

// Create a new financial record
router.post("/", financialController.createFinancialRecord);

// Update a financial record
router.patch("/:id", financialController.updateFinancialRecord);

// Update salary advance request status
router.patch(
  "/advance/:employeeId/:requestId",
  financialController.updateSalaryAdvanceStatus
);

module.exports = router;
