const { HTTPError } = require("../errors");
const Controller = require("./controller");

class ModelController extends Controller {
  constructor(service) {
    super(service);
  }

  async createModel(req, res, next) {
    try {
      if (!req.file) {
        throw new HTTPError("Sketch is required", "fail", 400);
      }
      const model = await this.service.createModel(
        {
          ...req.body,
          sketch: req.file.filename,
        },
        req.user.role //req.user should be set since this is controller for protected route
      );
      res.status(201).json({
        status: "success",
        data: {
          model,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ModelController;
