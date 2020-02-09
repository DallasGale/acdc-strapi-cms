"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require("strapi-utils");

function deleteId(array) {
  array.map(arr => {
    delete arr.id;
  });
}

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
      entities = await strapi.services.album.search(ctx.query);
    } else {
      console.log("finding...");
      entities = await strapi.services.album.find({
        _sort: "id:asc"
      });
    }

    let title = null;
    let trackCount = 0;
    let worldwideReleaseDate = null;
    let internationalReleaseDate = null;
    let europeanReleaseDate = null;
    let northAmericanReleaseDate = null;
    let australianReleaseDate = null;
    let isStudioRecording = false;
    let isLiveRecording = false;
    let musicians = [];
    let producers = [];
    let producedAt = [];
    let publisher = [];
    let label = [];
    let industryCharts = [];
    let unitsMoved = [];
    let sideA = [];
    let sideB = [];
    let singles = [];
    let artwork = {
      size: null,
      format: null,
      url: null,
      source: null,
      version: null, // 'EU', 'US', 'AU' etc,
      artist: null
    };

    let API_OUTPUT = [];

    for (let i = 0; i < entities.length; i++) {
      // * Title...
      if (
        entities[i].title !== null ||
        typeof entities[i].title !== "undefined"
      ) {
        title = entities[i].title;
      }

      // * Worldwide Release...
      if (entities[i].worldwideReleaseDate !== null) {
        worldwideReleaseDate = entities[i].worldwideReleaseDate;
      }

      // * International Release...
      if (entities[i].internationalReleaseDate !== null) {
        internationalReleaseDate = entities[i].internationalReleaseDate;
      }

      // * North American Release...
      if (entities[i].northAmericanReleaseDate !== null) {
        northAmericanReleaseDate = entities[i].northAmericanReleaseDate;
      }

      // * European Release...
      if (entities[i].europeanReleaseDate !== null) {
        europeanReleaseDate = entities[i].europeanReleaseDate;
      }
      // * Australia Release...
      if (entities[i].australianReleaseDate !== null) {
        australianReleaseDate = entities[i].australianReleaseDate;
      }

      // * Studio Recording...
      if (
        entities[i].isStudioRecording !== null ||
        typeof entities[i].isStudioRecording !== "undefined"
      ) {
        isStudioRecording = entities[i].isStudioRecording;
      }

      // * Live Recording...
      if (
        entities[i].isLiveRecording !== null ||
        typeof entities[i].isLiveRecording !== "undefined"
      ) {
        isLiveRecording = entities[i].isLiveRecording;
      }

      // * Musicians...
      if (
        entities[i].performers !== null ||
        typeof entities[i].performers !== "undefined"
      ) {
        // deleteId(entities[i].performers);
        musicians = entities[i].performers;
      }

      // * Producers...
      if (
        entities[i].producers !== null ||
        typeof entities[i].producers !== "undefined"
      ) {
        // deleteId(entities[i].producers);
        producers = entities[i].producers;
      }

      // * Produced at...
      if (
        entities[i].studios !== null ||
        typeof entities[i].studios !== "undefined"
      ) {
        // deleteId(entities[i].producers);
        producedAt = entities[i].studios;
      }

      // * Publisher...
      if (entities[i].publisher !== null) {
        // deleteId(entities[i].producers);
        publisher = entities[i].publisher;
      }

      // * Labels...
      if (
        entities[i].labels !== null ||
        typeof entities[i].labels !== "undefined"
      ) {
        // deleteId(entities[i].producers);
        label = entities[i].labels;
      } else {
        label = [];
      }

      // * Charts...
      if (entities[i].charts !== null) {
        // deleteId(entities[i].charts);
        industryCharts = entities[i].charts;
      }

      // * Certification...
      if (entities[i].units !== null) {
        // deleteId(entities[i].units);
        unitsMoved = entities[i].units;
      }

      // * Track Count...
      if (entities[i].sideA.length) {
        // deleteId(entities[i].sideA[0].songs);
        sideA = entities[i].sideA[0].songs;
        trackCount = entities[i].sideA[0].songs.length;
      } else {
        sideA = [];
        trackCount = 0;
      }

      // * Track Count...
      if (entities[i].sideB.length) {
        // deleteId(entities[i].sideB[0].songs);
        sideB = entities[i].sideB[0].songs;
        trackCount += entities[i].sideB[0].songs.length;
      } else {
        sideB = [];
      }

      // * Singles...
      if (entities[i].singles.length) {
        // deleteId(entities[i].singles[0].songs);
        singles = entities[i].singles;
      } else {
        singles = [];
      }

      // * Artwork image...
      if (typeof entities[i].coverArt.image !== "undefined") {
        // console.log("entities[i].coverArt.image", entities[i].coverArt.image);

        artwork.format = entities[i].coverArt.image.ext;
        artwork.url = entities[i].coverArt.image.url;
        artwork.size = entities[i].coverArt.image.size;
      } else {
        artwork.format = null;
        artwork.url = null;
        artwork.size = null;
      }

      // * Artwork details...
      if (entities[i].coverArt.length) {
        if (entities[i].coverArt.isEuropean) {
          artwork.version = "eu";
        } else if (entities[i].coverArt.isNorthAmerican) {
          artwork.version = "eu";
        } else if (entities[i].coverArt.isAustralian) {
          artwork.version = "au";
        } else {
          artwork.version = null;
        }

        artwork.source = entities[i].coverArt.source;
        artwork.artist = entities[i].coverArt.artist;
      } else {
        artwork.source = null;
        artwork.artist = null;
      }

      API_OUTPUT.push({
        title: title,
        trackCount: trackCount,
        worldwideReleaseDate: worldwideReleaseDate,
        internationalReleaseDate: internationalReleaseDate,
        northAmericanReleaseDate: northAmericanReleaseDate,
        europeanReleaseDate: europeanReleaseDate,
        australianReleaseDate: australianReleaseDate,
        isStudioRecording: isStudioRecording,
        isLiveRecording: isLiveRecording,
        musicians: musicians,
        producers: producers,
        producedAt: producedAt,
        publisher: publisher,
        label: label,
        industryCharts: industryCharts,
        unitsMoved: unitsMoved,
        sideA: sideA,
        sideB: sideB,
        singles: singles,
        artwork: {
          format: artwork.ext,
          size: artwork.size,
          url: artwork.url,
          source: artwork.source,
          version: artwork.version,
          artist: artwork.artist
        }
      });
    }

    console.log(API_OUTPUT);

    return API_OUTPUT.map(entity => {
      return sanitizeEntity(entity, { model: strapi.models.album });
    });
  }
};
