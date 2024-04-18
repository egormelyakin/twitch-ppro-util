endpoints = {
    readTextFile: function (filePath) {
        var file = new File(filePath);
        if (file.exists) {
            file.open("r");
            file.encoding = "UTF8";
            var text = file.read();
            file.close();
            return text;
        } else {
            return false;
        }
    },

    writeTextFile: function (filePath, textContent) {
        var file = new File(filePath);
        file.open("w");
        file.encoding = "UTF8";
        file.write(textContent);
        file.close();
    },

    createFolder: function (folderPath) {
        var folder = new Folder(folderPath);
        if (!folder.exists) {
            folder.create();
        }
        return folder.exists;
    },

    fileExists: function (filePath) {
        var file = new File(filePath);
        return file.exists;
    },

    folderExists: function (folderPath) {
        var folder = new Folder(folderPath);
        return folder.exists;
    },

    openProjects: function () {
        var projects = app.projects;
        var projectPaths = [];
        for (var i = 0; i < projects.length; i++) {
            projectPaths.push(projects[i].path);
        }
        return projectPaths;
    },

    initProject: function (path, name, presetsFolder) {
        if (path[path.length - 1] != "/") {
            path += "/";
        }
        path += name;
        app.newProject(path);
        app.openDocument(path);

        var projects = app.projects;
        var toClose = [];
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].name != name + ".prproj") {
                toClose.push(i);
            }
        }
        for (var i = toClose.length - 1; i >= 0; i--) {
            projects[toClose[i]].closeDocument();
        }
        var project = app.project;
        if (presetsFolder[presetsFolder.length - 1] != "/") {
            presetsFolder += "/";
        }
        presetPath = presetsFolder + "full-hd.sqpreset";
        app.enableQE();
        qe.project.newSequence("VOD", presetPath);
        return project.openSequence("VOD");
    },
};

$._PPP_ = {
    wrapper: function (fnName, args) {
        try {
            var result = endpoints[fnName].apply(this, args);
            return result;
        } catch (e) {
            return e.toString() + " (" + e.line + ")";
        }
    },
};
