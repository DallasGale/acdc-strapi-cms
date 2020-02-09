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

    let title = "";
    let trackCount = 0;
    let worldwideReleaseDate = "";
    let europeanReleaseDate = "";
    let australianReleaseDate = "";
    let isStudioRecording = false;
    let isLiveRecording = false;
    let musicians = [];
    let producers = [];
    let producedAt = [];
    let industryCharts = [];
    let unitsMoved = [];
    let sideA = [];
    let sideB = [];
    let singles = [];
    let artwork = {
      size: null,
      format: null,
      url: null,
      source: null
    };

    // ? Build up the response...
    // -- "title": "High Voltage (1975)",
    // -- "worldwideReleaseDate": "1975-01-01"
    // -- "europeanReleaseDate": "1975-01-01"
    // -- "australianReleaseDate": "1975-01-01"
    // -- "isStudioRecording": true,
    // -- "isLiveRecording": false,
    // -- "trackCount": 13 <<<< calculate (reduce?) sideA.length + sideB.length
    // -- "length": 00:45:00:000 <<<< calculate (reduce?) sideA.song.length + sideB.song.length
    // -- "songs": {
    // ----- "sideA": [
    // -------- {
    // ---------- "song": "Girls Got Rhythm",
    // ---------- "length": '00:04:00:000,
    // ---------- "writtenBy": [
    // ------------- {
    // --------------- "name": "Angus Young"
    // ------------- },
    // ------------- {
    // --------------- "name": "Malcolm Young"
    // ------------- },
    // ------------- {
    // --------------- "name": "Bon Scott"
    // ------------- }
    // ---------- ]
    // ---- }]
    // ----- "sideB": [
    // -------- {
    // ---------- "song": "Girls Got Rhythm",
    // ---------- "length": '00:04:00:000,
    // ---------- "writtenBy": [
    // ------------- {
    // --------------- "name": "Angus Young"
    // ------------- },
    // ------------- {
    // --------------- "name": "Malcolm Young"
    // ------------- },
    // ------------- {
    // --------------- "name": "Bon Scott"
    // ------------- }
    // ---------- ]
    // ---- }
    // -- ]
    // -- "performers": [
    // ----- {
    // -------- "name": "Angus Young",
    // -------- "performed": "lead guitar"
    // ----- },
    // ----- {
    // -------- "name": "Malcllm Young",
    // -------- "performed": "rhythm guitar"
    // ----- },
    // -- ]
    // -- "producers": [
    // ----- {
    // -------- "name": "Harry Vanda"
    // ----- },
    // ----- {
    // -------- "name": "George Young"
    // ----- }
    // -- ]
    // -- "labels": [
    // ----- {
    // -------- "Name": "Albert Productions",
    // ----- },
    // ----- {
    // -------- "Name": "Atlantic Records"
    // ----- }
    // -- ],
    // -- "peakChartPosition": [
    // ----- {
    // -------- "region": "AUS",
    // -------- "position": 13,
    // -------- "association": "APRA"
    // ----- }
    // -- ],,
    // --  "certifications": [
    // ----- {
    // -------- "region": "AUS",
    // -------- "certifcation": "Gold",
    // -------- "unitsSolde": 5000000,
    // -------- "association": "APRA"
    // ----- }
    // -- ],
    // -- "coverArt": {
    // ----- "url": "/uploads/cd2121ee7700437ca7973539fc88765a.jpg"
    // ----- "ext": ".jpg",
    // ----- "mime": "image/jpeg",
    // ----- "size": 86.88,
    // -- }
    // },

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
      if (
        entities[i].worldwideReleaseDate !== null ||
        typeof entities[i].worldwideReleaseDate !== "undefined"
      ) {
        worldwideReleaseDate = entities[i].worldwideReleaseDate;
      }
      // * European Release...
      if (
        entities[i].europeanReleaseDate !== null ||
        typeof entities[i].europeanReleaseDate !== "undefined"
      ) {
        europeanReleaseDate = entities[i].europeanReleaseDate;
      }
      // * Australia Release...
      if (
        entities[i].australianReleaseDate !== null ||
        typeof entities[i].australianReleaseDate !== "undefined"
      ) {
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

      // * Artwork...
      if (entities[i].coverArt !== null) {
        artwork.format = entities[i].coverArt.ext;
        artwork.url = entities[i].coverArt.url;
        artwork.size = entities[i].coverArt.size;
      } else {
        artwork.format = null;
        artwork.url = null;
        artwork.size = null;
      }
      // * Artwork source...
      if (entities[i].coverArtSource !== null) {
        artwork.source = entities[i].coverArtSource;
      } else {
        artwork.source = null;
      }

      // if (entities[i].singles.length) {
      //   console.log("entities", entities[i].singles[0].songs);
      // }

      API_OUTPUT.push({
        title: title,
        trackCount: trackCount,
        worldwideReleaseDate: worldwideReleaseDate,
        europeanReleaseDate: europeanReleaseDate,
        australianReleaseDate: australianReleaseDate,
        isStudioRecording: isStudioRecording,
        isLiveRecording: isLiveRecording,
        musicians: musicians,
        producers: producers,
        producedAt: producedAt,
        industryCharts: industryCharts,
        unitsMoved: unitsMoved,
        sideA: sideA,
        sideB: sideB,
        singles: singles,
        artwork: {
          format: artwork.ext,
          size: artwork.size,
          url: artwork.url,
          source: artwork.source
        }
      });
    }

    return API_OUTPUT.map(entity => {
      return sanitizeEntity(entity, { model: strapi.models.album });
    });
  }
};
