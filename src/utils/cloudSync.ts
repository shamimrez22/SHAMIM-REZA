/**
 * Global Real-Time Cloud Synchronization Helper
 * Enables any device (mobile, PC, tablet, different browsers, incognito)
 * to instantly see and update the official executive profile photo.
 */

export const CLOUD_SYNC_OBJECT_ID = 'ff808181a067127101a076335eb72708';
export const CLOUD_SYNC_ENDPOINT = `https://api.restful-api.dev/objects/${CLOUD_SYNC_OBJECT_ID}`;

/**
 * Fetches the globally synchronized profile photo URL.
 * Works from any browser or country without requiring login.
 */
export async function fetchGlobalProfilePhoto(): Promise<string | null> {
  try {
    const res = await fetch(CLOUD_SYNC_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json?.data?.profilePhotoUrl && typeof json.data.profilePhotoUrl === 'string') {
      const url = json.data.profilePhotoUrl.trim();
      return url.length > 0 ? url : null;
    }
    return null;
  } catch (err) {
    console.warn('Global cloud sync fetch error (using offline cache):', err);
    return null;
  }
}

/**
 * Saves the profile photo URL to the global cloud database.
 * Instantly broadcasts the new photo to all browsers and devices worldwide.
 */
export async function saveGlobalProfilePhoto(photoUrl: string): Promise<boolean> {
  try {
    const res = await fetch(CLOUD_SYNC_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'shamim_reza_portfolio_master_v1',
        data: {
          profilePhotoUrl: photoUrl.trim(),
          updatedAt: new Date().toISOString(),
        },
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to sync photo to global cloud:', err);
    return false;
  }
}
