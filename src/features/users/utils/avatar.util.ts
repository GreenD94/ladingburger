const AVATAR_BASE_URL = 'https://api.dicebear.com/7.x/lorelei/svg';

export function getAvatarUrl(gender: string, seed?: string): string {
  const avatarSeed = seed || Math.random().toString(36).substring(2, 15);
  return `${AVATAR_BASE_URL}?seed=${avatarSeed}`;
}

