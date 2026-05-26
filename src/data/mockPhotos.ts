import type { CleanupReason, MemoryAlbum, MemoryPhoto } from "@/types/photo";

const image = (seed: string, width = 900, height = 700) => `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const cleanupReasonLabels: Record<CleanupReason, string> = {
  blurry_candidate: "흐릿할 수 있어요",
  duplicate_candidate: "비슷한 사진이 있어요",
  screenshot_candidate: "화면 캡처 같아요",
  document_candidate: "문서 사진 같아요",
  unknown_date: "날짜를 확인해 주세요",
  unknown_place: "장소를 확인해 주세요",
  unknown_person: "사람을 확인해 주세요"
};

const personDisplayNames: Record<string, string> = {
  Mom: "엄마",
  Dad: "아빠",
  Grandma: "할머니",
  Jisoo: "지수",
  Min: "민",
  "People unknown": "사람 확인 필요"
};

const placeDisplayNames: Record<string, string> = {
  "Place unknown": "장소 확인 필요",
  "Han River Park": "한강공원",
  "Grandma's house": "할머니 댁",
  "Gangneung beach": "강릉 바닷가",
  "Old family home": "예전 우리집",
  "Incheon Airport": "인천공항",
  "Gapyeong campground": "가평 캠핑장",
  "Apartment courtyard": "아파트 마당",
  "Family apartment": "우리집",
  "Seoul banquet hall": "서울 가족모임 장소"
};

const eventDisplayNames: Record<string, string> = {
  "Spring picnic": "봄 소풍",
  "Grandma birthday": "할머니 생신",
  "Summer trip": "여름 여행",
  "Old home memories": "예전 우리집 추억",
  "Europe trip": "유럽 여행",
  "Lunar new year": "설날 모임",
  "Graduation day": "졸업식",
  "Camping weekend": "캠핑 주말",
  "Chuseok gathering": "추석 모임",
  "Spring walk": "봄 산책",
  "Everyday memories": "일상의 추억",
  "New home": "새집 첫날",
  "Video call birthday": "영상통화 생일",
  "Jeju trip": "제주 여행",
  "Weekend hike": "주말 산행",
  "Family reunion": "가족 모임"
};

export const mockPhotos: MemoryPhoto[] = [
  {
    id: "p-001",
    title: "First picnic by the river",
    caption: "A quiet afternoon with everyone gathered around the lunch mat.",
    filename: "IMG_200104_river-picnic.jpg",
    thumbnailUrl: image("family-river-picnic", 900, 650),
    imageUrl: image("family-river-picnic-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-001",
    downloadUrl: "#",
    takenAt: "2001-04-22",
    datePrecision: "day",
    placeName: "Han River Park",
    people: ["Mom", "Dad", "Jisoo"],
    eventName: "Spring picnic",
    eventDateLabel: "April 2001",
    year: 2001,
    month: 4,
    reactionCount: 18,
    visibilityState: "active",
    cleanupReasons: [],
    isFeatured: true
  },
  {
    id: "p-002",
    title: "Grandma's birthday table",
    caption: "Candles, fruit, and the cake everyone remembers.",
    filename: "DCIM_2008_09_birthday.jpg",
    thumbnailUrl: image("grandma-birthday-table", 900, 720),
    imageUrl: image("grandma-birthday-table-large", 1500, 1200),
    originalUrl: "https://drive.google.com/mock/p-002",
    downloadUrl: "#",
    takenAt: "2008-09-14",
    datePrecision: "day",
    placeName: "Grandma's house",
    people: ["Grandma", "Mom", "Dad"],
    eventName: "Grandma birthday",
    eventDateLabel: "September 2008",
    year: 2008,
    month: 9,
    reactionCount: 31,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-003",
    title: "Beach walk after dinner",
    caption: "The sky turned pink before the family walked back to the pension.",
    filename: "beach-trip-2012-07.jpg",
    thumbnailUrl: image("family-beach-walk", 850, 1050),
    imageUrl: image("family-beach-walk-large", 1300, 1600),
    originalUrl: "https://drive.google.com/mock/p-003",
    downloadUrl: "#",
    takenAt: "2012-07-28",
    datePrecision: "day",
    placeName: "Gangneung beach",
    people: ["Mom", "Dad", "Min"],
    eventName: "Summer trip",
    eventDateLabel: "July 2012",
    year: 2012,
    month: 7,
    reactionCount: 24,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-004",
    title: "Snow day in the yard",
    caption: "A small snowman and a very cold family portrait.",
    filename: "winter_1999_scan.jpg",
    thumbnailUrl: image("family-snow-yard", 900, 700),
    imageUrl: image("family-snow-yard-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-004",
    downloadUrl: "#",
    takenAt: "1999-01-11",
    approximateDateLabel: "Winter 1999",
    datePrecision: "month",
    placeName: "Old family home",
    people: ["Mom", "Dad", "Jisoo", "Min"],
    eventName: "Old home memories",
    eventDateLabel: "Winter 1999",
    year: 1999,
    month: 1,
    reactionCount: 42,
    visibilityState: "active",
    cleanupReasons: [],
    isFeatured: true
  },
  {
    id: "p-005",
    title: "Airport before the first trip abroad",
    caption: "Suitcases lined up before boarding.",
    filename: "EUROPE_2016_001.jpg",
    thumbnailUrl: image("family-airport-trip", 900, 650),
    imageUrl: image("family-airport-trip-large", 1500, 1050),
    originalUrl: "https://drive.google.com/mock/p-005",
    downloadUrl: "#",
    takenAt: "2016-05-03",
    datePrecision: "day",
    placeName: "Incheon Airport",
    people: ["Mom", "Dad", "Jisoo"],
    eventName: "Europe trip",
    eventDateLabel: "May 2016",
    year: 2016,
    month: 5,
    reactionCount: 29,
    visibilityState: "active",
    cleanupReasons: [],
    isFeatured: true
  },
  {
    id: "p-006",
    title: "Unknown summer snapshot",
    caption: "A warm day from an old folder waiting for a better date.",
    filename: "scan_family_untitled_034.jpg",
    thumbnailUrl: image("unknown-summer-family", 900, 900),
    imageUrl: image("unknown-summer-family-large", 1400, 1400),
    originalUrl: "https://drive.google.com/mock/p-006",
    downloadUrl: "#",
    takenAt: null,
    approximateDateLabel: "Date unknown",
    datePrecision: "unknown",
    placeName: "Place unknown",
    people: ["People unknown"],
    year: null,
    month: null,
    reactionCount: 7,
    visibilityState: "active",
    cleanupReasons: ["unknown_date", "unknown_place", "unknown_person"]
  },
  {
    id: "p-007",
    title: "New year soup morning",
    caption: "Everyone came early, and the kitchen stayed busy all morning.",
    filename: "2002_newyear_breakfast.jpg",
    thumbnailUrl: image("family-new-year-soup", 900, 650),
    imageUrl: image("family-new-year-soup-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-007",
    downloadUrl: "#",
    takenAt: "2002-02-12",
    datePrecision: "day",
    placeName: "Grandma's house",
    people: ["Grandma", "Mom", "Dad", "Jisoo", "Min"],
    eventName: "Lunar new year",
    eventDateLabel: "February 2002",
    year: 2002,
    month: 2,
    reactionCount: 36,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-008",
    title: "School gate graduation",
    caption: "Flowers, certificates, and proud smiles at the front gate.",
    filename: "graduation_2005_02_18.jpg",
    thumbnailUrl: image("school-gate-graduation", 900, 700),
    imageUrl: image("school-gate-graduation-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-008",
    downloadUrl: "#",
    takenAt: "2005-02-18",
    datePrecision: "day",
    placeName: "Elementary school",
    people: ["Mom", "Dad", "Jisoo"],
    eventName: "Graduation day",
    eventDateLabel: "February 2005",
    year: 2005,
    month: 2,
    reactionCount: 27,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-009",
    title: "Camping stove dinner",
    caption: "A simple dinner tasted better after the tent was finally up.",
    filename: "camping_2006_08_12.jpg",
    thumbnailUrl: image("family-camping-stove", 900, 720),
    imageUrl: image("family-camping-stove-large", 1500, 1200),
    originalUrl: "https://drive.google.com/mock/p-009",
    downloadUrl: "#",
    takenAt: "2006-08-12",
    datePrecision: "day",
    placeName: "Gapyeong campground",
    people: ["Dad", "Jisoo", "Min"],
    eventName: "Camping weekend",
    eventDateLabel: "August 2006",
    year: 2006,
    month: 8,
    reactionCount: 22,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-010",
    title: "Blurry campfire laugh",
    caption: "The photo is soft, but the laugh is still worth reviewing.",
    filename: "campfire_blur_2006.jpg",
    thumbnailUrl: image("blurry-campfire-laugh", 900, 680),
    imageUrl: image("blurry-campfire-laugh-large", 1500, 1100),
    originalUrl: "https://drive.google.com/mock/p-010",
    downloadUrl: "#",
    takenAt: "2006-08-12",
    datePrecision: "day",
    placeName: "Gapyeong campground",
    people: ["Mom", "Dad", "Min"],
    eventName: "Camping weekend",
    eventDateLabel: "August 2006",
    year: 2006,
    month: 8,
    reactionCount: 13,
    visibilityState: "active",
    cleanupReasons: ["blurry_candidate"]
  },
  {
    id: "p-011",
    title: "Duplicate picnic frame",
    caption: "Almost the same pose as another picnic photo.",
    filename: "IMG_200104_river-picnic-copy.jpg",
    thumbnailUrl: image("family-river-picnic-copy", 900, 650),
    imageUrl: image("family-river-picnic-copy-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-011",
    downloadUrl: "#",
    takenAt: "2001-04-22",
    datePrecision: "day",
    placeName: "Han River Park",
    people: ["Mom", "Dad", "Jisoo"],
    eventName: "Spring picnic",
    eventDateLabel: "April 2001",
    year: 2001,
    month: 4,
    reactionCount: 9,
    visibilityState: "active",
    cleanupReasons: ["duplicate_candidate"],
    duplicateGroupId: "dup-picnic-001"
  },
  {
    id: "p-012",
    title: "Birthday cake close-up",
    caption: "A second angle from Grandma's birthday table.",
    filename: "DCIM_2008_09_birthday_2.jpg",
    thumbnailUrl: image("grandma-birthday-cake", 900, 700),
    imageUrl: image("grandma-birthday-cake-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-012",
    downloadUrl: "#",
    takenAt: "2008-09-14",
    datePrecision: "day",
    placeName: "Grandma's house",
    people: ["Grandma", "Mom"],
    eventName: "Grandma birthday",
    eventDateLabel: "September 2008",
    year: 2008,
    month: 9,
    reactionCount: 19,
    visibilityState: "active",
    cleanupReasons: ["duplicate_candidate"],
    duplicateGroupId: "dup-birthday-001"
  },
  {
    id: "p-013",
    title: "Bus window on the way south",
    caption: "Fields passed by while everyone settled into the trip.",
    filename: "summer_bus_2010.jpg",
    thumbnailUrl: image("summer-bus-window", 850, 1050),
    imageUrl: image("summer-bus-window-large", 1300, 1600),
    originalUrl: "https://drive.google.com/mock/p-013",
    downloadUrl: "#",
    takenAt: "2010-07-23",
    datePrecision: "day",
    placeName: "Jeolla road",
    people: ["Mom", "Min"],
    eventName: "Summer trip",
    eventDateLabel: "July 2010",
    year: 2010,
    month: 7,
    reactionCount: 15,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-014",
    title: "Temple courtyard group",
    caption: "A calm stop between a long drive and dinner.",
    filename: "temple_2010_07.jpg",
    thumbnailUrl: image("temple-courtyard-family", 900, 680),
    imageUrl: image("temple-courtyard-family-large", 1500, 1120),
    originalUrl: "https://drive.google.com/mock/p-014",
    downloadUrl: "#",
    takenAt: "2010-07-24",
    datePrecision: "day",
    placeName: "Suncheon temple",
    people: ["Mom", "Dad", "Jisoo", "Min"],
    eventName: "Summer trip",
    eventDateLabel: "July 2010",
    year: 2010,
    month: 7,
    reactionCount: 28,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-015",
    title: "Old living room scan",
    caption: "A scan from the old album with a date still to confirm.",
    filename: "scan_living_room_022.jpg",
    thumbnailUrl: image("old-living-room-scan", 900, 700),
    imageUrl: image("old-living-room-scan-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-015",
    downloadUrl: "#",
    takenAt: null,
    approximateDateLabel: "Probably late 1990s",
    datePrecision: "decade",
    placeName: "Old family home",
    people: ["Mom", "Dad"],
    eventName: "Old home memories",
    eventDateLabel: "1990s",
    year: null,
    month: null,
    reactionCount: 33,
    visibilityState: "active",
    cleanupReasons: ["unknown_date"]
  },
  {
    id: "p-016",
    title: "Europe cafe table",
    caption: "Coffee, postcards, and a little rest before the next train.",
    filename: "EUROPE_2016_045.jpg",
    thumbnailUrl: image("europe-cafe-table", 900, 700),
    imageUrl: image("europe-cafe-table-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-016",
    downloadUrl: "#",
    takenAt: "2016-05-06",
    datePrecision: "day",
    placeName: "Paris cafe",
    people: ["Mom", "Jisoo"],
    eventName: "Europe trip",
    eventDateLabel: "May 2016",
    year: 2016,
    month: 5,
    reactionCount: 40,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-017",
    title: "Museum steps",
    caption: "A family portrait before going inside for the afternoon.",
    filename: "EUROPE_2016_087.jpg",
    thumbnailUrl: image("museum-steps-family", 900, 650),
    imageUrl: image("museum-steps-family-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-017",
    downloadUrl: "#",
    takenAt: "2016-05-08",
    datePrecision: "day",
    placeName: "Paris museum",
    people: ["Mom", "Dad", "Jisoo"],
    eventName: "Europe trip",
    eventDateLabel: "May 2016",
    year: 2016,
    month: 5,
    reactionCount: 37,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-018",
    title: "Train ticket screenshot",
    caption: "Useful for the trip, but probably not a memory photo.",
    filename: "Screenshot_20160508_ticket.png",
    thumbnailUrl: image("train-ticket-screenshot", 900, 650),
    imageUrl: image("train-ticket-screenshot-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-018",
    downloadUrl: "#",
    takenAt: "2016-05-08",
    datePrecision: "day",
    placeName: "Paris station",
    people: ["People unknown"],
    eventName: "Europe trip",
    eventDateLabel: "May 2016",
    year: 2016,
    month: 5,
    reactionCount: 2,
    visibilityState: "active",
    cleanupReasons: ["screenshot_candidate", "unknown_person"]
  },
  {
    id: "p-019",
    title: "Receipt from the family dinner",
    caption: "A document-like photo that belongs in cleanup review.",
    filename: "receipt_dinner_2016.jpg",
    thumbnailUrl: image("family-dinner-receipt", 850, 1050),
    imageUrl: image("family-dinner-receipt-large", 1300, 1600),
    originalUrl: "https://drive.google.com/mock/p-019",
    downloadUrl: "#",
    takenAt: "2016-05-09",
    datePrecision: "day",
    placeName: "Paris restaurant",
    people: ["People unknown"],
    eventName: "Europe trip",
    eventDateLabel: "May 2016",
    year: 2016,
    month: 5,
    reactionCount: 1,
    visibilityState: "active",
    cleanupReasons: ["document_candidate", "unknown_person"]
  },
  {
    id: "p-020",
    title: "Chuseok kitchen helpers",
    caption: "Everyone had a job, even if some jobs were just tasting.",
    filename: "chuseok_2018_kitchen.jpg",
    thumbnailUrl: image("chuseok-kitchen-helpers", 900, 700),
    imageUrl: image("chuseok-kitchen-helpers-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-020",
    downloadUrl: "#",
    takenAt: "2018-09-24",
    datePrecision: "day",
    placeName: "Grandma's house",
    people: ["Grandma", "Mom", "Jisoo", "Min"],
    eventName: "Chuseok gathering",
    eventDateLabel: "September 2018",
    year: 2018,
    month: 9,
    reactionCount: 45,
    visibilityState: "active",
    cleanupReasons: [],
    isFeatured: true
  },
  {
    id: "p-021",
    title: "Chuseok family portrait",
    caption: "The full group finally stayed still for one picture.",
    filename: "chuseok_2018_portrait.jpg",
    thumbnailUrl: image("chuseok-family-portrait", 900, 650),
    imageUrl: image("chuseok-family-portrait-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-021",
    downloadUrl: "#",
    takenAt: "2018-09-24",
    datePrecision: "day",
    placeName: "Grandma's house",
    people: ["Grandma", "Mom", "Dad", "Jisoo", "Min"],
    eventName: "Chuseok gathering",
    eventDateLabel: "September 2018",
    year: 2018,
    month: 9,
    reactionCount: 51,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-022",
    title: "Cherry blossoms with Mom",
    caption: "A spring walk that turned into a small photo session.",
    filename: "blossom_mom_2019.jpg",
    thumbnailUrl: image("mom-cherry-blossoms", 850, 1050),
    imageUrl: image("mom-cherry-blossoms-large", 1300, 1600),
    originalUrl: "https://drive.google.com/mock/p-022",
    downloadUrl: "#",
    takenAt: "2019-04-07",
    datePrecision: "day",
    placeName: "Yeouido park",
    people: ["Mom", "Jisoo"],
    eventName: "Spring walk",
    eventDateLabel: "April 2019",
    year: 2019,
    month: 4,
    reactionCount: 44,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-023",
    title: "Dad fixing the bicycle",
    caption: "A Saturday repair that took longer than the ride.",
    filename: "dad_bicycle_2019.jpg",
    thumbnailUrl: image("dad-fixing-bicycle", 900, 700),
    imageUrl: image("dad-fixing-bicycle-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-023",
    downloadUrl: "#",
    takenAt: "2019-06-15",
    datePrecision: "day",
    placeName: "Apartment courtyard",
    people: ["Dad", "Min"],
    eventName: "Everyday memories",
    eventDateLabel: "June 2019",
    year: 2019,
    month: 6,
    reactionCount: 16,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-024",
    title: "New apartment first meal",
    caption: "Moving boxes behind the table and soup in paper bowls.",
    filename: "first_meal_new_home_2020.jpg",
    thumbnailUrl: image("new-home-first-meal", 900, 700),
    imageUrl: image("new-home-first-meal-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-024",
    downloadUrl: "#",
    takenAt: "2020-03-02",
    datePrecision: "day",
    placeName: "Family apartment",
    people: ["Mom", "Dad", "Jisoo", "Min"],
    eventName: "New home",
    eventDateLabel: "March 2020",
    year: 2020,
    month: 3,
    reactionCount: 39,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-025",
    title: "Video call birthday",
    caption: "A screenshot from the year birthday candles moved online.",
    filename: "Screenshot_202004_birthday.png",
    thumbnailUrl: image("video-call-birthday", 900, 650),
    imageUrl: image("video-call-birthday-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-025",
    downloadUrl: "#",
    takenAt: "2020-04-18",
    datePrecision: "day",
    placeName: "Place unknown",
    people: ["Mom", "Dad", "Grandma"],
    eventName: "Video call birthday",
    eventDateLabel: "April 2020",
    year: 2020,
    month: 4,
    reactionCount: 21,
    visibilityState: "active",
    cleanupReasons: ["screenshot_candidate", "unknown_place"]
  },
  {
    id: "p-026",
    title: "Jeju stone wall walk",
    caption: "Windy weather, matching hats, and a slow walk after lunch.",
    filename: "jeju_2021_stone_wall.jpg",
    thumbnailUrl: image("jeju-stone-wall-walk", 900, 700),
    imageUrl: image("jeju-stone-wall-walk-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-026",
    downloadUrl: "#",
    takenAt: "2021-10-04",
    datePrecision: "day",
    placeName: "Jeju stone wall road",
    people: ["Mom", "Dad"],
    eventName: "Jeju trip",
    eventDateLabel: "October 2021",
    year: 2021,
    month: 10,
    reactionCount: 47,
    visibilityState: "active",
    cleanupReasons: [],
    isFeatured: true
  },
  {
    id: "p-027",
    title: "Jeju seafood dinner",
    caption: "The table filled up before anyone remembered to take a picture.",
    filename: "jeju_2021_dinner.jpg",
    thumbnailUrl: image("jeju-seafood-dinner", 900, 700),
    imageUrl: image("jeju-seafood-dinner-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-027",
    downloadUrl: "#",
    takenAt: "2021-10-05",
    datePrecision: "day",
    placeName: "Jeju seafood house",
    people: ["Mom", "Dad", "Min"],
    eventName: "Jeju trip",
    eventDateLabel: "October 2021",
    year: 2021,
    month: 10,
    reactionCount: 34,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-028",
    title: "Mountain trail rest stop",
    caption: "A bench, oranges, and five minutes of quiet.",
    filename: "hiking_2022_rest.jpg",
    thumbnailUrl: image("mountain-trail-rest", 900, 700),
    imageUrl: image("mountain-trail-rest-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-028",
    downloadUrl: "#",
    takenAt: "2022-05-21",
    datePrecision: "day",
    placeName: "Bukhansan trail",
    people: ["Dad", "Jisoo", "Min"],
    eventName: "Weekend hike",
    eventDateLabel: "May 2022",
    year: 2022,
    month: 5,
    reactionCount: 25,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-029",
    title: "Hiking map photo",
    caption: "A practical map photo that should be reviewed separately.",
    filename: "hiking_map_2022.jpg",
    thumbnailUrl: image("hiking-map-photo", 850, 1050),
    imageUrl: image("hiking-map-photo-large", 1300, 1600),
    originalUrl: "https://drive.google.com/mock/p-029",
    downloadUrl: "#",
    takenAt: "2022-05-21",
    datePrecision: "day",
    placeName: "Bukhansan trail",
    people: ["People unknown"],
    eventName: "Weekend hike",
    eventDateLabel: "May 2022",
    year: 2022,
    month: 5,
    reactionCount: 3,
    visibilityState: "active",
    cleanupReasons: ["document_candidate", "unknown_person"]
  },
  {
    id: "p-030",
    title: "Family reunion dinner",
    caption: "A long table and every chair filled.",
    filename: "reunion_2023_dinner.jpg",
    thumbnailUrl: image("family-reunion-dinner", 900, 650),
    imageUrl: image("family-reunion-dinner-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-030",
    downloadUrl: "#",
    takenAt: "2023-11-18",
    datePrecision: "day",
    placeName: "Seoul banquet hall",
    people: ["Grandma", "Mom", "Dad", "Jisoo", "Min"],
    eventName: "Family reunion",
    eventDateLabel: "November 2023",
    year: 2023,
    month: 11,
    reactionCount: 58,
    visibilityState: "active",
    cleanupReasons: [],
    isFeatured: true
  },
  {
    id: "p-031",
    title: "Reunion group duplicate",
    caption: "A near-duplicate group photo from the same dinner.",
    filename: "reunion_2023_dinner_alt.jpg",
    thumbnailUrl: image("family-reunion-dinner-alt", 900, 650),
    imageUrl: image("family-reunion-dinner-alt-large", 1500, 1080),
    originalUrl: "https://drive.google.com/mock/p-031",
    downloadUrl: "#",
    takenAt: "2023-11-18",
    datePrecision: "day",
    placeName: "Seoul banquet hall",
    people: ["Grandma", "Mom", "Dad", "Jisoo", "Min"],
    eventName: "Family reunion",
    eventDateLabel: "November 2023",
    year: 2023,
    month: 11,
    reactionCount: 12,
    visibilityState: "active",
    cleanupReasons: ["duplicate_candidate"],
    duplicateGroupId: "dup-reunion-001"
  },
  {
    id: "p-032",
    title: "Unsorted album scan",
    caption: "A scanned photo with people and location still unknown.",
    filename: "album_scan_unsorted_118.jpg",
    thumbnailUrl: image("unsorted-album-scan", 900, 700),
    imageUrl: image("unsorted-album-scan-large", 1500, 1150),
    originalUrl: "https://drive.google.com/mock/p-032",
    downloadUrl: "#",
    takenAt: null,
    approximateDateLabel: "Date unknown",
    datePrecision: "unknown",
    placeName: "Place unknown",
    people: ["People unknown"],
    year: null,
    month: null,
    reactionCount: 5,
    visibilityState: "active",
    cleanupReasons: ["unknown_date", "unknown_place", "unknown_person"]
  }
];

export const memoryAlbums: MemoryAlbum[] = [
  {
    id: "a-1990s",
    title: "예전 우리집 추억",
    subtitle: "1990년대 스캔 사진",
    coverPhotoId: "p-004",
    photoCount: 42
  },
  {
    id: "a-summer",
    title: "여름 여행",
    subtitle: "바닷가, 식사, 긴 드라이브",
    coverPhotoId: "p-003",
    photoCount: 86
  },
  {
    id: "a-europe",
    title: "유럽 여행",
    subtitle: "첫 해외 가족여행",
    coverPhotoId: "p-005",
    photoCount: 118
  },
  {
    id: "a-gatherings",
    title: "가족 모임",
    subtitle: "생일, 명절, 오랜만의 모임",
    coverPhotoId: "p-030",
    photoCount: 71
  },
  {
    id: "a-everyday",
    title: "일상의 가족사진",
    subtitle: "집 주변의 작고 편한 순간들",
    coverPhotoId: "p-024",
    photoCount: 54
  }
];

export function getPhotoById(photoId: string) {
  return mockPhotos.find((photo) => photo.id === photoId);
}

export function getAlbumCover(album: MemoryAlbum) {
  return mockPhotos.find((photo) => photo.id === album.coverPhotoId) ?? mockPhotos[0];
}

export function getAlbumPhotos(album: MemoryAlbum) {
  const cover = getAlbumCover(album);
  const matchedByEvent = getActivePhotos().filter((photo) => photo.eventName === cover.eventName);

  if (matchedByEvent.length > 0) {
    return matchedByEvent;
  }

  return getActivePhotos().filter((photo) => photo.year === cover.year);
}

export function getActivePhotos() {
  return mockPhotos.filter((photo) => photo.visibilityState === "active");
}

export function getDisplayDate(photo: MemoryPhoto) {
  if (photo.approximateDateLabel === "Date unknown") {
    return "날짜 확인 필요";
  }

  if (photo.approximateDateLabel) {
    return photo.approximateDateLabel;
  }

  if (!photo.takenAt) {
    return "날짜 확인 필요";
  }

  const date = new Date(photo.takenAt);
  if (Number.isNaN(date.getTime())) {
    return photo.takenAt;
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if (photo.datePrecision === "year") {
    return `${year}년`;
  }

  if (photo.datePrecision === "month") {
    return `${year}년 ${month}월`;
  }

  return `${year}년 ${month}월 ${day}일`;
}

export function getPhotoCountLabel(count: number) {
  return `${count}장`;
}

export function getPlaceDisplayName(placeName: string) {
  return placeDisplayNames[placeName] ?? placeName;
}

export function getPersonDisplayName(personName: string) {
  return personDisplayNames[personName] ?? personName;
}

export function getEventDisplayName(eventName?: string) {
  if (!eventName) return "아직 묶이지 않음";
  return eventDisplayNames[eventName] ?? eventName;
}

export function getRecentPhotos(limit = 8) {
  return [...getActivePhotos()]
    .sort((a, b) => {
      if (!a.takenAt && !b.takenAt) return 0;
      if (!a.takenAt) return 1;
      if (!b.takenAt) return -1;
      return b.takenAt.localeCompare(a.takenAt);
    })
    .slice(0, limit);
}

export function getLovedPhotos(limit = 6) {
  return [...getActivePhotos()].sort((a, b) => b.reactionCount - a.reactionCount).slice(0, limit);
}

export function getFeaturedPhotos(limit = 4) {
  return getActivePhotos()
    .filter((photo) => photo.isFeatured)
    .slice(0, limit);
}

export function getCleanupCandidates() {
  return mockPhotos.filter((photo) => photo.cleanupReasons.length > 0);
}

export function getCleanupGroups() {
  return getCleanupCandidates().reduce<Record<CleanupReason, MemoryPhoto[]>>(
    (groups, photo) => {
      photo.cleanupReasons.forEach((reason) => {
        groups[reason] = groups[reason] ?? [];
        groups[reason].push(photo);
      });
      return groups;
    },
    {} as Record<CleanupReason, MemoryPhoto[]>
  );
}

export function getTimelineGroups() {
  const dated = getActivePhotos().filter((photo) => photo.year && photo.month);
  const unknownDate = getActivePhotos().filter((photo) => !photo.year || !photo.month);

  const byYear = dated.reduce<Record<number, Record<number, MemoryPhoto[]>>>((years, photo) => {
    const year = photo.year as number;
    const month = photo.month as number;
    years[year] = years[year] ?? {};
    years[year][month] = years[year][month] ?? [];
    years[year][month].push(photo);
    return years;
  }, {});

  return {
    years: Object.entries(byYear)
      .map(([year, months]) => ({
        year: Number(year),
        months: Object.entries(months)
          .map(([month, photos]) => ({
            month: Number(month),
            photos: photos.sort((a, b) => (b.takenAt ?? "").localeCompare(a.takenAt ?? ""))
          }))
          .sort((a, b) => b.month - a.month)
      }))
      .sort((a, b) => b.year - a.year),
    unknownDate
  };
}

export function getPlaceGroups() {
  return getActivePhotos()
    .reduce<Array<{ name: string; photos: MemoryPhoto[] }>>((groups, photo) => {
      const name = photo.placeName;
      const existing = groups.find((group) => group.name === name);
      if (existing) {
        existing.photos.push(photo);
      } else {
        groups.push({ name, photos: [photo] });
      }
      return groups;
    }, [])
    .sort((a, b) => {
      if (a.name === "Place unknown") return 1;
      if (b.name === "Place unknown") return -1;
      return b.photos.length - a.photos.length;
    });
}

export function getPeopleGroups() {
  return getActivePhotos()
    .reduce<Array<{ name: string; photos: MemoryPhoto[] }>>((groups, photo) => {
      photo.people.forEach((person) => {
        const existing = groups.find((group) => group.name === person);
        if (existing) {
          existing.photos.push(photo);
        } else {
          groups.push({ name: person, photos: [photo] });
        }
      });
      return groups;
    }, [])
    .sort((a, b) => {
      if (a.name === "People unknown") return 1;
      if (b.name === "People unknown") return -1;
      return b.photos.length - a.photos.length;
    });
}

export function getEventGroups() {
  return getActivePhotos()
    .reduce<Array<{ name: string; dateLabel: string; photos: MemoryPhoto[] }>>((groups, photo) => {
      const name = photo.eventName ?? "Everyday memories";
      const existing = groups.find((group) => group.name === name);
      if (existing) {
        existing.photos.push(photo);
      } else {
        groups.push({ name, dateLabel: photo.eventDateLabel ?? "Mixed dates", photos: [photo] });
      }
      return groups;
    }, [])
    .sort((a, b) => b.photos.length - a.photos.length);
}

export function getAdjacentPhotos(photoId: string) {
  const photos = getActivePhotos();
  const index = photos.findIndex((photo) => photo.id === photoId);
  return {
    previousPhoto: index > 0 ? photos[index - 1] : null,
    nextPhoto: index >= 0 && index < photos.length - 1 ? photos[index + 1] : null
  };
}
