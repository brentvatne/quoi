const getSignedStorageUrlAsync = async uuid => {
  let response = await fetch(
    `https://7bz0uwltek.execute-api.us-east-1.amazonaws.com/production/getSignedStorageUrl?uuid=${uuid}`
  );
  return await response.json();
};

export default async function uploadImageAsync(imageUrl, uuid) {
  let { signedUrl, targetUrl } = await getSignedStorageUrlAsync(uuid);
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  await fetch(signedUrl, { method: 'PUT', body: blob });
  return targetUrl;
}
