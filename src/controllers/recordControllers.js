const Record = require("../database/models/Record");
const customError = require("../utils/customError");

const getRecordById = async (req, res, next) => {
  const { recordId } = req.params;

  try {
    const recordInfo = await Record.findById(recordId);

    res.status(200).json({ recordInfo });
  } catch {
    const error = customError(404, "Not found", "Id not found");
    next(error);
  }
};

module.exports = getRecordById;
