# cypress-check-run

A Github action written in JavaScript that creates a check run with formatted details following a cypress testing suite. 

## Requirements

1. This action should be ran after [cypress-io/github-action](https://github.com/marketplace/actions/cypress-io) in a workflow
2. Cypress should be setup with [cypress-cucumber-preprocessor](https://www.npmjs.com/package/cypress-cucumber-preprocessor) and [mochawesome](https://www.npmjs.com/package/mochawesome)
3. Test results should be merged to a single `output.json` file using [mochawesome-merge](https://www.npmjs.com/package/mochawesome-merge)
4. An S3 bucket should be setup to receive screenshot and screen recording uploads

## Usage
Add the following to your Github action workflow file
```yaml
- name: Merge cypress output
  run: |
    npm run cypress:merge
- name: cypress-check-run
  uses: soomo/cypress-check-run@1
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    CYPRESS_FOLDER: ${{ github.workspace }}/cypress
    PROJECT_NAME: (Your Project Name)
    BUCKET_NAME: (Your S3 Bucket Name)
    AWS_ACCESS_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
