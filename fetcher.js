const request = require("request");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let url = process.argv[2];
let destination = process.argv[3];

request(url, (error, response, body) => {
  console.log("error:", error);
  console.log("statusCode:", response && response.statusCode);

  if (error || (response && response.statusCode != '200')){
    console.log("200 status code. Existing.")
    process.exit();
  }
  else{
    fs.readFile(destination, "utf8", (error, data) => {
      if (data) {
        rl.question(
          "Pre-existing destination. Do you wish to override? (Y) ",
          response => {
            if (response === "Y") {
              fs.file(destination, body, err => {
                if (err) throw err;
                console.log(
                  `Downloaded and saved ${body.length} bytes to ${destination}`
                );
                rl.close();
              });
            }
            rl.close();
          }
        );
      } else {
        fs.writeFile(destination, body, err => {
          try {
            if (err) {
              throw err;
            }
            console.log(`Downloaded and saved ${body.length} bytes to ${destination}`);
            rl.close();
          } catch (err) {
            console.log("Requested path is invalid");
            rl.close();
          }
        });
      }
    });
  }
});
