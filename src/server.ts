import express, { Router } from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import multer from 'multer'
const path = require("path");


const app = express();
const mysql = require('mysql2');

//*** for file upload **//
// const fileUpload = require('express-fileupload');
// app.use(express.static('public'));
// app.use(fileUpload());
// app.use(express.static('upload'));
const multer  = require('multer')
app.use(express.static('public'));

const con = mysql.createConnection({
  host: "127.0.0.1",
    port:3306,
    database: "Blog",
    user: "root",
    password: "123456"
});

con.connect(function(err) {
  if (err) {
    throw err;
  } 
  console.log("Connected!");
});
app.use(bodyparser.json());
app.use(express.json());
app.use(cors());

app.use(cors({ origin: "*" }));


app.get("/posts", (req: Request, res: Response) => {
  con.query('SELECT * FROM posts ORDER BY id DESC', (err, data)=>{
    if(err) throw err;
    res.send(data);
    // res.send(JSON.parse(JSON.stringify(data)))
  });
});
app.get("/comments", (req: Request, res: Response) => {
  con.query('SELECT * FROM comments', (err, data)=>{
    if(err) throw err;
    res.send(data);
    // res.send(JSON.parse(JSON.stringify(data)))
  });
});


app.get(`/posts/:id`, (req: Request, res: Response) => {
  con.query(`SELECT * FROM posts WHERE id = ${req.params.id}`, (err, data)=>{
    if(err) throw err;
    res.send(data)
  });
});
app.get(`/comments/:id`, (req: Request, res: Response) => {
  con.query(`SELECT * FROM comments WHERE post_id = ${req.params.id}`, (err, data)=>{
    if(err) throw err;
    res.send(data)
    // res.send(req.query);
  });
});


//********************* ADD NEW POST ******************/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.fieldname)
  }
})
const upload = multer({ storage: storage })

app.post('/posts', upload.single("file"), (req: Request, res: Response) =>{
//   // @ts-ignore
// const file = req.file
//   // let filename = req.body.filename

// // @ts-ignore
// //  let  uploadedFile = req.files
// //  let filename = uploadedFile[0].name
// //   let uploadPath = 'public/' + filename ;
  

  const insert = "INSERT INTO posts (`title`,`blogContent`,`image`) VALUES (?) " ;
      const values = [
        req.body.title,
        req.body.blogContent,
        req.body.image
      ];
     con.query(insert, [values], (err,data) => {
        if(err) throw err;
        // res.json(data)
      })
});

// app.post('/posts', (req: Request, res: Response) =>{

//   const insert = "INSERT INTO posts (`title`,`blogContent`,`image`) VALUES (?) " ;
//       const values = [
//         req.body.title,
//         req.body.blogContent,
//         req.body.image
//       ];
//      con.query(insert, [values], (err,data) => {
//         if(err) throw err;
//         // console.log("record inserted");
//         // res.redirect("/posts");
//         res.json(data)
        
//       })
// });

//********************* ADD NEW COMMENT ******************/

app.post('/comments', (req: Request, res: Response) =>{

  const insert = "INSERT INTO comments (`author`,`blogComment`,`post_id`) VALUES (?) " ;
      const values = [
        req.body.author,
        req.body.blogComment,
        req.body.post_id
      ];
     con.query(insert, [values], (err,data) => {
        if(err) throw err;
        res.json(data)
        
      })
});

//********************* EDIT POST ******************/

app.put('/posts/:id', (req: Request, res: Response) =>{
  const postId = req.params.id
  const query = "UPDATE posts SET `title` = ?, `blogContent`= ?, `image`= ? WHERE id = ? " ;
  const values = [
    req.body.title,
    req.body.blogContent,
    req.body.image,
  ]
     con.query(query, [...values, postId], (err,data) => {
        if(err) throw err;
        res.json(data)
        
      })
});

//********************* DELETE POST ******************/

app.delete("/posts/:id", (req: Request, res: Response) => {
  const postId = req.params.id
  const query = "DELETE FROM posts WHERE id = ? "
  con.query(query, [postId], (err,data) => {
    if(err) throw err;
    res.json(data)
  })
})

app.listen(3004, () => {
  console.log("Application started on port 3004!");
});