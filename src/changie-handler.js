const fs = require('fs');
const { execSync } = require('child_process')

async function verifyIfChangieIsInitialized() {
  const filePath = '.changie.yaml';

  if (fs.existsSync(filePath)) {
    console.log('[Info]:: Changie is initialized');
  } else {
    console.log('[Info]:: Changie is not initialized. Generating configurations...');
    execSync('./changie init').toString().trim()
  }
}

function formatNewReleaseVersion(semanticType, latestReleaseVersion) {
  let newReleaseVersion
  
  switch (semanticType) {
    case 'major':
      const majorVersion = parseInt(latestReleaseVersion.split("v")[1].split(".")[0]);
      const nextMajorVersion = majorVersion + 1;
      newReleaseVersion = `v${nextMajorVersion}.0.0`;
      break;
    case 'minor':
      const minorVersion = parseInt(latestReleaseVersion.split('.')[1]);
      const nextMinorVersion = minorVersion + 1;
      newReleaseVersion = `${latestReleaseVersion.split('.')[0]}.${nextMinorVersion}.${latestReleaseVersion.split('.')[2]}`;
      break;
    case 'patch':
      const patchVersion = parseInt(latestReleaseVersion.split('.')[2]);
      const nextPatchVersion = patchVersion + 1;
      newReleaseVersion = `${latestReleaseVersion.split('.')[0]}.${latestReleaseVersion.split('.')[1]}.${nextPatchVersion}`;
      break;
    default:
      console.log(`Sorry, we are out of ${semanticType}. Set major, minor or patch`);
  }

  console.info(`[Info]:: The next ${semanticType} release version will be ${newReleaseVersion}`)
  return newReleaseVersion
}

function generateChangelogForNewReleaseVersion(newReleaseVersion, commitsMessages) {
  const date = new Date().toISOString().split('T')[0]
  
  const changelogHeader = `## ${newReleaseVersion} - ${date}`

  let addedSection = ''
  let fixedSection = ''
  let changedSection = ''

  const lines = commitsMessages.split('\n')

  // Loop over lines in commitsMessages
  for (const line of lines) {
    if (line.startsWith('feat:')) {
      addedSection += `\n*${line.substring(5)}`
    } else if (line.startsWith('feat(')) {
      addedSection += `\n* ${line.substring(4)}`
    } else if (line.startsWith('refactor:')) {
      changedSection += `\n*${line.substring(9)}`
    } else if (line.startsWith('refactor(')) {
      changedSection += `\n* ${line.substring(8)}`
    } else if (line.startsWith('fix:')) {
      fixedSection += `\n*${line.substring(4)}`
    } else if (line.startsWith('fix(')) {
      fixedSection += `\n* ${line.substring(3)}`
    }
  }

  let changelogContent = changelogHeader

  // Populating content with commits messages
  if (addedSection) {
    changelogContent += `\n### Added${addedSection}\n`
  } if (changedSection) {
    changelogContent += `\n### Changed${changedSection}\n`
  } if (fixedSection) {
    changelogContent += `\n### Fixed${fixedSection}\n`
  }

  if (!addedSection && !changedSection && !fixedSection) {
    changelogContent += '\n* no relevant changes (feat, refactor, fix) between this release version and the last one\n'
  }

  const outputFilePath = `./.changes/${newReleaseVersion}.md`

  // Write version file and merge with CHANGELOG
  fs.writeFileSync(outputFilePath, changelogContent)
  
  execSync('./changie merge').toString().trim()
  
  console.log(`[Info]:: Changelog file to new release version ${newReleaseVersion} created with successfully!`)
  
  return changelogContent
}

module.exports = {
  verifyIfChangieIsInitialized,
  formatNewReleaseVersion,
  generateChangelogForNewReleaseVersion
}
