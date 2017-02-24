
/*
export function createUploadOptions(data) {
    const data = {
        name: this.state.appName,
        description: this.state.description,
        developer: {
            name: this.state.developerName,
            email: this.state.developerEmail
        },
        versions: [{version: this.state.version,
            minDhisVersion: this.state.minDhisVersion,
            maxDhisVersion: this.state.maxDhisVersion
        }]
    }
    const fileInput = this.file.refs.wrappedInstance.inputNode.files[0];

    let form = new FormData();
    const file = new Blob([fileInput], {type: 'multipart/form-data'})
    const app = new Blob([JSON.stringify(data)], {type: 'application/json'})

    form.append('file', file, fileInput.name)
    form.append('app', app);

    const fetchOptions = {
        credentials: 'include',
        method: 'POST',
        body: form
    };
    return fetchOptions;
} */

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

    form.append('file', file, file.name)
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