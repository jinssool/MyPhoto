import type { MemoryAlbum, MemoryPhoto } from "@/types/photo";

export const mockPhotos: MemoryPhoto[] = [
  {
    id: "p-001",
    title: "First picnic by the river",
    caption: "A quiet afternoon with everyone gathered around the lunch mat.",
    filename: "IMG_200104_river-picnic.jpg",
    thumbnailUrl: "https://picsum.photos/seed/family-river-picnic/800/600",
    imageUrl: "https://picsum.photos/seed/family-river-picnic-large/1400/1000",
    takenAt: "2001-04-22",
    datePrecision: "day",
    placeName: "Han River Park",
    people: ["Mom", "Dad", "Jisoo"],
    eventName: "Spring picnic",
    year: 2001,
    month: 4,
    reactionCount: 18,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-002",
    title: "Grandma's birthday table",
    caption: "Candles, fruit, and the cake everyone remembers.",
    filename: "DCIM_2008_09_birthday.jpg",
    thumbnailUrl: "https://picsum.photos/seed/grandma-birthday-table/800/700",
    imageUrl: "https://picsum.photos/seed/grandma-birthday-table-large/1400/1100",
    takenAt: "2008-09-14",
    datePrecision: "day",
    placeName: "Grandma's house",
    people: ["Grandma", "Mom", "Dad"],
    eventName: "Grandma birthday",
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
    thumbnailUrl: "https://picsum.photos/seed/family-beach-walk/800/1000",
    imageUrl: "https://picsum.photos/seed/family-beach-walk-large/1300/1600",
    takenAt: "2012-07-28",
    datePrecision: "day",
    placeName: "Gangneung beach",
    people: ["Mom", "Dad", "Min"],
    eventName: "Summer trip",
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
    thumbnailUrl: "https://picsum.photos/seed/family-snow-yard/800/650",
    imageUrl: "https://picsum.photos/seed/family-snow-yard-large/1400/1050",
    takenAt: "1999-01-11",
    approximateDateLabel: "Winter 1999",
    datePrecision: "month",
    placeName: "Old family home",
    people: ["Mom", "Dad", "Jisoo", "Min"],
    eventName: "Old home memories",
    year: 1999,
    month: 1,
    reactionCount: 42,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-005",
    title: "Airport before the first trip abroad",
    caption: "Suitcases lined up before boarding.",
    filename: "EUROPE_2016_001.jpg",
    thumbnailUrl: "https://picsum.photos/seed/family-airport-trip/800/600",
    imageUrl: "https://picsum.photos/seed/family-airport-trip-large/1500/1000",
    takenAt: "2016-05-03",
    datePrecision: "day",
    placeName: "Incheon Airport",
    people: ["Mom", "Dad", "Jisoo"],
    eventName: "Europe trip",
    year: 2016,
    month: 5,
    reactionCount: 29,
    visibilityState: "active",
    cleanupReasons: []
  },
  {
    id: "p-006",
    title: "Unknown summer snapshot",
    caption: "A warm day from an old folder waiting for a better date.",
    filename: "scan_family_untitled_034.jpg",
    thumbnailUrl: "https://picsum.photos/seed/unknown-summer-family/800/800",
    imageUrl: "https://picsum.photos/seed/unknown-summer-family-large/1400/1400",
    takenAt: null,
    approximateDateLabel: "Date unknown",
    datePrecision: "unknown",
    placeName: "Place unknown",
    people: ["Family"],
    year: null,
    month: null,
    reactionCount: 7,
    visibilityState: "active",
    cleanupReasons: ["unknown_date"]
  }
];

export const memoryAlbums: MemoryAlbum[] = [
  {
    id: "a-1990s",
    title: "Old home memories",
    subtitle: "1990s family scans",
    coverPhotoId: "p-004",
    photoCount: 42
  },
  {
    id: "a-summer",
    title: "Summer trips",
    subtitle: "Beaches, meals, and long drives",
    coverPhotoId: "p-003",
    photoCount: 86
  },
  {
    id: "a-europe",
    title: "Europe trip",
    subtitle: "First overseas family trip",
    coverPhotoId: "p-005",
    photoCount: 118
  }
];

export function getPhotoById(photoId: string) {
  return mockPhotos.find((photo) => photo.id === photoId);
}

export function getAlbumCover(album: MemoryAlbum) {
  return mockPhotos.find((photo) => photo.id === album.coverPhotoId) ?? mockPhotos[0];
}

export function getActivePhotos() {
  return mockPhotos.filter((photo) => photo.visibilityState === "active");
}

export function getPhotosByYear() {
  return getActivePhotos().reduce<Record<string, MemoryPhoto[]>>((groups, photo) => {
    const key = photo.year ? String(photo.year) : "Date unknown";
    groups[key] = groups[key] ?? [];
    groups[key].push(photo);
    return groups;
  }, {});
}
