// Variables

let airportsData = [];
let sendRequestTimeout;
let timeoutInProgress = false;
let isUserSelect = false;

// Referenced Elements

const departureEl = document.querySelector('#departure');
const destinationEl = document.querySelector('#destination');
const datalistEl = document.querySelector('#airportsData');

// Functions

async function getData(name) {
    airportsData.forEach((airport) => {
        if (airport.name === name) {
            isUserSelect = true;
        }
    })
    // avoid calling api is input field is empty
    if (name !== "" && isUserSelect === false) {

        console.log('api called');

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.api-ninjas.com/v1/airports?x-api-key=bhGUBKz5Co097zMYyZ5qCA==wLpa5VYivTAva6uE&name=${name}`,
            headers: {}
        };

        await axios.request(config)
            .then((response) => {
                airportsData = response.data;
            })
            .catch((error) => {
                console.log(error);
            });

        // reset boolean
        timeoutInProgress = false;

        // add data found
        populateDatalist();
    }
}

function handleInputChange(event) {
    isUserSelect = false;
    // if timeout is already queued, restart timeout
    if (timeoutInProgress) {
        clearTimeout(sendRequestTimeout)
        sendRequestTimeout = setTimeout(() => {
            getData(event.target.value)
        }, 1500);
    } else {
        // set boolean to true to avoid mutiple api calls when input is changed before timeout finishes
        timeoutInProgress = true;
        sendRequestTimeout = setTimeout(() => {
            getData(event.target.value)
        }, 1500);
    }

}

// create option elements for datalist based on retrieved data
function populateDatalist() {
    datalistEl.innerHTML = '';
    airportsData.forEach((airport) => {
        const option = datalistEl.appendChild(document.createElement("option"));
        option.textContent = airport.name;
    })
}

// EventListeners

departureEl.addEventListener('input', handleInputChange)
destinationEl.addEventListener('input', handleInputChange)