var apiUrl = "https://www.googleapis.com/customsearch/v1";
var key = "AIzaSyBqcrX7zwelHrLUsH0R8KOI-aMCTlnrp3g"; // Google API key
var cx = "014722161919417917553:vmkwzgw4l5u"; // Google search engine ID
var searchParams;

// 10 is the default number of results per page returned by the Google API. It is also the maximum.
var resultsPerPage = 10;

var currentPage = 1;

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
    // Passes reqWords in place of the query to get around an apparent bug where Google doesn't return any results if only required words are sent
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
    var query = Object.keys(searchParams)
        .map(function(k) {return k + '=' + searchParams[k]})
        .join('&');

    var url = apiUrl + "?" + query;

    var http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();

    http.onreadystatechange = function(e) {
        console.log(e);
        try {
            var resultsObj = JSON.parse(http.response);
            populateResultsText(resultsObj);
        } catch (e) {
            console.error(e);
        }
    }
}

function populateResultsText(resultsObj) {
    var resultsHtml = '';
    resultsObj.items.forEach(function(item) {
        resultsHtml += '<hr><div class="result">' +
            '<a class="title" href="' + item.link + '">' + item.htmlTitle + '</a>' +
            '<p class="snippet">' + item.htmlSnippet + '</p>' +
            '<p class="url" title="' + item.link + '">' + item.link + '</p>' +
            '</div>';
    });
    document.getElementById("result-list").innerHTML = resultsHtml;

    var numResults = resultsObj.queries.request[0].totalResults;
    // Calculate the number of pages required to fit all results, with a max of 100 results (Google won't return any results past 100)
    var numPages = Math.floor((Math.min(numResults, 100) - 1) / resultsPerPage) + 1;

    var pageNavHtml = 'Result Page ';
    if (currentPage > 1) {
        pageNavHtml += '<a class="page-nav-link" onclick="pageNav(' + (currentPage - 1) + ')">Previous</a>';
    }
    for (var i = 1; i <= numPages; i++) {
        if (i != currentPage) {
            pageNavHtml += '<a class="page-nav-link" onclick="pageNav(' + i + ')">' + i + '</a>';
        } else {
            pageNavHtml += '<span class="page-nav-link">' + i + '</span>';
        }
    }
    if (currentPage < numPages) {
        pageNavHtml += '<a class="page-nav-link" onclick="pageNav(' + (currentPage + 1) + ')">Next</a>';
    }
    document.getElementById("page-nav").innerHTML = pageNavHtml;
}

