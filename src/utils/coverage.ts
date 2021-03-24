import fs from 'fs'
import path from 'path'

import { Coverage } from '../types/coverage.types'

export function parseCoverageData(coverageFile: string) {
    const coverageData = JSON.parse(fs.readFileSync(coverageFile).toString()) as Coverage
    return coverageData['total']
}

// parseCoverageData(path.join(`cypress`, `coverage`, `coverage-summary.json`))
