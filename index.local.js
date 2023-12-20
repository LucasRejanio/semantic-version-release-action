const githubHandler = require("./src/github-handler")
const changieHandler = require("./src/changie-handler")

var githubToken = process.env.GITHUB_TOKEN;

async function main() {
    try {
        changieHandler.verifyIfChangieIsInitialized()

        const latestReleaseVersion = githubHandler.getLatestReleaseVersion()
        const newReleaseVersion = changieHandler.formatNewReleaseVersion('major', latestReleaseVersion)
        
        const commitMessages = githubHandler.getCommitsBetweenLastRelease(latestReleaseVersion)
        const changelogContent = changieHandler.generateChangelogForNewReleaseVersion(newReleaseVersion, commitMessages)
        
        githubHandler.commit(".changes/ .changie.yaml CHANGELOG.md", `release: create changelog to version ${newReleaseVersion}`)
        githubHandler.push()

        githubHandler.publishRelease(githubToken, newReleaseVersion, changelogContent)
    } catch (error) {
        throw Error(error)
    }
}

main()
