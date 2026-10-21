# Releasing StyloftCSS

The website build creates a versioned, content-hashed ZIP and SHA-256 checksum under website/public/downloads/releases/. It contains CSS, the license and HTML examples, not website runtime scripts. Current version: 0.1.0 release candidate. No remote release or npm publication is implied.

Before an official release: review CHANGELOG.md, run npm test, npm run test:browser, npm run site:build and npm run site:test. Run the accessibility review. Check the ZIP checksum and extract the examples. Review browser support in /guides/#browser-support.

For a new release, increment package.json and package-lock.json together, update the changelog, rebuild, and preserve published archives. Create a Git tag and GitHub release only when the owner authorizes publication. npm publishing also requires a package-name and account review; the package currently has private:true.
