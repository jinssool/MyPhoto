import Link from "next/link";
import { notFound } from "next/navigation";

import {
  cleanupReasonLabels,
  getDisplayDate,
  getEventDisplayName,
  getPersonDisplayName,
  getPlaceDisplayName,
} from "@/data/mockPhotos";
import { addReactionAction, excludePhotoAction, hidePhotoAction, restorePhotoAction } from "@/app/actions/photoActions";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { getPhotoDetail } from "@/lib/photos/photoQueries";

type PhotoDetailPageProps = {
  params: Promise<{
    photoId: string;
  }>;
};

export default async function PhotoDetailPage({ params }: PhotoDetailPageProps) {
  const { photoId } = await params;
  const { photo, previousPhoto, nextPhoto } = await getPhotoDetail(MOCK_FAMILY_ID, photoId);

  if (!photo) {
    notFound();
  }

  return (
    <article className="photo-detail">
      <div className="photo-detail__image">
        <img src={photo.imageUrl} alt={photo.title} />
      </div>
      <div className="photo-detail__panel">
        <div className="detail-top-links">
          <Link href="/" className="text-link">
            우리집 앨범
          </Link>
          <Link href="/timeline" className="text-link">
            시간별
          </Link>
        </div>
        <span className="photo-card__eyebrow">{getDisplayDate(photo)}</span>
        <h1>{photo.title}</h1>
        <p>{photo.caption}</p>
        <dl>
          <div>
            <dt>장소</dt>
            <dd>{getPlaceDisplayName(photo.placeName)}</dd>
          </div>
          <div>
            <dt>사람</dt>
            <dd>{photo.people.map(getPersonDisplayName).join(", ")}</dd>
          </div>
          <div>
            <dt>추억 묶음</dt>
            <dd>{getEventDisplayName(photo.eventName)}</dd>
          </div>
          <div>
            <dt>가족 반응</dt>
            <dd>{photo.reactionCount}개</dd>
          </div>
          <div>
            <dt>보조 정보</dt>
            <dd>{photo.filename}</dd>
          </div>
        </dl>
        {photo.cleanupReasons.length > 0 ? (
          <div className="detail-review-list">
            {photo.cleanupReasons.map((reason) => (
              <span key={reason}>{cleanupReasonLabels[reason]}</span>
            ))}
          </div>
        ) : null}
        <div className="button-row detail-actions">
          <form action={addReactionAction.bind(null, photo.id, "heart")}>
            <button type="submit">좋아요 남기기</button>
          </form>
          {photo.visibilityState === "active" ? (
            <>
              <form action={hidePhotoAction.bind(null, photo.id)}>
                <button type="submit" className="secondary-button">
                  앨범에서 숨기기
                </button>
              </form>
              <form action={excludePhotoAction.bind(null, photo.id)}>
                <button type="submit" className="secondary-button">
                  둘러보기에서 제외
                </button>
              </form>
            </>
          ) : (
            <form action={restorePhotoAction.bind(null, photo.id)}>
              <button type="submit" className="secondary-button">
                다시 보이기
              </button>
            </form>
          )}
        </div>
        <nav className="adjacent-photos" aria-label="사진 이동">
          {previousPhoto ? <Link href={`/photos/${previousPhoto.id}`}>이전 사진: {previousPhoto.title}</Link> : <span>첫 번째 사진</span>}
          {nextPhoto ? <Link href={`/photos/${nextPhoto.id}`}>다음 사진: {nextPhoto.title}</Link> : <span>마지막 사진</span>}
        </nav>
        <p className="quiet-note">이 작업은 앨범 안의 표시 상태만 바꾸며 Google Drive 원본 파일은 삭제, 이동, 이름 변경되지 않습니다.</p>
      </div>
    </article>
  );
}
