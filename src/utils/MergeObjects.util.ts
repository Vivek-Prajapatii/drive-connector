function mergeObjects(objects) {
  const mergedObject = {};

  // Iterate through each object in the array
  for (const obj of objects) {
    // Iterate through each key in the object
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !mergedObject.hasOwnProperty(key)) {
        // Add the key-value pair to the merged object if the key is not already present
        mergedObject[key] = obj[key];
      }
    }
  }
  return mergedObject;
}

function removeKeys(index, data) {
  const mergedObject = {};

  // Iterate through each key in the data
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // Check if the key exists in the current index
      if (data[key][index]) {
        // Merge the objects
        mergedObject[key] = { ...data[key][index] };
      }
    }
  }

  const result = mergeObjects(Object.values(mergedObject));

  return result;
}

export function mergeEntitiesByIndex(data: any) {
  const arrayLength = data.patient.length; // Assuming all arrays have the same length

  const mergedArray = [];

  // Iterate through each index
  for (let i = 0; i < arrayLength; i++) {
    // Merge objects at the current index
    const mergedObject = removeKeys(i, data);
    mergedArray.push(mergedObject);
  }
  return mergedArray;
}
