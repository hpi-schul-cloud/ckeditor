# CKEditor

Custom version of CKEditor5 for the Schulcloud-Verbund-Software-Client

## Install

```sh
npm i @hpi-schul-cloud/ckeditor
```

## Supported editor modes

- Classic Toolbar
- Balloon Toolbar
- Inline Toolbar

## Built-in plugins

- AutoFormat
- Bold
- Essentials
- FontBackgrounColor
- FontColor
- Heading
- HorizontalLine
- Image
- ImageInsertViaUrl
- Italic
- Link
- List
- Math
- Paragraph
- RemoveFormat
- SpecialCharacters
- SpecialCharactersEssentials
- Strikethrough
- Subscript
- Superscript
- Table
- TableToolbar
- WordCount

Note: The included image plugins only support an image insertion via URL, not via upload.

## Supported languages

- de
- en
- es
- uk

## Developing and Releasing the Library

When working on @hpi-schul-cloud/ckeditor, please follow this workflow:

- Create a feature branch and submit a Pull Request (PR) with your changes.
- **Do not include version bumps** (e.g. changes to the version field in package.json) in your feature PR. Version updates must be made in a separate PR after the feature is merged.
- **Tagging is restricted to the main branch**. Once a version bump PR is merged into main, a tag can be created.
- **Publishing to GitHub Packages and npm is automated** and triggered by pushing a tag to main.
- This ensures clean diffs, simplifies testing via GitHub Packages, and avoids publishing broken or intermediate states of the package.

This ensures clean diffs, simplifies testing via GitHub Packages, and avoids publishing broken or intermediate states of the package.

## Installing a Temporary Dev Version (for Testing Only)

To install a temporary development version of @hpi-schul-cloud/ckeditor from GitHub Packages (e.g. for testing a PR), authentication is required — even for public repos.
1. Create a GitHub Personal Access Token (PAT) with the read:packages permission. You can create a token here https://github.com/settings/tokens
2. Login to GitHub’s npm registry:
```sh
npm login --registry=https://npm.pkg.github.com/ --scope=@hpi-schul-cloud
```
Use your GitHub username, **the PAT as your password**, and any email.

3. Install the package:
```sh
npm install @hpi-schul-cloud/ckeditor@0.0.1-<commit-sha>
```

⚠️ These versions are temporary and intended only for testing. They’ll be replaced by official npm releases once finalized.







