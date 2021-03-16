export interface TestSummary {
    featureFile?: string
    videoUrl?: string
    screenshotUrl?: string
    title: string
    pass: boolean
    duration: number
    steps?: TestSummary[]
}

export interface MochawesomeTest {
    title: string
    fullTitle: string
    timedOut: null | boolean
    duration: number
    state: 'passed' | 'failed'
    speed: 'slow' | string
    pass: boolean
    fail: boolean
    pending: boolean
    context: null
    err: object
    uuid: string
    parentUUID: string
    isHook: boolean
    skipped: boolean
}

export interface MochawesomeSuite {
    uuid: string
    title: string
    fullFile: string
    file: string
    tests: MochawesomeTest[]
    suites: MochawesomeSuite[]
    passes: string[]
    failures: string[]
    pending: string[]
    skipped: string[]
    duration: number
    root: boolean
    rootEmpty: boolean
    _timeout: number
}

export interface MochawesomeResult {
    uuid: string
    title: string
    fullFile: string
    file: string
    suites: MochawesomeSuite[]
    passes: []
    failures: []
    pending: []
    skipped: []
    duration: 0
    root: true
    rootEmpty: true
    _timeout: 2000
}

export interface MochawesomeOutput {
    stats: {
        suites: number
        tests: number
        passes: number
        pending: number
        failures: number
        start: string
        end: string
        duration: number
        testsRegistered: number
        passPercent: number
        pendingPercent: number
        other: number
        hasOther: boolean
        skipped: number
        hasSkipped: boolean
    }
    results: MochawesomeResult[]
}
