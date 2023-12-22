const core = require("@actions/core")

const consfigurator = require('./src/utils/configurator')
const githubHandler = require('./src/github-handler')
const changieHandler = require('./src/changie-handler')

async function main() {
    try {
        const githubUserName = core.getInput('github-user-name').toString()
        const githubUserEmail = core.getInput('github-user-email').toString()
        const githubToken = core.getInput('github-token').toString()
        const semanticType = core.getInput('semantic-type').toString()

        await consfigurator.checkActionInputs(githubUserName, githubUserEmail, githubToken, semanticType)
        await changieHandler.verifyIfChangieIsInitialized()
        await githubHandler.configureGitUser(githubUserName, githubUserEmail)

        const latestReleaseVersion = githubHandler.getLatestReleaseVersion()
        const newReleaseVersion = changieHandler.formatNewReleaseVersion(semanticType, latestReleaseVersion)
        
        const commitMessages = githubHandler.getCommitsBetweenLastRelease(latestReleaseVersion)
        const changelogContent = changieHandler.generateChangelogForNewReleaseVersion(newReleaseVersion, commitMessages)
        
        await githubHandler.commit('.changes/ .changie.yaml CHANGELOG.md', `release: create changelog to version ${newReleaseVersion}`)
        await githubHandler.push()

        await githubHandler.publishRelease(githubToken, newReleaseVersion, changelogContent)
    } catch (error) {
        throw Error(error)
    }
}

main()
