const apiUrl = "https://www.googleapis.com/customsearch/v1";
const key = "AIzaSyBqcrX7zwelHrLUsH0R8KOI-aMCTlnrp3g"; // Google API key
const cx = "014722161919417917553:vmkwzgw4l5u"; // Google search engine ID
let searchParams;

//10 is the default number of results per page returned by the Google API. It is also the maximum.
const resultsPerPage = 10;

let currentPage = 1;

function basicSearch() {
    searchParams = {};
    searchParams.key = key;
    searchParams.cx = cx;
    searchParams.q = document.getElementById("searchInput").value;
    searchParams.start = 1;

    executeSearch();
}

function advancedSearch() {
    searchParams = {};
    searchParams.key = key;
    searchParams.cx = cx;
    searchParams.q = document.getElementById("reqWords").value;
    searchParams.hq = document.getElementById("reqWords").value;
    searchParams.exactTerms = document.getElementById("exactPhrase").value;
    searchParams.orTerms = document.getElementById("anyWords").value;
    searchParams.excludeTerms = document.getElementById("withoutWords").value;
    searchParams.fileType = document.getElementById("fileFormat").value;
    searchParams.start = 1;

    executeSearch();
}

function pageNav(pageNum) {
    currentPage = pageNum;
    // Calculate which result will be the first result on a given page. 1 for page 1, 11 for page 2, 22 for page 3, etc.
    searchParams.start = String(resultsPerPage * (pageNum - 1) + 1);

    executeSearch();

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function executeSearch() {
    let query = Object.keys(searchParams)
        .map(k => k + '=' + searchParams[k])
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
    let resultsHtml = '';
    resultsObj.items.forEach(item => {
        resultsHtml += `
            <hr>
            <div class="result">
                <a class="title" href="${item.link}">${item.htmlTitle}</a>
                <p class="snippet">${item.htmlSnippet}</p>
                <p class="url" title="${item.link}">${item.link}</p>
            </div>
        `;
    });
    document.getElementById("result-list").innerHTML = resultsHtml;

    const numResults = resultsObj.queries.request[0].totalResults;
    //Calculate the number of pages required to fit all results, with a max of 100 results (Google won't return any results past 100)
    const numPages = Math.floor((Math.min(numResults, 100) - 1) / resultsPerPage) + 1;

    let pageNavHtml = 'Result Page ';
    if (currentPage > 1) {
        pageNavHtml += `<a class="page-nav-link" onclick="pageNav(${currentPage - 1})">Previous</a>`
    }
    for (let i = 1; i <= numPages; i++) {
        if (i != currentPage) {
            pageNavHtml += `<a class="page-nav-link" onclick="pageNav(${i})">${i}</a>`;
        } else {
            pageNavHtml += `<span class="page-nav-link">${i}</span>`;
        }
    }
    if (currentPage < numPages) {
        pageNavHtml += `<a class="page-nav-link" onclick="pageNav(${currentPage + 1})">Next</a>`
    }
    document.getElementById("page-nav").innerHTML = pageNavHtml;
}

