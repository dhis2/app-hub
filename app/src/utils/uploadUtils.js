

export function createUploadOptions(data) {

    console.log(data);



    const fileInput = data.file;
    const imageInput = data.image;
    let form = new FormData();
    const file = new Blob([fileInput], {type: 'multipart/form-data'})
    const image = new Blob([fileInput], {type: 'multipart/form-data'})
    const app = new Blob([JSON.stringify(data.data)], {type: 'application/json'})

    form.append('file', file, fileInput.name)
    form.append('app', app);
    form.append('imageFile', image, imageInput.name);

    const fetchOptions = {
        credentials: 'include',
        method: 'POST',
        body: form
    };
    return fetchOptions;
}

/**
 *
 * @param data - An object containing the data to create optiosn for
 * @param data.version - Object with the nested jsonpart of the request
 * @param data.file - The file to upload
 * @returns fetchOptions to be used in fetch
 */

export function createUploadVersionOptions(data) {
    //validateAddVersion(data)
    const version = data.version;
    const jsonData = {
        version: version.version,
        minDhisVersion: version.minDhisVersion || null,
        maxDhisVersion: version.maxDhisVersion || null,

    }
    const dataFile = data.file;
    let form = new FormData();
    const file = new Blob([dataFile], {type: 'multipart/form-data'})
    const app = new Blob([JSON.stringify(jsonData)], {type: 'application/json'})

    form.append('file', file, dataFile.name)
    form.append('version', app);

    const fetchOptions = {
        credentials: 'include',
        method: 'POST',
        body: form
    };
    return fetchOptions;
}

export function validateAddApp() {

}

export function validateAddVersion(data) {
    const structure = {
        version: {
            version: '',
            minDhisVersion: '',
            maxDhisVersion: '',
        },
        file: ''
    }


}

export function validateUpdateApp() {

}

export function validateUpdateVersion() {

}