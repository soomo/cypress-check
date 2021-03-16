import fs from 'fs'
import path from 'path'
import { Cucumber, StepsEntity } from '../cucumber.types'
import { getFiles } from './uploadToS3'

interface GithubAnnotation {
    path: string
    start_line: number
    end_line: number
    annotation_level: 'notice' | 'warning' | 'failure'
    message: string
    title?: string
}

export function cucumberToAnnotations(cucumberFolder: string) {
    return getFiles(cucumberFolder).reduce<GithubAnnotation[]>(
        (annotations, currentFilePath) => [
            ...annotations,
            ...cucumberToAnnotation(currentFilePath.path),
        ],
        []
    )
}

function cucumberToAnnotation(cucumberJsonFilePath: string) {
    const cucumberJson = JSON.parse(
        fs.readFileSync(path.join(cucumberJsonFilePath), 'utf-8')
    ) as Cucumber[]

    const featureFile = cucumberJson[0].uri

    return cucumberJson[0].elements
        .reduce<StepsEntity[]>(
            (failures, currentElement) => [
                ...failures,
                ...currentElement.steps.filter(
                    (s) => s.result.status === 'failed'
                ),
            ],
            []
        )
        .reduce<GithubAnnotation[]>(
            (annotations, currentFailure) => [
                ...annotations,
                {
                    path: `cypress/integration/${featureFile}`,
                    start_line: currentFailure.line,
                    end_line: currentFailure.line,
                    annotation_level: 'failure',
                    message: String(currentFailure.result.error_message),
                    title: `${currentFailure.keyword} ${currentFailure.name}`,
                },
            ],
            []
        )
}
