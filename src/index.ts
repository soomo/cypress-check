import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'

import { formatSummaryData, buildSummaryData } from './summary'
import { MochawesomeOutput } from './types'
import { uploadFolder } from './utils/uploadToS3'
import { cucumberToAnnotations } from './utils/cucumberToAnnotation'

const ACTION_NAME = 'cypress-check'

function buildSummary(
    outputFilePath: string,
    videoUrls: string[],
    screenshotUrls: string[]
) {
    const outputJson = fs.readFileSync(path.join(outputFilePath), 'utf-8')

    return buildSummaryData(
        JSON.parse(outputJson) as MochawesomeOutput,
        videoUrls,
        screenshotUrls
    )
}

async function run() {
    const GITHUB_TOKEN = core.getInput('token', { required: true })
    const CYPRESS_FOLDER = core.getInput('cypress_folder', { required: true })
    const BUCKET_NAME = core.getInput('BUCKET_NAME')
    const PROJECT_NAME = core.getInput('PROJECT_NAME')
    const AWS_ACCESS_ID = core.getInput('AWS_ACCESS_ID')
    const AWS_SECRET_KEY = core.getInput('AWS_SECRET_KEY')
    const octokit = github.getOctokit(GITHUB_TOKEN)
    const { context } = github
    const ownership = {
        owner: context.repo.owner,
        repo: context.repo.repo,
    }

    const FOLDER_IN_BUCKET = `${PROJECT_NAME}/actions/${ACTION_NAME}/commits/${context.sha}`

    const videoUrls = await uploadFolder({
        LOCAL_FOLDER: `${CYPRESS_FOLDER}/videos`,
        FOLDER_IN_BUCKET: `${FOLDER_IN_BUCKET}/videos`,
        BUCKET_NAME,
        AWS_ACCESS_ID,
        AWS_SECRET_KEY,
    })

    const screenshotUrls = await uploadFolder({
        LOCAL_FOLDER: `${CYPRESS_FOLDER}/screenshots`,
        FOLDER_IN_BUCKET: `${FOLDER_IN_BUCKET}/screenshots`,
        BUCKET_NAME,
        AWS_ACCESS_ID,
        AWS_SECRET_KEY,
    })

    const summary = buildSummary(
        `${CYPRESS_FOLDER}/reports/output.json`,
        videoUrls || [],
        screenshotUrls || []
    )

    await octokit.checks.create({
        ...ownership,
        name: 'Soomo Check',
        head_sha: context.sha,
        details_url: 'https://soomolearning.com',
        conclusion: summary.reduce(
            (result, current) => (!current.pass ? false : result),
            true
        )
            ? 'success'
            : 'failure',
        output: {
            title: 'Check Output',
            summary: formatSummaryData(summary),
            annotations: cucumberToAnnotations(
                `${CYPRESS_FOLDER}/cucumber-json`
            ),
        },
    })
}

run()
