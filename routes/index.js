// 載入express模組
var express = require("express");
// 使用express.Router類別建構子來建立路由物件
var router = express.Router();

// 取得並列出Server端的ip，需在專案中安裝underscore模組: npm install underscore --save
var serverip = require("underscore")
  .chain(require("os").networkInterfaces())
  .values()
  .flatten()
  .find({ family: "IPv4", internal: false })
  .value().address;
console.log("Server IP=" + serverip);

// 引用request模組，用於呼叫Web API
var request = require("request");

// 引用multer模組，用於接收與儲存前端傳來的檔案
var multer = require("multer");
//設定multer之儲存檔案格式
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/dataShare");
  },
  filename: function (req, file, cb) {
    var str = file.originalname.split(".");

    fileExtension=str.pop()

    i = 0;
    var sourceFileName=""
    while (true) {
      if(i==0){
        sourceFileName = sourceFileName + str[i];
      }else{
        sourceFileName= sourceFileName +"."+ str[i];
      }
      i = i + 1;
      if (i == str.length) {
        sourceFileName = sourceFileName + "." + fileExtension;
        break;
      }
    }

    cb(null, sourceFileName);
  },
});
var upload = multer({ storage: storage });

// 全域變數
var sourceFileName;

var fs = require("fs");
var path = require("path");
var imagePath = path.join(path.resolve(__dirname, ".."), "/public/dataShare/");

function getDirectoryContent(req, res, next) {
  fs.readdir(imagePath, function (err, images) {
    if (err) {
      return next(err);
    }
    res.locals.filenames = images;
    next();
  });
}
//=================== 回傳網頁段落 ========================================//
//========= 根據Client端利用GET送來之不同路由，回傳相對應的網頁 =============//
//=======================================================================//
// 回傳給Client端首頁及該網頁之標題
router.get("/", function (req, res) {
  res.render("index.ejs", { title: "資料暫存", serverip: serverip });
});

router.get("/dataShare", getDirectoryContent, function (req, res) {
  console.log("render page");
  fileList = res.locals.filenames;
  console.log(fileList);

  res.render("dataShare.ejs", {
    title: "dataShare",
    fileList: fileList,
    serverip: serverip,
  });
});

//=======================================================================//
//=======================================================================//
//=======================================================================//

//=================== data share start  ========================================//
//=======================================================================//

router.post("/uploadFile", upload.single("file"), function (req, res) {
  console.log("print finish");

  res.send("finish");
});

router.get("/download/:id", getDirectoryContent, function (req, res) {
  fileList = res.locals.filenames;
  var id = req.params.id;

  console.log(id);

  var filePath = "./public/dataShare/";
  var fileName = fileList[id];

  var downloadFile = filePath + fileName;

  console.log(downloadFile);
  res.download(downloadFile); // Set disposition and send it.
});

router.get("/delete/:id", getDirectoryContent, function (req, res) {
  fileList = res.locals.filenames;
  var id = req.params.id;

  console.log(id);

  var filePath = "./public/dataShare/";
  var fileName = fileList[id];

  var deleteFile = filePath + fileName;

  console.log(deleteFile);
  fs.unlinkSync(deleteFile);
  res.send("server del finish");
});

//=================== data share end ========================================//
//=======================================================================//

//=================== 資料暫存 start  ========================================//
//==========================================================================//
//=======================================================================//
var gradeString = "";
router.post("/save-gradeString", function (req, res) {
  gradeString = req.body.value;
  res.send({ result: gradeString });
});
//show gradeString
router.post("/show-gradeString", function (req, res) {
  res.send({ result: gradeString });
});
//=================== 資料暫存 end ========================================//
//=======================================================================//

module.exports = router;
