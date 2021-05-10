import fs from 'fs'

import { Coverage } from '../types/coverage.types'

export function parseCoverageData(coverageFile: string) {
    try {
        if (fs.existsSync(coverageFile)) {
            const coverageData = JSON.parse(
                fs.readFileSync(coverageFile).toString()
            ) as Coverage
            return coverageData['total']
        }
    } catch (err) {
        return null
    }
}

// parseCoverageData(path.join(`cypress`, `coverage`, `coverage-summary.json`))
