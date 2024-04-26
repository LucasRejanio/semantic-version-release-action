<img src="assets/git-logo.png" width="100">

# Semantic Version Release Action

A simple action that generate semantic versions release using the changie.dev.
> You can read more about semantic version [here](https://semver.org/)

## Inputs

| Name | Description | Default | Required |
|--- |--- |--- |--- |
| github-user-name | A user name for git operations in the release repository. | Null | Yes |
| github-user-email | A user email for git operations in the release repository. | Null | Yes |
| github-user-token | A user token for git operations in the release repository. | Null | Yes |
| semantic-type | Semantic type (major.minor.patch) | Null | Yes |

## Example usage

```yaml
- name: Publish New Semantic Version Release
  uses: ${{ env.ORGANIZATION_OR_USER }}/semantic-version-release-action@main
  with:
    github-user-name: ${{ env.YOUR_USER_NAME }}
    github-user-email: ${{ env.YOUR_USER_EMAIL }}
    github-user-token: ${{ env.YOUR_GITHUB_TOKEN }}
    semantic-type: ${{ env.SEMANTIC_TYPE }}
```
