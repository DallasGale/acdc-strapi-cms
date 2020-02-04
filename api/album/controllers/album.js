"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require("strapi-utils");
const helpers = require("../../_helpers");

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
      // ? Sorting the JSON response
      // todo: Sort by release date.
      entities = await strapi.services.album.find({
        _sort: "id:asc"
      });
      // console.log("entities", entities[0].sideA[0]);
    }

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

    // let response = [
    //   {
    //     title: "",
    //     songs: [{}]
    //   }
    // ];
    // let sideA = [];

    // if (entities[0].sideA.length > 0) {
    //   const sideA = entities[0].sideA[0].songs;
    //   response[0].songs.push(sideA);
    // }
    // if (entities[0].sideB.length > 0) {
    //   const sideB = entities[0].sideB[0].songs;
    //   response[0].songs.push(sideB);
    // }

    let API_OUTPUT = [];

    // console.time("for");
    for (let i = 0; i < entities.length; i++) {
      // * Songs...
      // ? Remove ID's from songs (A)...
      helpers.deleteId(entities[i].sideA[0].songs);
      helpers.deleteId(entities[i].sideB[0].songs);
      helpers.deleteId(entities[i].producers);
      helpers.deleteId(entities[i].performers);
      helpers.deleteId(entities[i].charts);
      helpers.deleteId(entities[i].certified);

      const TRACK_COUNT =
        entities[i].sideA[0].songs.length + entities[i].sideB[0].songs.length;

      API_OUTPUT.push({
        title: entities[i].title,
        trackCount: TRACK_COUNT,
        worldwideReleaseDate: entities[i].worldwideReleaseDate,
        europeanReleaseDate: entities[i].europeanReleaseDate,
        australianReleaseDate: entities[i].australianReleaseDate,
        isStudioRecording: entities[i].isStudioRecording,
        isLiveRecording: entities[i].isLiveRecording,
        musicians: entities[i].performers,
        producers: entities[i].producers,
        industryCharts: entities[i].charts,
        certifications: entities[i].certified,
        trackListing: {
          sideA: entities[i].sideA[0].songs,
          sideB: entities[i].sideB[0].songs
        },
        artwork: {
          front: {
            artist: "tbc",
            format: entities[i].coverArt.ext,
            size: entities[i].coverArt.size,
            url: entities[i].coverArt.url
          },
          back: {
            artist: "tbc",
            format: entities[i].coverArt.ext,
            size: entities[i].coverArt.size,
            url: entities[i].coverArt.url
          }
        }
      });
    }
    // console.timeEnd("for");
    console.log("entities", entities[0]);
    // console.log("API_OUTPUT", API_OUTPUT);
    return API_OUTPUT.map(entity => {
      console.log("entity", entity);
      return sanitizeEntity(entity, { model: strapi.models.album });
    });
  }
};
