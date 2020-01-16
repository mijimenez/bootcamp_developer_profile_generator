const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
// const cheerio = require("cheerio");
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

      // Save specific user data
      const userName = `<h1>` + res.data.name + `</h1>`;
      const userBio = `<p>` + res.data.bio + `</p>`;

      // fs.appendFile("index.html", userName,  function(err) {
      //   if (err) {
      //     throw err;
      //   }

      //   console.log(`Saved name to html file!`);
      // });

      // // Append all user data to html page
      // fs.appendFile("index.html", userBio,  function(err) {
      //   if (err) {
      //     throw err;
      //   }

      //   console.log(`Saved bio to html file!`);
      // });

      fs.readFile('./test.html', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var toPrepand = `
        <main>
        <div class="hero">
            <img id="profileImg" src="#">
            <h1>Hi!</h1>
            <h1>My name is <span id="userName">${userName}</span></h1>
            <h2>Currently @ <span id="companyName">[Company Name]</span></h2>
            <div class="info-links">
                <ul>
                    <li id="location"><a href="#" id="locationLink">[City, State]</a></li>
                    <li id="gitHubProfile"><a href="#" id="gitHubProfileLink">GitHub</a></li>
                    <li id="blog"><a href="#" id="blogLink">Blog</a></li>
                </ul>
            </div>
        </div>
        <div class="about">
            <h3 id="userBio">${userBio}</h3>
            <div class="stats">
                <div class="repos">
                    <h4>Public Repositories</h4>
                    <p id="reposNum">##</p>
                </div>
                <div class="followers">
                    <h4>Followers</h4>
                    <p id="followersNum">##</p>
                </div>
                <div class="stars">
                    <h4>GitHub Stars</h4>
                    <p id="starsNum">##</p>
                </div>
                <div class="following">
                    <h4>Following</h4>
                    <p id="followingNum">##</p>
                </div>
            </div>
        </div>
        </main>
        `;
        data = data.replace(/\<\/body>/g, toPrepand + '</body>');
        // console.log(data);

        fs.writeFile("test.html", data,  function(err) {
          if (err) {
            throw err;
          }
          console.log(`Saved everything to html file!`);
        });

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