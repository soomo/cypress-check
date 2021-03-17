import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'

import { formatSummaryData, buildSummaryData } from './utils/summary'
import { MochawesomeOutput } from './types/mochawesome.types'
import { uploadFolder } from './utils/uploadToS3'
import { cucumberToAnnotations } from './utils/cucumberToAnnotation'

const ACTION_NAME = 'cypress-check'

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN', { required: true })
    const CYPRESS_FOLDER = core.getInput('CYPRESS_FOLDER', { required: true })
    const PROJECT_NAME = core.getInput('PROJECT_NAME', { required: true })
    const BUCKET_NAME = core.getInput('BUCKET_NAME', { required: true })
    const AWS_ACCESS_ID = core.getInput('AWS_ACCESS_ID', {required: true })
    const AWS_SECRET_KEY = core.getInput('AWS_SECRET_KEY', { required: true })

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

    const outputJson = fs.readFileSync(path.join(`${CYPRESS_FOLDER}/reports/output.json`), 'utf-8')
    
    const summary = buildSummaryData(
        JSON.parse(outputJson) as MochawesomeOutput,
        videoUrls,
        screenshotUrls
    )

    await octokit.checks.create({
        ...ownership,
        name: ACTION_NAME,
        head_sha: context.sha,
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
