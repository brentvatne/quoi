import { ImageManipulator } from 'expo';

export default async function resizeImageAsync(uri) {
  let { uri: resizedUri, width, height } = await ImageManipulator.manipulate(
    uri,
    [{ resize: { width: 500, height: 500 } }],
    { format: 'png' },
  );

  return resizedUri;
}
