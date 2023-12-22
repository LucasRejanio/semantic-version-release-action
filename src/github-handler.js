const { execSync } = require('child_process')
const { Octokit } = require('@octokit/core')

var githubRepository = process.env.GITHUB_REPOSITORY; // Repository name (<OWNER>/<REPO_NAME>)

const [owner, repository] = githubRepository.split('/')

async function configureGitUser(gitUserName, githubUserEmail) {
    execSync(`git config --global user.name "${gitUserName}"`)
    execSync(`git config --global user.email "${githubUserEmail}"`)
}

async function commit(fileToAdd, commitMessage) {
    try {
        execSync(`git add ${fileToAdd}`)
        execSync(`git commit -m "${commitMessage}"`)
    } catch (error) {
        throw Error(error)
    }
}

async function push() {
    try {
        execSync('git push')
    } catch (error) {
        throw Error(error)
    }
    
    console.log('[Info]:: Changelog updated and pushed for the repository')
}

function getLatestReleaseVersion() {
    let latestReleaseVersion = ''

    try {
        execSync('git fetch --tags')
        latestReleaseVersion = execSync('git tag -l --sort=-creatordate | head -n 1').toString().trim();
        if (latestReleaseVersion == '') {
            console.info('[Info]:: No release version yet published')
            latestReleaseVersion = 'v0.0.0'
        } else {
            console.info(`[Info]:: Latest release version publish is ${latestReleaseVersion}`)
        }
    } catch (error) {
        throw Error(error)
    }
    
    return latestReleaseVersion
}

function getCommitsBetweenLastRelease(latestReleaseVersion) {
    let commitMessages
    
    if (latestReleaseVersion != 'v0.0.0') {
        const gitLogCommand = `git log --no-merges --format="%s ([%h](https://github.com/${owner}/${repository}/commit/%H))" ${latestReleaseVersion}..HEAD`
        commitMessages = execSync(gitLogCommand).toString().trim()
    } else {
        commitMessages = 'feat: initial release version'
    }
    
    return commitMessages
}

async function publishRelease(githubToken, newReleaseVersion, description) {
    const octokit = new Octokit({
        auth: githubToken
    })
      
    const response = await octokit.request(`POST /repos/${owner}/${repository}/releases`, {
        owner: owner,
        repo: repository,
        tag_name: newReleaseVersion,
        target_commitish: 'main',
        name: newReleaseVersion,
        body: description,
        draft: false,
        prerelease: false,
        generate_release_notes: false,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    if (response.status === 201) {
        console.info(`[Info]:: The new release version ${newReleaseVersion} has been published successfully!`)
    } else {
        throw Error(`[Error]:: Failed to publish release ${newReleaseVersion}!`)
    }
}

module.exports = {
    commit,
    push,
    configureGitUser,
    getLatestReleaseVersion,
    getCommitsBetweenLastRelease,
    publishRelease
}
