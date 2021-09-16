throw new Error()

const fs = require('fs')
const path = require('path')
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

const printError = (message) => {
    console.log(colours.fg.red, message, colours.reset)
}

const printWarning = (message) => {
    console.log(colours.fg.yellow, message, colours.reset)
}

const printSuccess = (message) => {
    console.log(colours.fg.green, message, colours.reset)
}

const printInfo = (message) => {
    console.log(colours.fg.blue, message, colours.reset)
}

const asyncQuestion = async ({ question, isRequired = true, paramName = 'Unknown', defaultValue = '' }) => {
    return new Promise(resolve => {
        rl.question(`${colours.fg.blue}${question}${colours.reset}`, (answer) => {
            if (!answer && isRequired && !defaultValue) {
                printError(`"${paramName}" param isRequired`)
                printWarning('Aborting...')
                process.exit(1)
                return
            }

            resolve(answer || defaultValue)
        })
    })
}

const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

const DEFAULT_PACKAGE_PATH = path.resolve(__dirname, "package")
const DEFAULT_EXAMPLE_PATH = path.resolve(__dirname, "example")

const renameFiles = (args) => {
    return new Promise(resolve => {
        const [name, url, gitUrl, authorName, authorEmail] = args

        // Replacing README.md files
        fs.writeFileSync('README.md', `#${name}`)
        fs.writeFileSync(path.resolve(DEFAULT_PACKAGE_PATH, "README.md"), `#${name}`)

        // Modify `package.json`
        const packageData = fs.readFileSync(path.resolve(DEFAULT_PACKAGE_PATH, "package.json")).toString()
        const newPackageData = packageData
                .replace(DEFAULT_GIT_URL, gitUrl)
                .replace(DEFAULT_URL, url)
                .replace(new RegExp(DEFAULT_NAME, 'g'), name)
                .replace(DEFAULT_AUTHOR_NAME, authorName)
                .replace(DEFAULT_AUTHOR_EMAIL, authorEmail)
                .replace(/"description": ".+"/g, `"description": "A module by ${DEFAULT_AUTHOR_NAME}"`)
                .replace(/"version": ".+"/g, '"version": "1.0.0"')

        fs.writeFileSync(path.resolve(DEFAULT_PACKAGE_PATH, "package.json"), newPackageData)

        // Modify `package-lock.json`
        const packageLockData = fs.readFileSync(path.resolve(DEFAULT_PACKAGE_PATH, "package-lock.json")).toString()
        const newPackageLockData = packageLockData.replace(new RegExp(DEFAULT_NAME, 'g'), name)

        fs.writeFileSync('package-lock.json', newPackageLockData)

        // Modify author in `LICENSE`
        const licenseData = fs.readFileSync(path.resolve(DEFAULT_PACKAGE_PATH, "LICENSE")).toString()
        const newLicenseData = licenseData.replace(DEFAULT_AUTHOR_NAME, authorName)
        fs.writeFileSync('LICENSE', newLicenseData)

        // Start renaming example project
        // Remove package-lock.json
        fs.unlinkSync(path.resolve(DEFAULT_EXAMPLE_PATH, 'package-lock.json'))

        // Modify `package.json`
        const packageDataSample = fs.readFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "package.json")).toString()
        const newPackageDataSample = packageDataSample.replace(new RegExp(DEFAULT_NAME, 'g'), name)

        fs.writeFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "package.json"), newPackageDataSample)

        // Modify `prepare.js`
        const prepareJSData = fs.readFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "prepare.js")).toString()
        const newPrepareJSData = prepareJSData.replace(new RegExp(DEFAULT_NAME, 'g'), name)

        fs.writeFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "prepare.js"), newPrepareJSData)

        // Modify `README.md`
        const readMeData = fs.readFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "README.md")).toString()
        const newReadMeData = readMeData.replace(new RegExp(DEFAULT_NAME, 'g'), name)

        fs.writeFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "README.md"), newReadMeData)

        // Modify `index.tsx`
        const indexTSXData = fs.readFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "src", "App", "index.tsx")).toString()
        const newIndexTSXData = indexTSXData.replace(new RegExp(DEFAULT_NAME, 'g'), name)

        fs.writeFileSync(path.resolve(DEFAULT_EXAMPLE_PATH, "src", "App", "index.tsx"), newIndexTSXData)

        resolve()
    })
}

const DEFAULT_USER = 'leandrosimoes'
const DEFAULT_NAME = 'react-native-js-only-module-template'
const DEFAULT_URL = `https://github.com/${DEFAULT_USER}/${DEFAULT_NAME}`
const DEFAULT_GIT_URL = `https://github.com/${DEFAULT_USER}/${DEFAULT_NAME}.git`
const DEFAULT_AUTHOR_NAME = 'Leandro Simões'
const DEFAULT_AUTHOR_EMAIL = 'leandro.simoes@outlook.com'

const QUESTION_NAME = `Enter library name (use kebab-case) (default ${DEFAULT_NAME}): `
const QUESTION_URL = `Enter library homepage (default ${DEFAULT_URL}): `
const QUESTION_GIT_URL = `Enter library git url (default ${DEFAULT_GIT_URL}): `
const QUESTION_AUTHOR_NAME = `Enter author name (default ${DEFAULT_AUTHOR_NAME}): `
const QUESTION_AUTHOR_EMAIL = `Enter author email (default ${DEFAULT_AUTHOR_EMAIL}): `

;(async () => {
    const questions = [
        {
            question: QUESTION_NAME,
            paramName: 'Library Name',
            defaultValue: DEFAULT_NAME
        },
        {
            question: QUESTION_URL,
            paramName: 'Library Homepage',
            defaultValue: DEFAULT_URL
        },
        {
            question: QUESTION_GIT_URL,
            paramName: 'Library Git URL',
            defaultValue: DEFAULT_GIT_URL
        },
        {
            question: QUESTION_AUTHOR_NAME,
            paramName: 'Author Name',
            defaultValue: DEFAULT_AUTHOR_NAME
        },
        {
            question: QUESTION_AUTHOR_EMAIL,
            paramName: 'Author Email',
            defaultValue: DEFAULT_AUTHOR_EMAIL
        },
    ]

    const answers = []

    await asyncForEach(questions, async (question) => {
        const answer = await asyncQuestion({ ...question })
        answers.push(answer)
    })

    await renameFiles(answers)    

    printSuccess("\nDone!");
    process.exit(0);
})()

rl.on("close", function() {
    printWarning('\nAborting...')
    process.exit(0);
});