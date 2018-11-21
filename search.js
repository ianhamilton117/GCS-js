const apiUrl = "https://www.googleapis.com/customsearch/v1";

let params = {
    key: "AIzaSyBqcrX7zwelHrLUsH0R8KOI-aMCTlnrp3g", // Google API key
    cx: "014722161919417917553:vmkwzgw4l5u", // Google search engine ID
    q: ''
}

function basicSearch() {
    params.q = document.getElementById("searchInput").value;

    let query = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');

    let url = apiUrl + "?" + query;
    sendApiRequest(url);
}

function sendApiRequest(url) {
    const http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
    http.onreadystatechange = e => {
        console.log(e);
        try {
            let resultsObj = JSON.parse(http.response);
            populateResultsText(resultsObj);
        } catch (e) {
            console.error(e);
        }
    }
}

function populateResultsText(resultsObj) {
    let resultsString = '';
    resultsObj.items.forEach(item => {
        resultsString += `
            <hr>
            <div class="result">
                <a class="title" href="${item.link}">${item.htmlTitle}</a>
                <p class="snippet">${item.htmlSnippet}</p>
                <p class="url">${item.link}</p>
            </div>
        `;
    });
    document.getElementById("result-list").innerHTML = resultsString;
}

