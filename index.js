const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");

// for the editor questions, the default editor will be launched. For my machine, it is Vim.
// press i to start typing, press esc key then :x enter to save your answer.

const questions = [
  {
    type: "input",
    name: "username",
    message: "What is your GitHub username?"
  },
  {
    type: "input",
    name: "title",
    message: "What is your project's title?"
  },
  {
    type: "input",
    name: "description",
    message: "Write a brief description of your application."
  },
  {
    type: "checkbox",
    message: "What languages did you use to build this application?",
    name: "stack",
    choices: [
      "HTML", 
      "CSS",
      "Python",
      "JavaScript",
      "Node.js"
    ]
  },
  {
    type: "editor",
    message: "What are the steps to install the application?",
    name: "installation",
  },
  {
    type: "editor",
    message: "Describe the usage of the application.",
    name: "usage",
  },
  {
    type: "editor",
    message: "Add credits",
    name: "credits",
  },
  {
    type: "editor",
    message: "Add contributors",
    name: "contributors",
  },
  {
    type: "editor",
    message: "Any questions?",
    name: "questions",
  },
  {
    type: "list",
    message: "Which license would you like to use?",
    default: "MIT",
    name: "license",
    choices: [
      "MIT", 
      "Apache 2.0",
      "GNU GPL v3.0"
    ]
  }
]

const api = {
  getUser: function(username, inputData) {
    axios
    .get(`https://api.github.com/users/${username}`)
    .then(function(res) {
      apiCallback(res, inputData)
  });
  }
}

const generateBadge = (license) =>{
  if (license === "MIT"){
    return `\r[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`;
  } else if (license === "Apache 2.0"){
     return `\r[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`
  } else if (license === "GNU GPL v3.0"){
    return `\r[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)`
  } 
}

const generateStackList = (stack) => {
  let stackList = "";
  stack.forEach(stack => {
    stackList = stackList + 
    `\r* ${stack}
    `
  
  })
  return stackList;
}

const generateMarkdown = (userData, data) => {
  let licenseBadge = generateBadge(data.license)
  let stackList = generateStackList(data.stack)

  return `
# ${data.title}
${licenseBadge}
## By ${userData.data.name}
![${userData.data.name}'s Pic](${userData.data.avatar_url})

## Table Of Contents
1. Description
2. Technologies Used
3. Installation
4. Usage
5. Contributors
6. Questions
7. Credits

## Description
${data.description}
## Technologies Used
${stackList}
## Installation
${data.installation}
## Usage
${data.usage}
## Contributors
${data.contributors}
## Questions
${data.questions}
## Credits 
${data.credits}
`  
}

const apiCallback = (userData, data) => {
  let readmeText =  generateMarkdown(userData, data);
  writeToFile("README.md", readmeText)
}

const inquirerPrompts = () =>{
  inquirer.prompt(questions).then(function(data) {

    api.getUser(data.username, data)

    console.log(data.title)
    console.log(data.stack)
  
    // let readmeText = generateMarkdown(data);
    // writeToFile("README.md", readmeText)
  });
}

function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("Success!");
  });
}

function init() {
  inquirerPrompts();
}

init();
