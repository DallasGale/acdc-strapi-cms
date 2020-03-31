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
        _sort: "id:asc",
        _limit: 230
      });
    }

    let id = 0;
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
      if (
        album_entities[i].id !== null ||
        typeof album_entities[i].id !== "undefined"
      ) {
        id = album_entities[i].id;
      }

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

        // const sideAsongTitle = sideAsong_list.map(i => i.title)

        // if (sideAsong_list.includes())

        // console.log("hash", hash);
        // console.log(
        //   "allSongs",
        //   allSongs.map(i => i.title)
        // );
        // console.log(
        //   "sideA song_list",
        //   sideAsong_list.map(i => i.title)
        // );
        // allSongs.map(i => i.title);
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
        if (album_entities[i].bSideTracks.length === 2) {
          delete album_entities[i].bSideTracks[1].song.writingCredits;
        }
        if (album_entities[i].bSideTracks.length === 3) {
          delete album_entities[i].bSideTracks[2].song.writingCredits;
        }
        if (album_entities[i].bSideTracks.length === 4) {
          delete album_entities[i].bSideTracks[3].song.writingCredits;
        }

        if (album_entities[i].bSideTracks.length === 5) {
          delete album_entities[i].bSideTracks[4].song.writingCredits;
        }
        // delete album_entities[i].bSideTracks[4].song.writingCredits;
        deleteTitle(album_entities[i].bSideTracks);
        deleteId(album_entities[i].bSideTracks);
        sideB = album_entities[i].bSideTracks;
      } else {
        sideB = [];
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
        singles = album_entities[i].singles[0].songs;
        const allSongs = song_entities.map(song => song);
        singles.map((a, i) => {
          // console.log("single", a, i);
          allSongs.map((b, c) => {
            // console.log("allSongs", b, c);
            if (b.title === a.title) {
              singles[i] = allSongs[c];
              delete singles[i].id;

              if (singles[i].albumSingle.length) {
                singles[i].details = singles[i].albumSingle;
                // // delete singles[i].albumSingle;

                // // if (singles[i].details[0].id) {
                // //   delete singles[i].details[0].id;
                // // }

                // // if (singles[i].single) {
                // //   delete singles[i].single;
                // // }

                if (singles[i].albums) {
                  delete singles[i].albums;
                }

                if (singles[i].isLiveRecording) {
                  delete singles[i].isLiveRecording;
                }

                if (singles[i].liveAlbum) {
                  delete singles[i].liveAlbum;
                }
                // if (singles[i].details[0]) {
                //   // delete singles[i].details[0].id;

                //   singles[i].monthReleasedUK =
                //     singles[i].details[0].MonthReleasedUK;
                //   // delete singles[i].details[0].MonthReleasedUK;

                //   singles[i].monthReleasedUS =
                //     singles[i].details[0].MonthReleasedUS;
                //   // delete singles[i].details[0].MonthReleasedUS;

                //   singles[i].releasedYearUK =
                //     singles[i].details[0].releasedYearUK;
                //   // delete singles[i].details[0].releasedYearUK;

                //   singles[i].releasedYearUS =
                //     singles[i].details[0].releasedYearUS;
                //   // delete singles[i].details[0].releasedYearUS;

                //   singles[i].releasedAus = singles[i].details[0].releasedAus;
                //   // delete singles[i].details[0].releasedAus;

                //   singles[i].industryCharts =
                //     singles[i].details[0].industryCharts;
                //   // delete singles[i].details[0].industryCharts;

                //   singles[i].unitsSold = singles[i].details[0].unitsSold;
                //   // delete singles[i].details[0].unitsSold;

                //   singles[i].coverArt = singles[i].details[0].coverArt;
                //   // delete singles[i].details[0].coverArt;

                //   singles[i].bSide = singles[i].details[0].bSide;
                //   // delete singles[i].details[0].bSide;

                //   singles[i].released = singles[i].details[0].released;
                //   // delete singles[i].details[0].released;

                //   singles[i].releaseYear = singles[i].details[0].releaseYear;
                //   // delete singles[i].details[0].releaseYear;

                //   singles[i].monthReleased = singles[i].details[0].monthReleased;
                //   // delete singles[i].details[0].monthReleased;

                //   singles[i].releasedUS = singles[i].details[0].ReleasedUS;
                //   // delete singles[i].details[0].ReleasedUS;

                //   singles[i].releasedUK = singles[i].details[0].ReleasedUK;
                //   // delete singles[i].details[0].ReleasedUK;

                //   singles[i].monthReleasedUK =
                //     singles[i].details[0].MonthReleasedUK;
                //   // delete singles[i].details[0].MonthReleasedUK;

                //   singles[i].monthReleasedUS =
                //     singles[i].details[0].MonthReleasedUS;
                //   // delete singles[i].details[0].MonthReleasedUS;

                //   singles[i].releasedYearUK =
                //     singles[i].details[0].releasedYearUK;
                //   // delete singles[i].details[0].releasedYearUK;

                //   singles[i].releasedYearUS =
                //     singles[i].details[0].releasedYearUS;
                //   // delete singles[i].details[0].releasedYearUS;

                //   singles[i].releasedAus = singles[i].details[0].releasedAus;
                //   // delete singles[i].details[0].releasedAus;

                //   singles[i].details = singles[i].details[0].details;
                //   // delete singles[i].details[0].details;
                // }
              }
            }
          });
        });
      } else {
        singles = [];
      }

      // * Artwork image...
      // if (typeof album_entities[i].coverArt.image !== "undefined") {
      //   // console.log("album_entities[i].coverArt.image", album_entities[i].coverArt.image);

      //   artwork.format = album_entities[i].coverArt.image.ext;
      //   artwork.url = album_entities[i].coverArt.image.url;
      //   artwork.size = album_entities[i].coverArt.image.size;
      // } else {
      //   artwork.format = null;
      //   artwork.url = null;
      //   artwork.size = null;
      // }

      // // * Artwork details...
      // if (album_entities[i].coverArt.length) {
      //   if (album_entities[i].coverArt.isEuropean) {
      //     artwork.version = "eu";
      //   } else if (album_entities[i].coverArt.isNorthAmerican) {
      //     artwork.version = "us";
      //   } else if (album_entities[i].coverArt.isAustralian) {
      //     artwork.version = "au";
      //   } else {
      //     artwork.version = null;
      //   }

      //   artwork.source = album_entities[i].coverArt.source;
      //   artwork.artist = album_entities[i].coverArt.artist;
      // } else {
      //   artwork.source = null;
      //   artwork.artist = null;
      // }

      API_OUTPUT.push({
        id,
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
        singles
        // artwork: {
        //   format: artwork.ext,
        //   size: artwork.size,
        //   url: artwork.url,
        //   source: artwork.source,
        //   version: artwork.version,
        //   artist: artwork.artist
        // }
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
    console.log("song_entities");

    return API_OUTPUT.map(entity => {
      return sanitizeEntity(entity, { model: strapi.models.album });
    });
  }
};
