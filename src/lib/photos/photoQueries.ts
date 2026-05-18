import {
  getAdjacentPhotos as getMockAdjacentPhotos,
  getCleanupCandidates as getMockCleanupCandidates,
  getFeaturedPhotos,
  getLovedPhotos,
  getPhotoById,
  getRecentPhotos,
  getTimelineGroups as getMockTimelineGroups
} from "@/data/mockPhotos";
import { REVIEWABLE_CLEANUP_STATUSES } from "@/lib/cleanup/constants";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CleanupCandidateRow, EventRow, PersonClusterRow, PhotoRow, PlaceRow } from "@/types/database";
import type { MemoryPhoto, PhotoVisibilityState } from "@/types/photo";

import { mapPhotoRowToMemoryPhoto } from "./photoMappers";

export type TimelinePhotoParams = {
  year?: number;
  month?: number;
  limit?: number;
};

export type TimelineMonthGroup = {
  month: number;
  photos: MemoryPhoto[];
};

export type TimelineYearGroup = {
  year: number;
  months: TimelineMonthGroup[];
};

export type TimelinePhotoGroups = {
  years: TimelineYearGroup[];
  unknownDate: MemoryPhoto[];
};

export type HomeHighlights = {
  featuredPhotos: MemoryPhoto[];
  featuredPhoto: MemoryPhoto | null;
  recentPhotos: MemoryPhoto[];
  lovedPhotos: MemoryPhoto[];
  cleanupCount: number;
};

export type PhotoDetailResult = {
  photo: MemoryPhoto | null;
  previousPhoto: MemoryPhoto | null;
  nextPhoto: MemoryPhoto | null;
};

type PhotoRelationsById = {
  places: Map<string, Pick<PlaceRow, "name" | "display_name">>;
  events: Map<string, Pick<EventRow, "title">>;
  peopleByPhoto: Map<string, Array<Pick<PersonClusterRow, "display_name">>>;
  cleanupByPhoto: Map<string, Array<Pick<CleanupCandidateRow, "candidate_type">>>;
};

function byTakenAtDesc(a: MemoryPhoto, b: MemoryPhoto) {
  if (!a.takenAt && !b.takenAt) return 0;
  if (!a.takenAt) return 1;
  if (!b.takenAt) return -1;
  return b.takenAt.localeCompare(a.takenAt);
}

function createMockHomeHighlights(): HomeHighlights {
  const featuredPhotos = getFeaturedPhotos(4);
  const lovedPhotos = getLovedPhotos(6);

  return {
    featuredPhotos,
    featuredPhoto: featuredPhotos[0] ?? lovedPhotos[0] ?? null,
    recentPhotos: getRecentPhotos(8),
    lovedPhotos,
    cleanupCount: getMockCleanupCandidates().length
  };
}

function groupTimelinePhotos(photos: MemoryPhoto[]): TimelinePhotoGroups {
  const dated = photos.filter((photo) => photo.year && photo.month);
  const unknownDate = photos.filter((photo) => !photo.year || !photo.month);

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
          .map(([month, monthPhotos]) => ({
            month: Number(month),
            photos: monthPhotos.sort(byTakenAtDesc)
          }))
          .sort((a, b) => b.month - a.month)
      }))
      .sort((a, b) => b.year - a.year),
    unknownDate: unknownDate.sort((a, b) => b.reactionCount - a.reactionCount)
  };
}

function dateWindow(params: TimelinePhotoParams) {
  if (!params.year) return null;

  const month = params.month;
  const start = new Date(Date.UTC(params.year, month ? month - 1 : 0, 1));
  const end = new Date(Date.UTC(month ? params.year : params.year + 1, month ? month : 0, 1));

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}

async function loadPhotoRelations(familyId: string, photos: PhotoRow[]): Promise<PhotoRelationsById> {
  const supabase = createSupabaseServerClient();
  const placeIds = [...new Set(photos.map((photo) => photo.place_id).filter(Boolean))] as string[];
  const eventIds = [...new Set(photos.map((photo) => photo.event_id).filter(Boolean))] as string[];
  const photoIds = photos.map((photo) => photo.id);

  const relations: PhotoRelationsById = {
    places: new Map(),
    events: new Map(),
    peopleByPhoto: new Map(),
    cleanupByPhoto: new Map()
  };

  if (!supabase || photos.length === 0) {
    return relations;
  }

  if (placeIds.length > 0) {
    const { data, error } = await supabase
      .from("places")
      .select("id,name,display_name")
      .eq("family_id", familyId)
      .in("id", placeIds);

    if (error) throw error;
    data?.forEach((place) => relations.places.set(place.id, place));
  }

  if (eventIds.length > 0) {
    const { data, error } = await supabase
      .from("events")
      .select("id,title")
      .eq("family_id", familyId)
      .in("id", eventIds);

    if (error) throw error;
    data?.forEach((event) => relations.events.set(event.id, event));
  }

  if (photoIds.length > 0) {
    const { data: personLinks, error: personError } = await supabase
      .from("person_photos")
      .select("photo_id,person_cluster_id")
      .eq("family_id", familyId)
      .in("photo_id", photoIds);

    if (personError) throw personError;

    const personIds = [...new Set(personLinks?.map((link) => link.person_cluster_id) ?? [])];
    if (personIds.length > 0) {
      const { data: people, error: peopleError } = await supabase
        .from("person_clusters")
        .select("id,display_name")
        .eq("family_id", familyId)
        .in("id", personIds);

      if (peopleError) throw peopleError;

      const peopleById = new Map(people?.map((person) => [person.id, person]) ?? []);
      personLinks?.forEach((link) => {
        const person = peopleById.get(link.person_cluster_id);
        if (!person) return;

        const existing = relations.peopleByPhoto.get(link.photo_id) ?? [];
        existing.push(person);
        relations.peopleByPhoto.set(link.photo_id, existing);
      });
    }

    const { data: cleanupCandidates, error: cleanupError } = await supabase
      .from("cleanup_candidates")
      .select("photo_id,candidate_type")
      .eq("family_id", familyId)
      .in("status", REVIEWABLE_CLEANUP_STATUSES)
      .in("photo_id", photoIds);

    if (cleanupError) throw cleanupError;
    cleanupCandidates?.forEach((candidate) => {
      const existing = relations.cleanupByPhoto.get(candidate.photo_id) ?? [];
      existing.push(candidate);
      relations.cleanupByPhoto.set(candidate.photo_id, existing);
    });
  }

  return relations;
}

async function countReviewableCleanupPhotos(familyId: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getMockCleanupCandidates().length;
  }

  const { data: candidates, error: candidateError } = await supabase
    .from("cleanup_candidates")
    .select("photo_id")
    .eq("family_id", familyId)
    .in("status", REVIEWABLE_CLEANUP_STATUSES);

  if (candidateError) throw candidateError;

  const photoIds = [...new Set(candidates?.map((candidate) => candidate.photo_id) ?? [])];
  if (photoIds.length === 0) return 0;

  const { count, error: photoError } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("family_id", familyId)
    .eq("visibility_state", "active")
    .in("id", photoIds);

  if (photoError) throw photoError;

  return count ?? 0;
}

export async function mapPhotoRowsWithRelations(familyId: string, photos: PhotoRow[]) {
  const relations = await loadPhotoRelations(familyId, photos);

  return photos.map((photo) =>
    mapPhotoRowToMemoryPhoto(photo, {
      place: photo.place_id ? relations.places.get(photo.place_id) : null,
      event: photo.event_id ? relations.events.get(photo.event_id) : null,
      people: relations.peopleByPhoto.get(photo.id),
      cleanupCandidates: relations.cleanupByPhoto.get(photo.id)
    })
  );
}

export async function getHomeHighlights(familyId = MOCK_FAMILY_ID): Promise<HomeHighlights> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return createMockHomeHighlights();
  }

  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .eq("family_id", familyId)
    .eq("visibility_state", "active")
    .order("reaction_count", { ascending: false })
    .order("taken_at", { ascending: false, nullsFirst: false })
    .limit(24);

  if (error) throw error;

  const mappedPhotos = await mapPhotoRowsWithRelations(familyId, photos ?? []);
  const featuredPhotos = mappedPhotos.filter((photo) => photo.isFeatured).slice(0, 4);
  const lovedPhotos = [...mappedPhotos].sort((a, b) => b.reactionCount - a.reactionCount).slice(0, 6);
  const recentPhotos = [...mappedPhotos].sort(byTakenAtDesc).slice(0, 8);

  return {
    featuredPhotos,
    featuredPhoto: featuredPhotos[0] ?? lovedPhotos[0] ?? null,
    recentPhotos,
    lovedPhotos,
    cleanupCount: await countReviewableCleanupPhotos(familyId)
  };
}

export async function getTimelinePhotos(
  familyId = MOCK_FAMILY_ID,
  params: TimelinePhotoParams = {}
): Promise<TimelinePhotoGroups> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getMockTimelineGroups();
  }

  let query = supabase
    .from("photos")
    .select("*")
    .eq("family_id", familyId)
    .eq("visibility_state", "active")
    .order("taken_at", { ascending: false, nullsFirst: false });

  const window = dateWindow(params);
  if (window) {
    query = query.gte("taken_at", window.start).lt("taken_at", window.end);
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  const photos = await mapPhotoRowsWithRelations(familyId, data ?? []);
  return groupTimelinePhotos(photos);
}

export async function getPhotoDetail(familyId: string, photoId: string): Promise<PhotoDetailResult> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    const photo = getPhotoById(photoId) ?? null;
    const adjacent = getMockAdjacentPhotos(photoId);

    return {
      photo,
      previousPhoto: adjacent.previousPhoto,
      nextPhoto: adjacent.nextPhoto
    };
  }

  const { data: photo, error } = await supabase
    .from("photos")
    .select("*")
    .eq("family_id", familyId)
    .eq("id", photoId)
    .maybeSingle();

  if (error) throw error;
  if (!photo) {
    return { photo: null, previousPhoto: null, nextPhoto: null };
  }

  const mappedPhoto = (await mapPhotoRowsWithRelations(familyId, [photo]))[0] ?? null;

  const { data: adjacentRows, error: adjacentError } = await supabase
    .from("photos")
    .select("*")
    .eq("family_id", familyId)
    .eq("visibility_state", "active")
    .order("taken_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (adjacentError) throw adjacentError;

  const adjacentPhotos = await mapPhotoRowsWithRelations(familyId, adjacentRows ?? []);
  const currentIndex = adjacentPhotos.findIndex((candidate) => candidate.id === photo.id);

  return {
    photo: mappedPhoto,
    previousPhoto: currentIndex > 0 ? adjacentPhotos[currentIndex - 1] : null,
    nextPhoto: currentIndex >= 0 && currentIndex < adjacentPhotos.length - 1 ? adjacentPhotos[currentIndex + 1] : null
  };
}

export async function updatePhotoVisibility(
  familyId: string,
  photoId: string,
  visibilityState: PhotoVisibilityState
): Promise<MemoryPhoto | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    const photo = getPhotoById(photoId);
    return photo ? { ...photo, visibilityState } : null;
  }

  const { data, error } = await supabase
    .from("photos")
    .update({ visibility_state: visibilityState })
    .eq("family_id", familyId)
    .eq("id", photoId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return (await mapPhotoRowsWithRelations(familyId, [data]))[0] ?? null;
}
