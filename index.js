const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
// const HTMLToPDF = require('convert-html-to-pdf');
 

// HELP: Practice converting html to pdf - error: "HTMLToPDF is not a constructor"
// const htmlToPDF = new HTMLToPDF(`
//   <div>Hello world</div>
// `);

// htmlToPDF.convert()
//   .then((buffer) => {
//     // do something with the PDF file buffer
//   })
//   .catch((err) => {
//     // do something on error
//   });




// Prompt user's GitHub username and store name, location, reops, etc., and then append these results to the html file
inquirer
  .prompt({
    message: "Enter your GitHub username:",
    name: "username"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl).then(function(res) {
    console.log(res.data);

      const userName = `<h1>` + res.data.name + `</h1>`;
      const userBio = `<p>` + res.data.bio + `</p>`;

      fs.appendFile("index.html", userName,  function(err) {
        if (err) {
          throw err;
        }

        console.log(`Saved name to html file!`);
      });

      fs.appendFile("index.html", userBio,  function(err) {
        if (err) {
          throw err;
        }

        console.log(`Saved bio to html file!`);
      });
    });
  });

  
// Example logging repos from activity 33
// inquirer
//   .prompt({
//     message: "Enter your GitHub username:",
//     name: "username"
//   })
//   .then(function({ username }) {
//     const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

//     axios.get(queryUrl).then(function(res) {
//     // console.log(res.data);
//       const repoNames = res.data.map(function(repo) {
//         return repo.name;
//       });
//       const repoNamesStr = repoNames.join("\n");

//       fs.writeFile("repos.html", repoNamesStr, function(err) {
//         if (err) {
//           throw err;
//         }

//         console.log(`Saved ${repoNames.length} repos`);
//       });
//     });
//   });