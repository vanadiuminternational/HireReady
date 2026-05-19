export async function sha256(input) {
  const text = typeof input === 'string' ? input : JSON.stringify(input ?? '');

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return `fallback_${Math.abs(hash).toString(16)}`;
}

export async function hashReviewInput(cv, jobDescription) {
  return sha256({
    cv: String(cv || '').trim().replace(/\s+/g, ' '),
    jobDescription: String(jobDescription || '').trim().replace(/\s+/g, ' '),
  });
}
