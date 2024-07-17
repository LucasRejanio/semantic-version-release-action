async function checkActionInputs(githubUserName, githubUserEmail, githubUserToken, semanticType) {
  if (githubUserName == '') {
    throw new Error("github-user-name cannot be empty!")
  }
  if (githubUserEmail == '') {
    throw new Error("github-user-email cannot be empty!")
  } 
  if (githubUserToken == '') {
    throw new Error("github-user-token cannot be empty!")
  }
  if (semanticType !== "major" && semanticType !== "minor" && semanticType !== "patch") {
    throw new Error("semantic-type invalid! Set major, minor or patch")
  }
}

module.exports = {
  checkActionInputs
}
