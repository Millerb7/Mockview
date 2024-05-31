const axios = require('axios');

const apiEndpoint = 'http://127.0.0.1:5000'
const localEndpoint = 'http://localhost:3000'

/*const testApi=()=>new Promise(() => {
    return fetch(`http://localhost:5000/`,{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
      },
      body:JSON.stringify(body)
    })
    .then(response => response.json())
    .catch(error => console.log(error))
})*/

// single file upload
export const uploadFile = (file, material) => {
    const formData = new FormData();
    formData.append('file', file); // Appending the file
    formData.append('material', material); // Appending the material as part of the form data

    // logging
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }    

    return fetch(`${apiEndpoint}/upload`, {
        method: "POST",
        body: formData, // Passing formData as the body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Expecting a JSON response now
    })
    .then(data => {
        if (data.path) {
            // Assuming the backend returns the full URL to the image
            const imageUrl = data.path;

            // console.log("Image URL:", imageUrl);
            return imageUrl;
        } else {
            throw new Error("Image path not found in response.");
        }
    })
    .catch(error => console.error("Error processing file:", error));
};

// multi file upload
export const uploadFiles = (files, material) => {
    const formData = new FormData();
    
    // Appending each file in the array to the formData object
    files.forEach((file) => {
        if (file.name.endsWith('.dcm')) {
            // Extract just the file name without any directory path
            const filename = file.name.split('/').pop(); // Use split('/') for UNIX-like paths
            // Or, for Windows paths, you might need file.name.split('\\').pop();
            // In a cross-platform context, you might need to check for both
    
            // Append the file with the cleaned filename
            formData.append(`file[]`, file, filename);
        }
    });    

    // Appending the material as part of the form data
    formData.append('material', material);

    // Logging each entry in formData (for debug purposes)
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    // }

    console.log(formData);

    return fetch(`${apiEndpoint}/uploadFolder`, {
        method: "POST",
        body: formData, // Passing formData as the body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Expecting a JSON response
    })
    .then(data => {
        if (data.paths) {
            // Assuming the backend returns an array of file paths
            console.log("Uploaded files paths:", data.paths);
            return data.paths;
        } else {
            throw new Error("File paths not found in response.");
        }
    })
    .catch(error => console.error("Error processing files:", error));
};

export const checkBackendHealth = () => {
    return fetch(`${apiEndpoint}`, {

    }).then(response => {
        return response;
      })
      .catch(error => {
        console.error('Backend might be down:', error.message);
      });
}

// end miller new routes

export const uploadFolder = (folder, material) => {
    console.log(folder);
    return fetch(`${apiEndpoint}/upload`, {
       'method': "POST",
        'body': JSON.stringify({ folderName: folder, material: material }),
    })
    .then((response) => {
        if (!response.ok) {
            // If server response wasn't ok, throw an error
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return response.json();
        }
    })
    .then((data) => {
        console.log(data);
        return data;
    })
    .catch((err) => {
        console.log("Error:", err);
    });
};

export const checkProcessed = (imageName) => {
    return  fetch(`${apiEndpoint}/checkProcessed?image_name=${imageName}}`).then((res) => {
        if (!res.ok) {
            // If server response wasn't ok, throw an error
            throw new Error(`HTTP error! status: ${res.status}`);
        } else {
            return res.json();
        }
    })
    .then((data) => {
        console.log(data);
        return data.processed;
    })
  };


export const approveImage=(pass, name) => {
    return fetch(`${apiEndpoint}/imageApproval\?passFail=${pass}&fileName=${name}`,{
    })
    .then((response) => { 
        return response.json().then((data) => {
            console.log(data);
            return data;
        }).catch((err) => {
            console.log(err);
        }) 
    })
}

export const getSummary=()=> {
    return fetch(`${apiEndpoint}\\getSummary`,{
             crossDomain: true,
             headers : {
      }
    })
    .then((response) => { 
        return response.json().then((data) => {
            console.log(data);
            return data;
        }).catch((err) => {
            console.log(err);
        }) 
    })
}

export const updateLog=()=>new Promise(() => {
    return fetch(`${apiEndpoint}/updateLog`,{
             //method:'POST',
             /*formData:{'name':"a_name",
             "comment":"a_comment",
             "fileName":"testFilename"},*/
             headers : {
      }
    })
    .then(response => response.json())
    .catch(error => console.log(error))
})

export const getLog=()=>new Promise(() => {
    return fetch(`${apiEndpoint}\\getLog`,{
             method:"POST",
             headers : {
      }
    })
    .then(response => response.json())
    .catch(error => console.log(error))
})

export const getTest=()=>new Promise(() => {
    return fetch(`${apiEndpoint}\\testing`,{
             method:"GET",
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response
    })
    .catch(error => console.log(error))
})