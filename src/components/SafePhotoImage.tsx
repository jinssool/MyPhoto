"use client";

import { useState } from "react";

type SafePhotoImageProps = {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
};

export function SafePhotoImage({ src, alt, loading }: SafePhotoImageProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return null;
  }

  return <img src={src} alt={alt} loading={loading} onError={() => setFailed(true)} />;
}
