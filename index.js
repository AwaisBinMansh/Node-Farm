const fs = require('fs');
const http = require('http');
const path = require('path');
const { json } = require('stream/consumers');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./module/replaceTemplate');

/////////////////////////////////////////////////////////////////
// File system
// Blocking Code
// const inputText = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(inputText);

// const textOut = `this is what we know about Avocado ${inputText}.\n Create on ${Date.now()}`;
// fs.writeFileSync("./txt/TextOut", textOut);
// console.log("file write succfully");

// Non-Blocking Code

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);

//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your file have been wriiten 😃");
//       });
//     });
//   });
// });
// console.log("Did you read this file ");

/////////////////////////////////////////////////////////////////
// Server

// const Server = http.createServer((req, res) => {
//   const pathname = req.url;

//   if (pathname === "/" || pathname === "overview") {
//     res.end("This is OverView");
//   } else if (pathname === "/product") {
//     res.end("this is product page");
//   } else {
//     res.writeHead(404);
//     res.end("page not found");
//   }
// });

// Server.listen(8000, "127.0.0.1", () => {
//   console.log("Server is listing from 8000");
// });

// Reapting lassen
// Blocking Code

// const inputOut = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(inputOut);

// const read = fs.readFileSync("./txt/append.txt", "utf-8");
// console.log(read);

// Non-Blocking Code

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final1.txt",
//         `${data2},\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("your file have been written");
//         }
//       );
//     });
//   });
// });
// console.log("did you read data");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const Server = http.createServer((req, res) => {
  // DeStructure for product Card
  const { query, pathname } = url.parse(req.url, true);

  // slugify moudule  use
  const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
  console.log(slug);
  //console.log(slugify("Fresh Avocado", { lower: true }));

  //OVERVIEW

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);

    res.end(output);

    // PRODUCT
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-head': 'hello world',
    });
    res.end('<h1>This page is not avilable</h1>');
  }
});

Server.listen(8000, 'localhost', () => {
  console.log('Server is listing from 8000');
});
