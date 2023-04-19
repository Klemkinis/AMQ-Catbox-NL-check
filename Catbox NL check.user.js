// ==UserScript==
// @name         Catbox NL check
// @version      0.7
// @match        https://animemusicquiz.com/admin/approveVideos
// @match        https://animemusicquiz.com/admin/approveVideos?skipMp3=true
// @updateURL    https://github.com/Klemkinis/AMQ-Catbox-NL-check/raw/main/Catbox%20NL%20check.user.js
// @grant        GM_xmlhttpRequest
// @connect      catbox.moe
// @run-at: document-end
// ==/UserScript==

const amqDomain = "https://animemusicquiz.com/"
const status = {
    available: "lightgreen",
    redirected: "yellow",
    unavailable: "red"
}

var songLink = getSongLink()
replaceVideoPreview()
var naStatus = await checkCatboxNAStatus()
var nlStatus = await checkCatboxNLStatus()
displayCatboxStatus()

async function checkCatboxNLStatus() {
    if (getVideoPlayer().src.includes("catbox") == false) { return }
    var nlLink = songLink.replace("files.", "nl.")
    return checkStatus(nlLink, amqDomain)
}

async function checkCatboxNAStatus() {
    if (getVideoPlayer().src.includes("catbox") == false) { return }
    var linkStatus = await checkStatus(songLink, amqDomain)
    if (linkStatus != status.redirected) {
        return linkStatus
    }
    if (await checkStatus(songLink, null) == status.unavailable) {
        return status.unavailable
    } else {
        return status.redirected
    }
}

async function checkStatus(url, referer) {
    return await new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: url,
            headers: { "referer": referer },
            onload: function(response) {
                resolve(statusFrom(response, url))
            }
        })
    })
}

function statusFrom(response, url) {
    if (response.status != 200) {
        return status.unavailable
    } else if (response.finalUrl != url) {
        return status.redirected
    } else {
        return status.available
    }
}

function displayCatboxStatus() {
    var songInfoTable = getSongInfoTable()
    var statusRow = songInfoTable.insertRow()
    statusRow.insertCell(0).innerHTML = "Catbox"
    statusRow.insertCell(1).innerHTML = "<span style='color:" + nlStatus + "';>Europe</span> | <span style='color:" + naStatus + "';>America</span>"
}

function replaceVideoPreview() {
    if (getVideoPlayer().src.includes("catbox") == false) { return }
    getVideoPlayer().src = songLink.replace("files.", "amq.").replace(".moe", ".video")
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
