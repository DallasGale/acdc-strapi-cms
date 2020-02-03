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
      entities = await strapi.services.album.search(ctx.query);
    } else {
      console.log("finding...");
      // ? Sorting the JSON response
      // todo: Sort by release date.
      entities = await strapi.services.album.find({
        _sort: "id:asc"
      });
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
    let ALBUM_LENGTH = [];

    for (let i = 0; i < entities.length; i++) {
      // * Songs...
      // ? Remove ID's from songs (A)...
      entities[i].sideA[0].songs.map(song => {
        delete song.id;
      });
      entities[i].sideB[0].songs.map(song => {
        delete song.id;
      });

      entities[i].performers.map(performer => {
        delete performer.id;
      });

      entities[i].producers.map(producer => {
        delete producer.id;
      });

      const TRACK_COUNT =
        entities[i].sideA[0].songs.length + entities[i].sideB[0].songs.length;

      // const MUSICIANS = entities[i].musicians.map(i => i.name));

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
        songs: {
          sideA: entities[i].sideA[0].songs,
          sideB: entities[i].sideB[0].songs
        }
      });
    }

    return API_OUTPUT.map(entity => {
      console.log("entity", entity);
      return sanitizeEntity(entity, { model: strapi.models.album });
    });
  }
};
