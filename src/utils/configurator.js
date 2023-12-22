async function checkActionInputs(githubUserName, githubUserEmail, githubToken, semanticType) {
    if (githubUserName == '') {
        throw new Error("github-user-name cannot be empty!")
    }
    if (githubUserEmail == '') {
        throw new Error("github-user-email cannot be empty!")
    } 
    if (githubToken == '') {
        throw new Error("github-token cannot be empty!")
    }
    if (semanticType !== "major" && semanticType !== "minor" && semanticType !== "patch") {
        throw new Error("semantic-type invalid! Set major, minor or patch")
    }
}

module.exports = {
    checkActionInputs
}
