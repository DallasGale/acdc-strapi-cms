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

    let API_OUTPUT = [];

    for (let i = 0; i < entities.length; i++) {
      API_OUTPUT.push({
        // id: entities[i].id,
        title: entities[i].title,
        length: entities[i].length,
        // isSingle: entities[i].single,
        singleInfo: entities[i].albumSingle, // destructure this object
        writtenBy: entities[i].writers
      });
    }

    return entities.map(entity => {
      // TODO: When creating the new json response remove most of the 'album' data.. leave 'title'.
      console.log("API_OUTPUT...", entity);
      return sanitizeEntity(entity, { model: strapi.models.song });
    });
  }
};
