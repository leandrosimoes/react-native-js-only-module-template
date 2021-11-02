const { execSync } = require('child_process')
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
        const currentQuestion = typeof question === 'function' ? question() : question

        rl.question(`${colours.fg.blue}${currentQuestion}${colours.reset}`, (answer) => {
            if (!answer && isRequired && !defaultValue) {
                printError(`"${paramName}" param isRequired`)
                printWarning('Aborting...')
                process.exit(1)
                return
            }

            resolve(answer || (typeof defaultValue === 'function' ? defaultValue() : defaultValue))
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

const ORIGIN_LIBRARY_NAME = 'react-native-js-only-module-template'
let CURRENT_LIBRARY_NAME = path.basename(process.cwd()) || ORIGIN_LIBRARY_NAME
const ORIGIN_USER_NAME = 'leandrosimoes'
let CURRENT_USER_NAME = ORIGIN_USER_NAME
const DEFAULT_AUTHOR_NAME = 'Leandro Simões'
const DEFAULT_AUTHOR_EMAIL = 'leandro.simoes@outlook.com'

const QUESTION_NAME = `Enter library name (use kebab-case) (default ${CURRENT_LIBRARY_NAME}): `
const QUESTION_USER = `Enter user name (default ${ORIGIN_USER_NAME}): `
const QUESTION_GIT_URL = () => `Enter library git url (default https://github.com/${CURRENT_USER_NAME}/${CURRENT_LIBRARY_NAME}.git: `
const QUESTION_AUTHOR_NAME = () => `Enter author name (default ${CURRENT_USER_NAME}): `
const QUESTION_AUTHOR_EMAIL = () => `Enter author email (default ${CURRENT_USER_NAME}): `
const QUESTION_DELETE_GIT_FOLDER = 'Delete .git folder (Y or N)? (default N)'
const DEFAULT_GIT_URL = () => `https://github.com/${CURRENT_USER_NAME}/${CURRENT_LIBRARY_NAME}.git`
const ORIGIN_GIT_URL = `https://github.com/${ORIGIN_USER_NAME}/${ORIGIN_LIBRARY_NAME}.git`

const renameFiles = (args) => {
    return new Promise(resolve => {
        try {
            const [name, userName, gitUrl, authorName, authorEmail, deleteGitFolder] = args

            // Modify `package.json`
            const packagePath = path.resolve(DEFAULT_PACKAGE_PATH, "package.json")
            const packageData = fs.readFileSync(packagePath).toString()

            const newPackageData = packageData
                    .replace(new RegExp(ORIGIN_GIT_URL.replace('.git', ''), 'g'), gitUrl.replace('.git', ''))
                    .replace(new RegExp(ORIGIN_LIBRARY_NAME, 'g'), name)
                    .replace(DEFAULT_AUTHOR_NAME, authorName)
                    .replace(DEFAULT_AUTHOR_EMAIL, authorEmail)
                    .replace(/"description": ".+"/g, `"description": "A module by ${authorName}"`)
                    .replace(/"title": ".+"/g, `"title": "A module by ${authorName}"`)
                    .replace(/"version": ".+"/g, '"version": "1.0.0"')

            fs.writeFileSync(packagePath, newPackageData)

            // Modify `package-lock.json`
            const packageLockPath = path.resolve(DEFAULT_PACKAGE_PATH, "package-lock.json")
            const packageLockData = fs.readFileSync(packageLockPath).toString()
            const newPackageLockData = packageLockData.replace(new RegExp(ORIGIN_LIBRARY_NAME, 'g'), name)

            fs.writeFileSync(packageLockPath, newPackageLockData)

            // Modify author in `LICENSE`
            const licensePath = path.resolve(DEFAULT_PACKAGE_PATH, "LICENSE")
            const licenseData = fs.readFileSync(licensePath).toString()
            const newLicenseData = licenseData.replace(DEFAULT_AUTHOR_NAME, authorName)

            fs.writeFileSync(licensePath, newLicenseData)

            // Start renaming example project
            // Remove package-lock.json
            if (fs.existsSync(path.resolve(DEFAULT_EXAMPLE_PATH, 'package-lock.json')))
                fs.unlinkSync(path.resolve(DEFAULT_EXAMPLE_PATH, 'package-lock.json'))

            // Modify `package.json`
            const packageSamplePath = path.resolve(DEFAULT_EXAMPLE_PATH, "package.json")
            const packageDataSample = fs.readFileSync(packageSamplePath).toString()
            const newPackageDataSample = packageDataSample.replace(new RegExp(ORIGIN_LIBRARY_NAME, 'g'), name)

            fs.writeFileSync(packageSamplePath, newPackageDataSample)

            // Modify `prepare.js`
            const prepareJSPath = path.resolve(DEFAULT_EXAMPLE_PATH, "prepare.js")
            const prepareJSData = fs.readFileSync(prepareJSPath).toString()
            const newPrepareJSData = prepareJSData.replace(new RegExp(ORIGIN_LIBRARY_NAME, 'g'), name)

            fs.writeFileSync(prepareJSPath, newPrepareJSData)

            // Modify `README.md`
            const readMePath = path.resolve(DEFAULT_EXAMPLE_PATH, "README.md")
            const readMeData = fs.readFileSync(readMePath).toString()
            const newReadMeData = readMeData.replace(new RegExp(ORIGIN_LIBRARY_NAME, 'g'), name)

            fs.writeFileSync(readMePath, newReadMeData)

            // Modify `index.tsx`
            const indexTSXPath = path.resolve(DEFAULT_EXAMPLE_PATH, "src", "App", "index.tsx")
            const indexTSXData = fs.readFileSync(indexTSXPath).toString()
            const newIndexTSXData = indexTSXData.replace(new RegExp(ORIGIN_LIBRARY_NAME, 'g'), name)

            fs.writeFileSync(indexTSXPath, newIndexTSXData)

            // Delete the .git
            if (deleteGitFolder === 'Y' && fs.existsSync(path.resolve(__dirname, '.git')))
                execSync('rm -rf .git')

            resolve()
        } catch (error) {
            printError(error.message)
            process.exit(1)
        }
    })
}

;(async () => {
    const questions = [
        {
            question: QUESTION_NAME,
            paramName: 'Library Name',
            defaultValue: CURRENT_LIBRARY_NAME
        },
        {
            question: QUESTION_USER,
            paramName: 'User Name',
            defaultValue: ORIGIN_USER_NAME
        },
        {
            question: QUESTION_GIT_URL,
            paramName: 'Library Git URL',
            defaultValue: DEFAULT_GIT_URL
        },
        {
            question: QUESTION_AUTHOR_NAME,
            paramName: 'Author Name',
            defaultValue: () => CURRENT_USER_NAME
        },
        {
            question: QUESTION_AUTHOR_EMAIL,
            paramName: 'Author Email',
            defaultValue: () => CURRENT_USER_NAME
        },
        {
            question: QUESTION_DELETE_GIT_FOLDER,
            paramName: 'Author Email',
            defaultValue: 'N'
        },
    ]

    const answers = []

    await asyncForEach(questions, async (question) => {
        const answer = await asyncQuestion({ ...question })

        if (question.paramName === 'Library Name')
            CURRENT_LIBRARY_NAME = answer || ORIGIN_LIBRARY_NAME

        if (question.paramName === 'User Name')
            CURRENT_USER_NAME = answer || ORIGIN_USER_NAME

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