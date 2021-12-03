// ==UserScript==
// @name         Catbox NL check
// @version      0.2
// @match        https://animemusicquiz.com/admin/approveVideos
// @match        https://animemusicquiz.com/admin/approveVideos?skipMp3=true
// @updateURL    https://github.com/Klemkinis/AMQ-Catbox-NL-check/raw/main/Catbox%20NL%20check.user.js
// @grant        GM_xmlhttpRequest
// @connect      catbox.moe
// @run-at: document-end
// ==/UserScript==

var catboxLink = getSongLink()
var nlLink = catboxLink.replace("files.", "nl.")
checkCatboxNLStatus(nlLink)

function checkCatboxNLStatus(songLink) {
    console.log(songLink)
    GM_xmlhttpRequest({
        method: "HEAD",
        url: songLink,
        onload: function(response) {
            displayCatboxNLStatus(response.status == 200)
        }
    })
}

function displayCatboxNLStatus(isAvailable) {
    var songInfoTable = getSongInfoTable()
    var nlStatusRow = songInfoTable.insertRow()
    nlStatusRow.insertCell(0).innerHTML = "NL status"
	nlStatusRow.insertCell(1).innerHTML = isAvailable ? "Available" : "Missing"
    nlStatusRow.cells[1].style.color = isAvailable ? "lightgreen" : "red"
}

function getSongLink() {
	var videoPlayer = getVideoPlayer()
    return videoPlayer.src
}

function getVideoPlayer() {
    var videoPlayer = document.getElementById("avVideo")
    if (videoPlayer == null) {
        throw "Video player is missing or not loaded"
    }
    return videoPlayer
}

function getSongInfoTable() {
    var songInfoTable = document.getElementsByClassName('table')[0]
    if (songInfoTable == null) {
        throw "Song info table is missing!"
    }
    return songInfoTable
}
