const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const htmlConvert = require("electron-html-to");

// const htmlFile = require("./index.html");


// var conversion = htmlConvert({
//     converterPath: htmlConvert.converters.PDF
//   });
   
//   conversion({ html: htmlFile }, function(err, result) {
//     if (err) {
//       return console.error(err);
//     }
//   });


inquirer
  .prompt({
    message: "Enter your GitHub username:",
    name: "username"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

    axios.get(queryUrl).then(function(res) {
    console.log(res.data);
      const repoNames = res.data.map(function(repo) {
        return repo.name;
      });

      const repoNamesStr = repoNames.join("\n");

      fs.writeFile("repos.txt", repoNamesStr, function(err) {
        if (err) {
          throw err;
        }

        console.log(`Saved ${repoNames.length} repos`);
      });
    });
  });