/** `caption` replaces `alt` under the photo in the viewer when the visible text should differ from the description. */
export type Photo = { src: string; alt: string; width: number; height: number; caption?: string };

const pic = (file: string, width: number, height: number, alt: string): Photo => ({ src: `/legacy/pictures/${file}`, alt, width, height });

export type Album = { id: string; title: string; description: string; year: string; photos: Photo[] };

/** Every photo from the old site: slider, home-page slides, match cards and the 36 pictures of pictures.html, grouped by event. */
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
    id: "sub-junior-national-14",
    title: "14th Sub-Junior National Championship (Under-15 Boys)",
    description: "Ryan International School, 6–8 January 2017. Organised by the Rajasthan Super Seven Cricket Association.",
    year: "2017",
    photos: [
      pic("picture27.jpg", 1280, 960, "Teams and officials in front of the tournament banner at Ryan International School"),
      pic("picture35.jpg", 1280, 960, "A team in red with officials under the 14th Sub-Junior National banner"),
      pic("picture26.jpg", 852, 640, "Two squads and officials gather on the ground for a group photo"),
      pic("picture30.jpg", 1280, 720, "Officials greet the players before a match"),
      pic("picture29.jpg", 852, 640, "A team in blue with its officials on the ground"),
      pic("picture31.jpg", 1280, 720, "Officials shake hands with the young players"),
      pic("picture28.jpg", 852, 640, "The group photo, from a little further back"),
      pic("picture32.jpg", 1280, 720, "An official meets a player in front of the school buildings"),
      pic("picture34.jpg", 852, 640, "A wider view of the squads and officials"),
      pic("picture33.jpg", 852, 640, "The group photo, a moment later"),
    ],
  },
  {
    id: "ncl-s7-amroha-2014",
    title: "NCL S7 Amroha 2014",
    description: "National Cricket League Super 7 at Abbasi Cricket Ground, Amroha, 22–25 June 2014.",
    year: "2014",
    photos: [
      { src: "/legacy/homepage-2slide.jpg", alt: "The winning team with the NCL S7 trophy and the winners' banner", width: 500, height: 292 },
      pic("picture21.jpg", 640, 480, "A team in red lines up under the lights on the AMROHA lettering, 21 June 2014"),
      pic("picture22.jpg", 1024, 682, "A team in black lines up along the red carpet on opening night"),
      pic("picture12.jpg", 1024, 682, "Players in white hold the national flag at the opening ceremony"),
      pic("picture13.jpg", 1024, 682, "Flag bearers line up beside the ABBASI CRICKET lettering on the outfield"),
      pic("picture17.jpg", 1024, 682, "A batter takes guard under the lights, with the Abbasi Cricket Academy board behind"),
      pic("picture18.jpg", 640, 480, "A team in grey kit in front of the league banner, 22 June 2014"),
      pic("picture19.jpg", 1024, 682, "A batter drives through the off side as spectators watch from the tent"),
      pic("picture23.jpg", 2048, 1365, "A guest bowls the ceremonial first ball as officials look on"),
      pic("picture16.jpg", 2048, 1365, "Officials greet a team in orange before their match"),
      pic("picture25.jpg", 2048, 1374, "Guests shake hands with the players before a night match"),
      pic("picture14.jpg", 2048, 1365, "A memento is presented at the Abbasi Group of Educational & Sports Institutions stand"),
      pic("picture15.jpg", 2048, 1365, "Guests exchange greetings at the Abbasi Group stand"),
      pic("picture24.jpg", 2048, 1365, "Officials and the chief guest at Abbasi Cricket Ground"),
      pic("picture20.jpg", 1400, 866, "A team in black with its trophy in front of the league banner"),
      { src: "/legacy/homepage--4slide.jpg", alt: "Trophy presentation to an official at Abbasi Cricket Ground", width: 500, height: 292 },
      { src: "/legacy/homepage-1slide.jpg", alt: "Federation officials at the tournament office", width: 500, height: 292 },
      { src: "/legacy/home-page--3slide.jpg", alt: "Feroz, Bobby and Satyan, honorary advisors to Super 7", width: 500, height: 292 },
      { src: "/legacy/match/final-match.jpg", alt: "Uttar Pradesh (Host), winners of the final", width: 200, height: 150 },
      { src: "/legacy/match/semi-final-match-1.jpg", alt: "Players lined up before semi-final 1", width: 200, height: 150 },
      { src: "/legacy/match/semi-final-match-2.jpg", alt: "Mumbai celebrate with the trophy after semi-final 2", width: 200, height: 150 },
    ],
  },
  {
    id: "amroha-premier-league-2013",
    title: "Abbasi Amroha Premier League 2013",
    description: "Prize-giving at Abbasi Cricket Ground, Amroha.",
    year: "2013",
    photos: [
      pic("picture4.png", 516, 299, "A team in blue holds the trophy in front of the Abbasi Amroha Premier League 2013 banner"),
      pic("picture6.png", 605, 397, "Trophies laid out for the prize-giving under the league banner"),
      pic("picture5.png", 606, 364, "A speaker at the prize-giving table, lined with trophies"),
    ],
  },
  {
    id: "archive",
    title: "More from the archive",
    description: "Photos from the old site's gallery that carry no event name. SSCFI will add where and when each was taken.",
    year: "Undated",
    photos: [
      pic("picture1.jpg", 2048, 1494, "A girls' team with the trophy and guests under a championship banner"),
      pic("picture11.png", 800, 600, "A team in navy celebrates with its trophies"),
      pic("picture.jpg", 482, 320, "An official presents a trophy"),
      pic("picture2.jpg", 482, 320, "A player receives a trophy from an official"),
      pic("picture3.png", 530, 259, "Players in yellow walk off with the umpires"),
      pic("picture10.png", 800, 600, "Officials and players line up outside the pavilion"),
      pic("picture9.png", 320, 240, "Players and officials outside the pavilion"),
      pic("picture7.png", 320, 240, "Two teams line up at the start of a match"),
      pic("picture8.png", 320, 240, "Guests watch from the shade of the tent"),
    ],
  },
];

/** A newspaper cutting: `caption` is the headline (translated where the paper is not in English), `source` the paper and date. */
export type Clipping = Photo & { year: string; source?: string };

const clip = (year: string, file: string, width: number, height: number, caption: string, source?: string): Clipping => ({
  src: `/legacy/press/${year}/${file}`,
  alt: `Newspaper clipping${source ? ` from ${source}` : ""}, ${year}: ${caption}`,
  width,
  height,
  year,
  source,
  caption,
});

/**
 * Every press clipping from the old media.html, oldest first. Scans are capped at 2400px on the long side.
 * Two untitled crops (media.jpg, media1.jpg) are left out: both are cut from the Amar Ujala page in 2005/2.jpg.
 * 2014/21-27June.jpg was a broken link on the old site (the server file is 21-27june.jpg); it is restored here.
 */
export const clippings: Clipping[] = [
  clip("2003", "1.jpg", 993, 1075, "National Super Seven championship to start on 15 May", "Dainik Jagran"),
  clip("2003", "2.jpg", 2400, 1341, "Delhi eves, MP boys lift Super Seven Cricket trophy"),
  clip("2003", "3.jpg", 1994, 2400, "Madhya Pradesh and Haryana win the Super Seven trophy", "22 May"),
  clip("2003", "4.jpg", 1981, 2400, "Super Seven cricket gives more entertainment in less time"),
  clip("2003", "5.jpg", 1800, 2400, "Haryana win the women's title, Madhya Pradesh the men's", "Amar Ujala"),
  clip("2003", "6.jpg", 2186, 2400, "MP and Haryana win the Super Seven trophy", "Dainik Jagran"),
  clip("2004", "1.jpg", 2018, 2400, "“If we want medals, players need facilities”: District Magistrate", "Dainik Jagran"),
  clip("2004", "2.jpg", 1606, 2400, "Madhya Pradesh and Delhi win the Super Seven event"),
  clip("2004", "3.jpg", 1905, 2400, "Organisers should lift the players' morale too", "Amar Ujala"),
  clip("2005", "1.jpg", 1669, 2400, "Saharanpur, Agra and Gautam Buddh Nagar into the next round", "Amar Ujala"),
  clip("2005", "2.jpg", 1736, 2400, "Prize-giving of the state Super Seven championship", "Amar Ujala · 16 May"),
  clip("2005", "3.jpg", 2400, 1512, "Shah's heroics go in vain: Laxmikant, Roopesh shine in Saurashtra's 8-run win"),
  clip("2006", "1.jpg", 1878, 2400, "Gautam Buddh Nagar men and Aligarh women win", "Amar Ujala"),
  clip("2006", "2.jpg", 1913, 2400, "4th Senior National championship opens amid cultural programmes", "Amar Ujala"),
  clip("2006", "3.jpg", 1820, 1377, "Haryana and Uttar Pradesh to meet in the 4th Senior National final", "Amar Ujala · 31 Dec"),
  clip("2008", "1.jpg", 2400, 2023, "Youth National Super Seven championship begins", "Amar Ujala"),
  clip("2008", "2.jpg", 1568, 2400, "Gautam Buddh Nagar win the championship", "Dainik Jagran"),
  clip("2008", "3.jpg", 2400, 1436, "Jharkhand, Haryana and UP dominate as the 6th Youth National opens"),
  clip("2009", "1.jpg", 1163, 936, "32 teams to play in the 7th Senior National championship at Lehragaga"),
  clip("2009", "2.jpg", 2026, 1637, "7th National Super Seven Cricket Championship begins"),
  clip("2014", "1-21june.jpg", 2400, 1298, "National Cricket League starts today, with 28 teams from across India", "Amar Ujala · 21 June"),
  clip("2014", "2-21june.jpg", 1463, 1846, "NCL Super Seven 2014 starts today", "Hindustan · 21 June"),
  clip("2014", "3-22june.jpg", 1531, 2369, "A grand start to the National Cricket League", "Amar Ujala · 22 June"),
  clip("2014", "4-23june.jpg", 2400, 1615, "Puducherry, Haryana and Rajasthan win", "Hindustan · 23 June"),
  clip("2014", "5-23june.jpg", 2400, 1006, "Sport strengthens goodwill", "Amar Ujala · 23 June"),
  clip("2014", "6-23june.jpg", 1440, 2363, "Sport matters for harmony: Super 7 opens at Abbasi College", "23 June"),
  clip("2014", "7-23june.jpg", 1422, 2400, "Cricket teams from many states meet at Abbasi", "Daily Sahafat · 23 June"),
  clip("2014", "8-24June.jpg", 2400, 1235, "UP Host and Mumbai head for a title clash", "Shah Times · 24 June"),
  clip("2014", "9-24June.jpg", 1337, 2400, "Semi-finals today", "Amar Ujala · 24 June"),
  clip("2014", "10-24June.jpg", 2400, 1413, "UP beat Punjab by 100 runs; Mumbai and NCR win too", "Amar Ujala · 24 June"),
  clip("2014", "11-24June.jpg", 2400, 1781, "MP Parvez Hashmi meets the players at Abbasi Academy", "Daily Sahafat · 24 June"),
  clip("2014", "12-25June.jpg", 2400, 1382, "“India has no shortage of cricket talent”: Parvez", "Shah Times · 25 June"),
  clip("2014", "13-25June.jpg", 1978, 2288, "Four teams win their quarter-finals", "Hindustan · 25 June"),
  clip("2014", "14-26June.jpg", 2400, 1813, "UP Host beat Mumbai in the final; Jitendra man of the match and series", "26 June"),
  clip("2014", "15-26June.jpg", 2400, 1987, "UP Host and Mumbai reach the NCL final", "Awam-e-Hind · 26 June"),
  clip("2014", "16-26June.jpg", 1197, 1180, "Mohammad Nafees Abbasi releases a book on Amroha cricket", "Super News Leader · 26 June"),
  clip("2014", "17-27June.jpg", 1477, 2400, "UP Host beat Mumbai by 59 runs to take the trophy", "Amar Ujala · 27 June"),
  clip("2014", "18-27June.jpg", 1165, 1235, "Book on Amroha's cricket stars released", "Awam-e-Hind · 27 June"),
  clip("2014", "19-27June.jpg", 2400, 1725, "UP crowned National League champions", "Hindustan · 27 June"),
  clip("2014", "20-27June.jpg", 2359, 1470, "UP Host are National Cricket League champions", "Dainik Jagran · 27 June"),
  clip("2014", "21-27June.jpg", 1813, 2400, "UP Host beat Mumbai to become champions; Jitendra man of the match", "Shah Times · 27 June"),
  clip("2016", "27-08-16-1.jpg", 800, 1774, "Abbasi Cricket Academy win the title", "Dainik Jagran · 27 Aug"),
];

/**
 * Featured YouTube video id. The two embeds on the old site (6Wii5Uk06GY, PBvO4R8qe2s) are template leftovers,
 * not SSCFI footage, so nothing is embedded until SSCFI picks a video from its channel.
 */
export const featuredVideo: { id: string; title: string } | null = null;
