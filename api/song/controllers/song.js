"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      console.log("searching...");
      entities = await strapi.services.song.search(ctx.query);
    } else {
      console.log("finding...");
      entities = await strapi.services.song.find({
        _sort: "id:asc"
      });
    }

    return entities.map(entity => {
      console.log("entity...", entity);
      return sanitizeEntity(entity, { model: strapi.models.song });
    });
  }
};
