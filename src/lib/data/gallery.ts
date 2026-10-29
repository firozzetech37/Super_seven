export type Photo = { src: string; alt: string; width: number; height: number };

export type Album = { id: string; title: string; description: string; year: string; photos: Photo[] };

/** Photos carried over from the 2014 site (slider, home-page slides and match cards). */
export const albums: Album[] = [
  {
    id: "youth-national-17",
    title: "17th Youth National Championship (Under-23 Boys)",
    description: "Mussoorie. Organised with the Mussoorie Sports Association, Mussoorie Cricket Association and Khelo India.",
    year: "Youth National",
    photos: [
      { src: "/legacy/slide2.jpg", alt: "Banner of the 17th Youth National Super Seven Cricket Championship (Under-23 Boys)", width: 500, height: 292 },
      { src: "/legacy/slide1.jpg", alt: "Two teams lined up before a match at the 17th Youth National Championship", width: 500, height: 292 },
      { src: "/legacy/slide3.jpg", alt: "Players and officials gathered on the ground in Mussoorie", width: 500, height: 292 },
      { src: "/legacy/slide4.jpg", alt: "Guests and officials seated at the championship ceremony", width: 500, height: 292 },
      { src: "/legacy/slide6.jpg", alt: "Officials in front of the championship banner", width: 500, height: 292 },
      { src: "/legacy/slide5.jpg", alt: "An official in a cap at the Mussoorie bazaar during the championship", width: 500, height: 292 },
    ],
  },
  {
    id: "ncl-s7-amroha-2014",
    title: "NCL S7 Amroha 2014",
    description: "National Cricket League Super 7 at Abbasi Cricket Ground, Amroha, 22–25 June 2014.",
    year: "2014",
    photos: [
      { src: "/legacy/homepage-2slide.jpg", alt: "The winning team with the NCL S7 trophy and the winners' banner", width: 500, height: 292 },
      { src: "/legacy/homepage--4slide.jpg", alt: "Trophy presentation to an official at Abbasi Cricket Ground", width: 500, height: 292 },
      { src: "/legacy/homepage-1slide.jpg", alt: "Federation officials at the tournament office", width: 500, height: 292 },
      { src: "/legacy/home-page--3slide.jpg", alt: "Feroz, Bobby and Satyan, honorary advisors to Super 7", width: 500, height: 292 },
      { src: "/legacy/match/final-match.jpg", alt: "Uttar Pradesh (Host), winners of the final", width: 200, height: 150 },
      { src: "/legacy/match/semi-final-match-1.jpg", alt: "Players lined up before semi-final 1", width: 200, height: 150 },
      { src: "/legacy/match/semi-final-match-2.jpg", alt: "Mumbai celebrate with the trophy after semi-final 2", width: 200, height: 150 },
    ],
  },
];

/** Press clippings on the old site, counted per year. The scans are being migrated. */
export const pressYears: { year: string; count: number }[] = [
  { year: "2003", count: 6 },
  { year: "2004", count: 3 },
  { year: "2005", count: 3 },
  { year: "2006", count: 3 },
  { year: "2008", count: 3 },
  { year: "2009", count: 2 },
  { year: "2014", count: 21 },
  { year: "2016", count: 1 },
];

/**
 * Featured YouTube video id. The two embeds on the old site (6Wii5Uk06GY, PBvO4R8qe2s) are template leftovers,
 * not SSCFI footage, so nothing is embedded until SSCFI picks a video from its channel.
 */
export const featuredVideo: { id: string; title: string } | null = null;
