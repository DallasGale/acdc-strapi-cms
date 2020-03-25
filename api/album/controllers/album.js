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
function deleteTitle(array) {
  array.map(arr => {
    delete arr.title;
  });
}

function deleteWritenBy(array) {
  array.map(song => {
    delete song.song.writingCredits;
  });
}

function removeDuplicates(array) {
  let a = [];
  array.map(x => {
    if (!a.includes(x)) {
      a.push(x);
    }

    console.log("a", a);
    return a;
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
    let sideBB = [];
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
        certification = album_entities[i].units;
      }

      if (album_entities[i].aSideTracks.length > 0) {
        album_entities[i].aSideTracks.map(i => {
          delete i.song.writingCredits;
        });
        deleteTitle(album_entities[i].aSideTracks);
        deleteId(album_entities[i].aSideTracks);
        sideA = album_entities[i].aSideTracks;
      } else {
        sideA = [];
        trackCount = 0;
      }

      if (album_entities[i].bSideTracks.length > 0) {
        // album_entities[i].bSideTracks.map(i => {
        //   console.log("b", i);
        //   delete i.song.writingCredits;
        // });

        delete album_entities[i].bSideTracks[0].song.writingCredits;
        deleteTitle(album_entities[i].bSideTracks);
        deleteId(album_entities[i].bSideTracks);
        sideBB = album_entities[i].bSideTracks;
      } else {
        sideBB = [];
        trackCount = 0;
      }

      if (album_entities[i].cSideTracks.length > 0) {
        // album_entities[i].cSideTracks.map(i => {
        //   delete i.song.writingCredits;
        // });
        deleteTitle(album_entities[i].cSideTracks);
        deleteId(album_entities[i].cSideTracks);
        sideC = album_entities[i].cSideTracks;
      } else {
        sideC = [];
        trackCount = 0;
      }

      if (album_entities[i].dSideTracks.length > 0) {
        // album_entities[i].dSideTracks.map(i => {
        //   delete i.song.writingCredits;
        // });
        deleteTitle(album_entities[i].dSideTracks);
        deleteId(album_entities[i].dSideTracks);
        sideD = album_entities[i].dSideTracks;
      } else {
        sideD = [];
        trackCount = 0;
      }

      // * Singles...
      if (album_entities[i].singles.length) {
        // deleteId(album_entities[i].singles[0].songs);
        // deleteWritenBy(album_entities[i].singles[0].songs);
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
        sideBB,
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

    // console.log(
    //   "album_entities",
    //   API_OUTPUT.map(i => i.sideA[0].songList.map(i => i))
    // );
    // removeDuplicates(sideA);
    // console.log(
    //   "aSideTracks",
    //   album_entities.map(i => i.aSideTracks.map(i => i.song))
    // );
    // console.log(
    //   "bSideTracks",
    //   album_entities.map(i => i.bSideTracks.map(i => i.song))
    // );
    // console.log("song_entities", song_entities);

    return API_OUTPUT.map(entity => {
      return sanitizeEntity(entity, { model: strapi.models.album });
    });
  }
};
