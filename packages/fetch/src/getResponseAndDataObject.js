const getResponseAndDataObject = response => response.json().then(data => ({
    data,
    response,
}));

export default getResponseAndDataObject;
