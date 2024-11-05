const express = require("express");

const {
  getAccountValidator,
  createAccountValidator,
  updateAccountValidator,
  deleteAccountValidator,
  importAccountValidator,
  pindingValidator,
  checkValidator,
  accountDataValidator,
  accountGroupDeleteValidator,
  importInstaAccountValidator,
} = require("../utils/validators/accountValidator");

const {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  uploadimportFile,
  importAccount,
  getAccountsForInsta,
  importAccountForInsta,
  bindingProxy,
  uploadtxtProxyFile,
  check,
  accountData,
  deleteAccountSet,
  deleteInstaAccountSet,
  newUpadteAccount,
} = require("../controllers/accountService");

const router = express.Router();

router
  .route("/tweet")
  .get(getAccounts)
  .post(createAccountValidator, createAccount);

router.route("/insta").get(getAccountsForInsta);
router
  .route("/:id")
  .get(getAccountValidator, getAccount)
  .put(updateAccountValidator, newUpadteAccount)
  .delete(deleteAccountValidator, deleteAccount);

router
  .route("/insta/:id")
  .get(getAccountValidator, getAccount)
  .put(updateAccountValidator, updateAccount)
  .delete(deleteAccountValidator, deleteAccount);

router.route("/import/tweet").post(
  uploadimportFile,
  importAccountValidator,

  importAccount
);

router
  .route("/import/insta")
  .post(uploadimportFile, importInstaAccountValidator, importAccountForInsta);

router
  .route("/binding")
  .post(uploadtxtProxyFile, pindingValidator, bindingProxy);
router.route("/check").post(checkValidator, check);
router.route("/data").post(accountDataValidator, accountData);
router
  .route("/delete/tweet")
  .post(accountGroupDeleteValidator, deleteAccountSet);

router
  .route("/delete/insta")
  .post(accountGroupDeleteValidator, deleteInstaAccountSet);
module.exports = router;
