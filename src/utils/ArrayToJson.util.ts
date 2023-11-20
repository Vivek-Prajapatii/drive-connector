export const ArrayToJson = (data: any[][]) => {
  // Assuming the first row contains column headers
  const keys = data[0];

  // Remove the first row since it contains headers
  data.shift();

  // Convert the array of arrays into an array of objects
  const jsonData = data.map(function (row) {
    const obj = {};
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = row[i];
    }
    return obj;
  });

  // Convert the array of objects to JSON
  //   const jsonString = JSON.stringify(jsonData);

  return jsonData;
};
