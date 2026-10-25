export function avatarSrc(photoKey: string | null | undefined) {
  if (!photoKey) return undefined;
  return `/api/media/${photoKey}`;
}
