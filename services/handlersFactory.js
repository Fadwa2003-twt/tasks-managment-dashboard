const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const User = require("../models/employeeModel");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(` ${id}لا يوجد بيانات لهذا الرقم `, 404));
    }

    // Trigger "remove" event when update document
    //await document.remove();
    res.status(204).send();
  });
exports.deleteMany = (Model) =>
  asyncHandler(async (req, res, next) => {
    const sets = req.body.ids;
    await Model.deleteMany({ _id: { $in: sets } });

    res.status(204).send();
  });
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(` ${req.params.id}لا يوجد بيانات لهذا الرقم `, 404)
      );
    }
    // Trigger "save" event when update document
    // document.save();

    res.status(200).json({ data: document });
  });

exports.createOne = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({ data: newDoc });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`${id}لا يوجد بيانات لهذا الرقم `, 404));
    }
    res.status(200).json({ data: document });
  });

// factory.js
exports.getAll = (Model, modelName = "", populateFields = []) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    const documentsCounts = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .search(modelName)
      .limitFields();

    apiFeatures.paginate(documentsCounts);
    apiFeatures.sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;

    // Apply population if provided
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        mongooseQuery.populate(field);
      });
    }

    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

// exports.getAll = (Model, modelName = '') =>
//   asyncHandler(async (req, res) => {
//     let filter = {};
//     if (req.filterObj) {
//       filter = req.filterObj;
//     }

//     // Build query
//     const documentsCounts = await Model.countDocuments();

//     const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
//       .filter()
//       .search(modelName)
//       .limitFields();

//     // apiFeatures.paginate(documentsCounts);
//     apiFeatures.sort();

//     // Execute query
//     const { mongooseQuery, paginationResult } = apiFeatures;
//     const documents = await mongooseQuery;

//     // Modify the response to return all categories
//     const categories = [];
//     const catIds = new Set();
//     documents.map((doc) => {
//       // get different categories
//       // get all account in witch category
//       doc.Category && catIds.add(doc.Category._id);
//     });
//     const categoryIds = Array.from(catIds);
//     console.log(categoryIds);

//     res
//       .status(200)
//       .json({ results: categories.length, paginationResult, data: documents });
//   });
