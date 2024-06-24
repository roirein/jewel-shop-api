const HTTPError = require("../../../errors/http-error");
const resourceManager = require("../../../resource-manager");
const RestService = require("../rest-service");

class BaseEntityService extends RestService {
  #resourceType;

  constructor(resourceType) {
    super();
    this.#resourceType = resourceType;
  }

  handleEntityServiceError(error) {
    if (error.type && error.type === "DBError") {
      throw error.toHTTPError();
    }
    throw error;
  }

  get resourceType() {
    return this.#resourceType;
  }

  async createResource(resourceContent) {
    try {
      const resource = await this.resourceManager.createResource(
        this.resourceType,
        resourceContent
      );
      return resource;
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async searchResources(query = {}) {
    try {
      const results = await this.resourceManager.findAll(
        this.resourceType,
        query
      );
      return results;
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async searchResourceById(id, fields = "") {
    try {
      const resource = await this.resourceManager.findById(
        this.resourceType,
        id,
        fields
      );
      if (!resource) {
        throw new HTTPError(
          "The resource you are looking for is not exists",
          "fail",
          404
        );
      }
      return resource;
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async updateResource(id, data, fields = "") {
    try {
      const updatedResource = await this.resourceManager.update(
        this.resourceType,
        id,
        data,
        fields
      );
      if (!updatedResource) {
        throw new HTTPError(
          "The resource you are trying to update is not exists",
          "fail",
          404
        );
      }
      return updatedResource;
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async deleteResource(id) {
    try {
      const isSuccessfullDeletion = await this.resourceManager.delete(
        this.resourceType,
        id
      );
      if (!isSuccessfullDeletion) {
        throw new HTTPError(
          "You are trying to delete a resource that is not exists",
          "fail",
          404
        );
      }
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }
}

module.exports = BaseEntityService;
