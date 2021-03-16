type CucumberStatus = 'passed' | 'failed' | 'skipped'

export interface Cucumber {
    keyword: string
    name: string
    line: number
    id: string
    tags?: string[]
    uri: string
    elements: ElementsEntity[]
}

export interface ElementsEntity {
    id: string
    keyword: string
    line: number
    name: string
    tags?: string[]
    type: string
    steps: StepsEntity[]
}

export interface StepsEntity {
    arguments?: string[]
    keyword: string
    line: number
    name: string
    result: Result
}

export interface Result {
    status: CucumberStatus
    duration?: number
    error_message?: string
}
