import { SeedService } from '../src/services/SeedService.js'

async function main() {
    console.log('Manually triggering seed...')
    await SeedService.runSeed()
    console.log('Seed completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
