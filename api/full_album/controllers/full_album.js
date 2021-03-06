"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

var unionBy = require("lodash.unionby");

const { convertRestQueryParams, sanitizeEntity } = require("strapi-utils");

function deleteId(array) {
  array.map(arr => {
    delete arr.id;
  });
}

function deleteWritenBy(array) {
  array.map(arr => {
    // if (arr.writingCredits) {
    delete arr.writingCredits;
    // } else return;
  });
}

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let album_entities;
    let song_entities;

    if (ctx.query._q) {
      console.log("searching...");
      album_entities = await strapi.services.album.search(ctx.query);
      song_entities = await strapi.services.song.search(ctx.query);
    } else {
      console.log("finding...");
      album_entities = await strapi.services.album.find({
        _sort: "releaseDate:asc"
      });
      song_entities = await strapi.services.song.find({
        _sort: "id:desc"
      });
    }

    let title = null;
    let trackCount = 0;
    let releaseDate = null;
    let isStudioRecording = false;
    let isLiveRecording = false;
    let musicians = [];
    let producers = [];
    let producedAt = [];
    let publisher = [];
    let label = [];
    let charts = [];
    let certification = [];
    let sideA = [];
    let sideB = [];
    let sideC = [];
    let sideD = [];
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

    // const songMap = song_entities.reduce(map => map);
    // console.log("songMap", songMap);

    for (let i = 0; i < album_entities.length; i++) {
      // * Title...
      if (
        album_entities[i].title !== null ||
        typeof album_entities[i].title !== "undefined"
      ) {
        title = album_entities[i].title;
      }

      // * Release date...
      if (album_entities[i].releaseDate !== null) {
        releaseDate = album_entities[i].releaseDate;
      }

      // * Studio Recording...
      if (
        album_entities[i].isStudioRecording !== null ||
        typeof album_entities[i].isStudioRecording !== "undefined"
      ) {
        isStudioRecording = album_entities[i].isStudioRecording;
      }

      // * Live Recording...
      if (
        album_entities[i].isLiveRecording !== null ||
        typeof album_entities[i].isLiveRecording !== "undefined"
      ) {
        isLiveRecording = album_entities[i].isLiveRecording;
      }

      // * Musicians...
      if (
        album_entities[i].performers !== null ||
        typeof album_entities[i].performers !== "undefined"
      ) {
        // deleteId(album_entities[i].performers);
        musicians = album_entities[i].performers;
      }

      // * Producers...
      if (
        album_entities[i].producers !== null ||
        typeof album_entities[i].producers !== "undefined"
      ) {
        // deleteId(album_entities[i].producers);
        producers = album_entities[i].producers;
      }

      // * Produced at...
      if (
        album_entities[i].studios !== null ||
        typeof album_entities[i].studios !== "undefined"
      ) {
        // deleteId(album_entities[i].producers);
        producedAt = album_entities[i].studios;
      }

      // * Publisher...
      if (album_entities[i].publisher !== null) {
        // deleteId(album_entities[i].producers);
        publisher = album_entities[i].publisher;
      }

      // * Labels...
      if (
        album_entities[i].labels !== null ||
        typeof album_entities[i].labels !== "undefined"
      ) {
        // deleteId(album_entities[i].producers);
        label = album_entities[i].labels;
      } else {
        label = [];
      }

      // * Charts...
      if (album_entities[i].charts !== null) {
        // deleteId(album_entities[i].charts);
        charts = album_entities[i].charts;
      }

      // * Certification...
      if (album_entities[i].units !== null) {
        // deleteId(album_entities[i].units);
        certification = album_entities[i].units;
      }

      // * Track Count...
      if (album_entities[i].sideA.length) {
        deleteWritenBy(album_entities[i].sideA[0].songs);

        album_entities[i].sideA.forEach(songA => {
          let extended_song = {};
          song_entities.map(song => {
            if (song.id === songA.id) {
              extended_song = songA;
              extended_song.singleInfo = song.singleInfo;
              sideA.push(extended_song);
            }
          });
        });

        sideA = album_entities[i].sideA[0].songs;
        trackCount = album_entities[i].sideA[0].songs.length;
      } else {
        sideA = [];
        trackCount = 0;
      }

      // * Track Count...
      if (album_entities[i].sideB.length) {
        // deleteId(album_entities[i].sideB[0].songs);
        deleteWritenBy(album_entities[i].sideB[0].songs);
        sideB = album_entities[i].sideB[0].songs;
        trackCount += album_entities[i].sideB[0].songs.length;
      } else {
        sideB = [];
      }

      // * Track Count...
      if (album_entities[i].sideC.length) {
        // deleteId(album_entities[i].sideB[0].songs);
        deleteWritenBy(album_entities[i].sideC[0].songs);
        sideC = album_entities[i].sideC[0].songs;
        trackCount += album_entities[i].sideC[0].songs.length;
      } else {
        sideC = [];
      }

      // * Track Count...
      if (album_entities[i].sideD.length) {
        // deleteId(album_entities[i].sideB[0].songs);
        deleteWritenBy(album_entities[i].sideD[0].songs);
        sideD = album_entities[i].sideD[0].songs;
        trackCount += album_entities[i].sideD[0].songs.length;
      } else {
        sideD = [];
      }

      // * Singles...
      if (album_entities[i].singles.length) {
        // deleteId(album_entities[i].singles[0].songs);
        deleteWritenBy(album_entities[i].singles[0].songs);
        singles = album_entities[i].singles[0].songs;
      } else {
        singles = [];
      }

      // * Artwork image...
      if (typeof album_entities[i].coverArt.image !== "undefined") {
        // console.log("album_entities[i].coverArt.image", album_entities[i].coverArt.image);

        artwork.format = album_entities[i].coverArt.image.ext;
        artwork.url = album_entities[i].coverArt.image.url;
        artwork.size = album_entities[i].coverArt.image.size;
      } else {
        artwork.format = null;
        artwork.url = null;
        artwork.size = null;
      }

      // * Artwork details...
      if (album_entities[i].coverArt.length) {
        if (album_entities[i].coverArt.isEuropean) {
          artwork.version = "eu";
        } else if (album_entities[i].coverArt.isNorthAmerican) {
          artwork.version = "us";
        } else if (album_entities[i].coverArt.isAustralian) {
          artwork.version = "au";
        } else {
          artwork.version = null;
        }

        artwork.source = album_entities[i].coverArt.source;
        artwork.artist = album_entities[i].coverArt.artist;
      } else {
        artwork.source = null;
        artwork.artist = null;
      }

      API_OUTPUT.push({
        title,
        trackCount,
        isInternational: album_entities[i].isInternationalVersion,
        isAustralian: album_entities[i].isAustralianVersion,
        isNorthAmerican: album_entities[i].isNorthAmericanVersion,
        isEuropean: album_entities[i].isEuropeanVersion,
        isJapanese: album_entities[i].isJapaneseVersion,
        releaseDate,
        isStudioRecording,
        isLiveRecording,
        musicians,
        producers,
        producedAt,
        publisher,
        label,
        charts,
        certification,
        sideA,
        sideB,
        sideC,
        sideD,
        singles,
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

    // console.log("sideA", album_entities);
    // console.log("song_entities", song_entities);

    console.log(API_OUTPUT);
    return API_OUTPUT.map(entity => {
      return sanitizeEntity(entity, { model: strapi.models.album });
    });
  }
};
