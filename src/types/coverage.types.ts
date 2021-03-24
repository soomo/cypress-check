export interface CoverageResult {
    total: number
    covered: number
    skipped: number
    pct: number
}

export interface CoverageResultGroup {
    lines: CoverageResult
    statements: CoverageResult
    functions: CoverageResult
    branches: CoverageResult
}

export interface Coverage {
    [key: string]: CoverageResultGroup
}
