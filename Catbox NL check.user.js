// ==UserScript==
// @name         Catbox NL check
// @version      0.3
// @match        https://animemusicquiz.com/admin/approveVideos
// @match        https://animemusicquiz.com/admin/approveVideos?skipMp3=true
// @updateURL    https://github.com/Klemkinis/AMQ-Catbox-NL-check/raw/main/Catbox%20NL%20check.user.js
// @grant        GM_xmlhttpRequest
// @connect      catbox.moe
// @run-at: document-end
// ==/UserScript==

var isNAAvailable = undefined
var catboxLink = getSongLink()
checkCatboxNAStatus(catboxLink)

var isNLAvailable = undefined
var nlLink = catboxLink.replace("files.", "nl.")
checkCatboxNLStatus(nlLink)

function checkCatboxNLStatus(songLink) {
    GM_xmlhttpRequest({
        method: "HEAD",
        url: songLink,
        onload: function(response) {
            isNLAvailable = response.status == 200
            displayCatboxStatus()
        }
    })
}

function checkCatboxNAStatus(songLink) {
    GM_xmlhttpRequest({
        method: "HEAD",
        url: songLink,
        onload: function(response) {
            isNAAvailable = response.status == 200
            displayCatboxStatus()
        }
    })
}

function displayCatboxStatus() {
    if (isNAAvailable == undefined) { return }
    if (isNLAvailable == undefined) { return }
    var songInfoTable = getSongInfoTable()
    var statusRow = songInfoTable.insertRow()
    statusRow.insertCell(0).innerHTML = "Catbox"
    statusRow.insertCell(1).innerHTML = "<span style='color:" + (isNLAvailable ? "lightgreen" : "red") + "';>Europe</span> | <span style='color:" + (isNAAvailable ? "lightgreen" : "red") + "';>America</span>"
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
