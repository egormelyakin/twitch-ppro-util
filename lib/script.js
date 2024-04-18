/* eslint-disable no-unused-vars */

var cs = new CSInterface();

var createElement = (type, classes, text) => {
    var element = document.createElement(type);
    if (classes) {
        element.classList.add(classes);
    }
    if (text) {
        element.innerHTML = text;
    }
    return element;
};

var addVideoSource = () => {
    var videoSourcesContainer = document.getElementsByClassName("video-sources")[0];
    var sourceCount = videoSourcesContainer.children.length;

    var videoSourceElement = createElement("div", "video-source");

    var videoSourceInputsElement = createElement("div", "video-source-inputs");

    var idRowElement = createElement("div", "row");
    var idInputContainer = createElement("div", "video-source-input");
    var idLabelElement = createElement("label", "vod-id-label", "VOD ID");
    idLabelElement.setAttribute("for", `vod-id-${sourceCount + 1}`);
    var idInputElement = createElement("input", "vod-id");
    idInputElement.setAttribute("id", `vod-id-${sourceCount + 1}`);
    idInputElement.setAttribute("type", "text");
    idInputElement.setAttribute("placeholder", "0123456789");
    // idInputElement.setAttribute("maxlength", "10");
    idInputContainer.appendChild(idLabelElement);
    idInputContainer.appendChild(idInputElement);

    var selectBoxContainer = createElement("div", "select-box");
    var selectElement = createElement("select");
    selectElement.setAttribute("name", "video-type");
    selectElement.setAttribute("id", `video-type-${sourceCount + 1}`);
    var twitchOptionElement = createElement("option", null, "Twitch VOD");
    twitchOptionElement.setAttribute("value", "twitch-vod");
    var fileOptionElement = createElement("option", null, "Video File");
    fileOptionElement.setAttribute("value", "video-file");
    selectElement.appendChild(twitchOptionElement);
    selectElement.appendChild(fileOptionElement);
    var selectLabelElement = createElement("label");
    selectLabelElement.innerHTML = `Video Source (${sourceCount + 1})`;
    selectLabelElement.setAttribute("for", `video-type-${sourceCount + 1}`);
    selectBoxContainer.appendChild(selectLabelElement);
    selectBoxContainer.appendChild(selectElement);
    idRowElement.appendChild(selectBoxContainer);
    idRowElement.appendChild(idInputContainer);

    videoSourceInputsElement.appendChild(idRowElement);

    var filePathInputContainer = createElement("div", "video-source-input");
    var filePathLabelElement = createElement("label", "video-file-path-label", "Video File Path");
    filePathLabelElement.setAttribute("for", `video-file-path-${sourceCount + 1}`);
    var filePathInputElement = createElement("input", "video-file-path");
    filePathInputElement.setAttribute("id", `video-file-path-${sourceCount + 1}`);
    filePathInputElement.setAttribute("type", "text");
    filePathInputElement.setAttribute("placeholder", "D:/twitch_leecher/0123456789.mp4");
    filePathInputContainer.appendChild(filePathLabelElement);
    filePathInputContainer.appendChild(filePathInputElement);
    videoSourceInputsElement.appendChild(filePathInputContainer);

    var cacheRowElement = createElement("div", "row");
    cacheRowElement.classList.add("row-spaced");
    var cacheCheckboxElement = createElement("input", "cache-checkbox");
    cacheCheckboxElement.setAttribute("type", "checkbox");
    cacheCheckboxElement.setAttribute("id", `cache-checkbox-${sourceCount + 1}`);
    var cacheLabelElement = createElement("label", "cache-checkbox-label", "Reload cache");
    cacheLabelElement.setAttribute("for", `cache-checkbox-${sourceCount + 1}`);
    var counterElement = createElement("p", "counter");
    var subrowElement = createElement("div", "row");
    subrowElement.appendChild(cacheCheckboxElement);
    subrowElement.appendChild(cacheLabelElement);
    cacheRowElement.appendChild(subrowElement);
    cacheRowElement.appendChild(counterElement);
    videoSourceInputsElement.appendChild(cacheRowElement);

    selectElement.addEventListener("change", (event) => {
        var selectedValue = event.target.value;
        if (selectedValue === "video-file") {
            idInputElement.disabled = true;
            idInputElement.value = "";
            idInputElement.classList.remove("error");
            idLabelElement.innerHTML = "VOD ID (Disabled)";
            filePathInputElement.value = "";
            filePathInputElement.classList.remove("error");
            filePathLabelElement.innerHTML = "Video File Path";
            cacheCheckboxElement.checked = false;
            cacheCheckboxElement.disabled = true;
            cacheLabelElement.innerHTML = "Reload cached data (Disabled)";
            filePathInputElement.focus();
        } else {
            idInputElement.disabled = false;
            idLabelElement.innerHTML = "VOD ID";
            filePathInputElement.value = "";
            filePathInputElement.classList.remove("error");
            filePathLabelElement.innerHTML = "Video File Path";
            cacheCheckboxElement.checked = false;
            cacheCheckboxElement.disabled = false;
            cacheLabelElement.innerHTML = "Reload cached data";
            idInputElement.focus();
        }
    });

    idInputElement.addEventListener("input", async (event) => {
        var folderInput = document.getElementById("twitch-vod-folder");
        var folder = folderInput.value;
        var filename = event.target.value;
        if ((/^\d+$/.test(filename) && filename.length === 10) || filename.length === 0) {
            idInputElement.classList.remove("error");
            idLabelElement.innerHTML = "VOD ID";
        } else {
            idInputElement.classList.add("error");
            idLabelElement.innerHTML = "VOD ID - Invalid";
        }
        if (!filename || !folder) {
            filePathInputElement.value = "";
            filePathInputElement.classList.remove("error");
            filePathLabelElement.innerHTML = "Video File Path";
            return;
        }
        if (folder.slice(-1) !== "/") {
            folder += "/";
        }
        var path = folder + filename + ".mp4";
        filePathInputElement.value = path;
        var exists = await fileExists(cs, path);
        if (!exists) {
            filePathInputElement.classList.add("error");
            filePathLabelElement.innerHTML = "Video File Path - File not found";
        } else {
            filePathInputElement.classList.remove("error");
            filePathLabelElement.innerHTML = "Video File Path";
        }
    });

    idInputElement.addEventListener("paste", async (event) => {
        event.preventDefault();
        var paste = (event.clipboardData || window.clipboardData).getData("text");
        var idFormat = /(\d{10})/;
        var match = paste.match(idFormat);
        if (match) {
            idInputElement.value = match[1];
            idInputElement.dispatchEvent(new Event("input"));
        }
    });

    filePathInputElement.addEventListener("input", async (event) => {
        var path = event.target.value;
        if (!path) {
            filePathInputElement.classList.remove("error");
            filePathLabelElement.innerHTML = "Video File Path";
            return;
        }
        var exists = await fileExists(cs, path);
        if (!exists) {
            filePathInputElement.classList.add("error");
            filePathLabelElement.innerHTML = "Video File Path - File not found";
        } else {
            filePathInputElement.classList.remove("error");
            filePathLabelElement.innerHTML = "Video File Path";
        }
    });

    videoSourceElement.appendChild(videoSourceInputsElement);

    videoSourcesContainer.appendChild(videoSourceElement);
};

var removeVideoSource = () => {
    var videoSources = document.getElementsByClassName("video-sources")[0];
    var sourceCount = videoSources.children.length;
    if (sourceCount > 1) {
        videoSources.removeChild(videoSources.lastChild);
    }
};

var saveConfig = () => {
    var config = document.getElementById("config-container");
    config = config.getElementsByClassName("grid-layout")[0];
    var configFields = config.getElementsByTagName("input");
    for (var i = 0; i < configFields.length; i++) {
        var field = configFields[i];
        localStorage.setItem(field.id, field.value);
    }
};

var loadConfig = () => {
    var config = document.getElementById("config-container");
    config = config.getElementsByClassName("grid-layout")[0];
    var configFields = config.getElementsByTagName("input");
    for (var i = 0; i < configFields.length; i++) {
        var field = configFields[i];
        var value = localStorage.getItem(field.id);
        if (value) {
            field.value = value;
        }
    }
};

var toggleConfig = () => {
    var config = document.getElementById("config-container");
    config.classList.toggle("hidden");
    var configButton = document.getElementById("config-toggle");
    if (config.classList.contains("hidden")) {
        localStorage.setItem("config-hidden", "true");
        configButton.innerHTML = "Show ↓";
    } else {
        localStorage.setItem("config-hidden", "false");
        configButton.innerHTML = "Hide ↑";
    }
};

var toggleLog = () => {
    var log = document.getElementById("log");
    log.classList.toggle("hidden");
    var logButton = document.getElementById("log-toggle");
    if (log.classList.contains("hidden")) {
        localStorage.setItem("log-hidden", "true");
        logButton.innerHTML = "Show ↓";
    } else {
        localStorage.setItem("log-hidden", "false");
        logButton.innerHTML = "Hide ↑";
    }
};

var runScript = (csInterface, fnName, ...args) => {
    return new Promise((resolve, reject) => {
        var payload = `$._PPP_.wrapper("${fnName}"`;
        if (args) {
            payload += `, ${JSON.stringify(args)}`;
        } else {
            payload += ", []";
        }
        payload += ")";

        var debug = true;
        csInterface.evalScript(payload, (result) => {
            if (result === undefined || result === null) {
                reject("No result returned");
            }
            if (debug) {
                console.log(`[JSX] ${payload} -> ${result}`);
            }
            resolve(result);
        });
    });
};

var fileExists = async (csInterface, filePath) => {
    var result = await runScript(csInterface, "fileExists", filePath);
    return result === "true";
};

var folderExists = async (csInterface, folderPath) => {
    var result = await runScript(csInterface, "folderExists", folderPath);
    return result === "true";
};

var readTextFile = async (csInterface, filePath) => {
    var result = await runScript(csInterface, "readTextFile", filePath);
    return result;
};

var writeTextFile = async (csInterface, filePath, textContent) => {
    var result = await runScript(csInterface, "writeTextFile", filePath, textContent);
    return result;
};

var getVideoSources = (document) => {
    var videoSources = document.getElementsByClassName("video-sources")[0];
    var sourceCount = videoSources.children.length;
    var sources = [];
    var valid = true;
    for (var i = 0; i < sourceCount; i++) {
        var source = videoSources.children[i];
        var typeInput = source.querySelector("select");
        var vodIDInput = source.querySelector("input.vod-id");
        var filePathInput = source.querySelector("input.video-file-path");
        var skipCacheInput = source.querySelector("input.cache-checkbox");
        var counter = source.querySelector("p.counter");

        if (typeInput.value === "twitch-vod") {
            if (!vodIDInput.value || vodIDInput.classList.contains("error")) {
                vodIDInput.classList.add("error");
                valid = false;
            }
        }
        // if (!filePathInput.value || filePathInput.classList.contains("error")) {
        //     filePathInput.classList.add("error");
        //     valid = false;
        // }
        if (!valid) {
            return null;
        }

        source = [];
        source.push(typeInput.value);
        source.push(vodIDInput.value);
        source.push(filePathInput.value);
        source.push(skipCacheInput.checked);
        source.push(counter);
        sources.push(source);
    }
    return sources;
};

var getConfig = (document) => {
    var config = document.getElementById("config-container");
    config = config.getElementsByClassName("grid-layout")[0];
    var configFields = config.getElementsByTagName("input");
    var configValues = {};
    for (var i = 0; i < configFields.length; i++) {
        var field = configFields[i];
        configValues[field.id] = field.value;
    }
    return configValues;
};

class Twitch {
    constructor(clientId, clientSecret, cacheFolder) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.cacheFolder = cacheFolder;
        this.accessToken = null;
        this.requestCount = 0;
    }

    async get(url, parameters) {
        if (this.accessToken === null) {
            await this.getAccessToken();
        }
        var headers = new Headers();
        headers.append("Client-ID", this.clientId);
        headers.append("Authorization", `Bearer ${this.accessToken}`);

        var fullUrl = url;
        if (parameters) {
            fullUrl += "?";
            for (var key in parameters) {
                fullUrl += `${key}=${parameters[key]}&`;
            }
            fullUrl = fullUrl.slice(0, -1);
        }
        var response = await fetch(fullUrl, { method: "GET", headers: headers });
        var data = await response.json();
        if (response.status !== 200) {
            var msg = "Error getting data";
            if (data.error) {
                msg += ` - ${data.error}`;
            }
            if (data.message) {
                msg += ` - ${data.message}`;
            }
            console.log(msg);
            return null;
        }
        return data;
    }

    async getAccessToken() {
        console.log("Getting access token...");
        var url = `https://id.twitch.tv/oauth2/token`;
        url += `?client_id=${this.clientId}`;
        url += `&client_secret=${this.clientSecret}`;
        url += `&grant_type=client_credentials`;
        var response = await fetch(url, { method: "POST" });
        var data = await response.json();
        if (data.access_token === undefined) {
            console.log("Error getting access token");
        } else {
            console.log(`Access token -> ${data.access_token}`);
        }
        this.accessToken = data.access_token;
        return data.access_token;
    }

    async getVODInfo(csInterface, vodID, skipCache, callback) {
        callback("Getting VOD info...");
        var vodInfoFile = `${this.cacheFolder}/vod-${vodID}.json`;
        if (await fileExists(csInterface, vodInfoFile)) {
            var response = await runScript(csInterface, "readTextFile", vodInfoFile);
            var vodInfoCached = JSON.parse(response);
        }
        if (!skipCache && vodInfoCached) {
            callback("Got VOD info from cache");
            return vodInfoCached;
        }
        var vodInfoAPI = await this.getVODInfoRequest(vodID, callback);
        if (vodInfoAPI === null && vodInfoCached) {
            callback("Only cached VOD");
            return vodInfoCached;
        }
        await runScript(csInterface, "writeTextFile", vodInfoFile, JSON.stringify(vodInfoAPI));
        return vodInfoAPI;
    }

    async getVODInfoRequest(vodID, callback) {
        if (this.accessToken === null) {
            await this.getAccessToken();
        }
        var url = `https://api.twitch.tv/helix/videos`;
        var parameters = { id: vodID };
        var response = await this.get(url, parameters);
        if (response === null) {
            callback("Error getting VOD");
            return null;
        }
        callback("Got VOD info");
        return response.data[0];
    }

    async getVODClips(csInterface, VOD, count, skipCache, callback) {
        callback("Getting VOD clips...");
        var vodClipsFile = `${this.cacheFolder}/clips-${VOD.id}.json`;
        if (await fileExists(csInterface, vodClipsFile)) {
            var response = await runScript(csInterface, "readTextFile", vodClipsFile);
            var vodClipsCached = JSON.parse(response);
        }
        if (!skipCache && vodClipsCached && vodClipsCached.length >= count) {
            vodClipsCached = vodClipsCached.slice(0, count);
            callback("Got clips from cache");
            return vodClipsCached;
        }
        var vodClipsAPI = await this.getVODClipsRequest(VOD, count, callback);
        if (vodClipsAPI === null && vodClipsCached) {
            callback("Only cached clips");
            return vodClipsCached;
        }
        await runScript(csInterface, "writeTextFile", vodClipsFile, JSON.stringify(vodClipsAPI));
        return vodClipsAPI;
    }

    async getVODClipsRequest(VOD, count, callback) {
        if (this.accessToken === null) {
            await this.getAccessToken();
        }
        var url = "https://api.twitch.tv/helix/clips";
        var parameters = {
            broadcaster_id: VOD.user_id,
            started_at: VOD.created_at,
            first: 100,
        };
        var requests = 0;
        var clips = [];
        var cursor = null;
        while (clips.length < count) {
            if (cursor !== null) {
                parameters.after = cursor;
            }
            var response = await this.get(url, parameters);
            requests++;
            if (response === null) {
                callback("Error getting clips");
                return null;
            }
            var clipsBatch = response.data;
            if (clipsBatch.length === 0) {
                break;
            }
            // if (clipsBatch[0].view_count < 2) {
            //     break;
            // }
            clipsBatch = clipsBatch.filter(
                (clip) => clip.video_id === VOD.id // && clip.view_count > 1
            );
            clips = clips.concat(clipsBatch);
            callback(`Found ${clips.length} clips`);
            if (response.pagination && response.pagination.cursor) {
                cursor = response.pagination.cursor;
            } else {
                break;
            }
            if (requests > 15) {
                callback("Too many requests");
                break;
            }
        }
        clips = clips.slice(0, count);
        if (clips.length === 0) {
            callback("No clips found");
        } else {
            callback(`Got ${clips.length} clips`);
        }
        return clips;
    }
}

var onloaded = () => {
    var console = (function (oldCons) {
        return {
            log: function (text) {
                oldCons.log(text);
                document.getElementById("log").innerHTML += `<p>${text}</p>`;
            },
            info: function (text) {
                oldCons.info(text);
                document.getElementById("log").innerHTML += `<p>${text}</p>`;
            },
            warn: function (text) {
                oldCons.warn(text);
                document.getElementById("log").innerHTML += `<p>${text}</p>`;
            },
            error: function (text) {
                oldCons.error(text);
                document.getElementById("log").innerHTML += `<p>${text}</p>`;
            },
        };
    })(window.console);
    window.console = console;

    var configHidden = localStorage.getItem("config-hidden");
    if (configHidden === "true") {
        toggleConfig();
    }
    var logHidden = localStorage.getItem("log-hidden");
    if (logHidden === "true") {
        toggleLog();
    }

    addVideoSource();
    loadConfig();

    document.getElementById("init-project").addEventListener("click", async () => {
        var videoSources = getVideoSources(document);
        if (videoSources === null) {
            console.log("Invalid video sources");
            return;
        }

        var config = getConfig(document);
        var twitchClientId = config["twitch-client-id"];
        var twitchClientSecret = config["twitch-client-secret"];
        var twitchCacheFolder = config["twitch-cache-folder"];
        var projectsFolder = config["projects-folder"];
        var presetsFolder = config["presets-folder"];

        if (!projectsFolder.endsWith("/")) {
            projectsFolder += "/";
        }

        var twitch = new Twitch(twitchClientId, twitchClientSecret, twitchCacheFolder);

        var now = Date.now();
        var month = new Date(now).toLocaleString("default", { month: "long" });
        var year = new Date(now).getFullYear();
        var dateFolder = `${projectsFolder}${year}-${month}`;
        await runScript(cs, "createFolder", dateFolder);

        var title = "";
        var twitchVODS = videoSources.filter((source) => source[0] === "twitch-vod");
        for (var i = 0; i < twitchVODS.length; i++) {
            var videoSource = twitchVODS[i];
            var [type, vodID, filePath, skipCache, counter] = videoSource;
            var vodInfo = await twitch.getVODInfo(cs, vodID, skipCache, () => {});
            if (vodInfo === null) {
                continue;
            }
            title = `twitch-${vodInfo.user_name}-${vodID}`;
        }
        if (!title) {
            title = "project";
        }
        if (await folderExists(cs, `${dateFolder}/${title}`)) {
            i = 1;
            while (await folderExists(cs, `${dateFolder}/${title}-${i}`)) {
                i++;
            }
            title += `-${i}`;
        }
        var projectFolder = `${dateFolder}/${title}/`;
        await runScript(cs, "createFolder", projectFolder);
        await runScript(cs, "initProject", projectFolder, title, presetsFolder);
    });

    document.getElementById("init-sequence").addEventListener("click", async () => {
        var videoSources = getVideoSources(document);
        if (videoSources === null) {
            console.log("Invalid video sources");
            return;
        }

        var twitchClientId = document.getElementById("twitch-client-id").value;
        var twitchClientSecret = document.getElementById("twitch-client-secret").value;
        var twitchCacheFolder = document.getElementById("twitch-cache-folder").value;

        var twitch = new Twitch(twitchClientId, twitchClientSecret, twitchCacheFolder);
        videoSources.forEach(async (videoSource) => {
            var [type, vodID, filePath, skipCache, counter] = videoSource;
            var callback = (message) => {
                console.log(message);
                counter.innerHTML = message;
            };
            var vodInfo = await twitch.getVODInfo(cs, vodID, skipCache, callback);
            if (vodInfo === null) {
                console.log("VOD info not available");
                return;
            }
            var vodClips = await twitch.getVODClips(cs, vodInfo, 100, skipCache, callback);
        });
    });
};
