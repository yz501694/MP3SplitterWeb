function callback(file){
  console.log("here");
  console.log(file.files);
  console.log(file);
}
    
    
    function uploadClicked() {
      let file= document.getElementsByName("fileInput")[0].files[0];
      console.log(file);
      computeMD5(file, tryHashUpload)
    };
    function tryHashUploadCallback(response){
      if(response.data["state"]==="failed"){
        console.log("hash upload failed");
        fileUpload(document.getElementById("Doc").files[0]);
      }else if(response.data["state"]==="succeeded"){
        console.log("hash upload succeeded. TaskID: "+response.data["id"]);
      }
      console.log(response)
    };
    function tryHashUpload(hash) {
      axios.request({
            method: "get",
            url: "/Splitter_war_exploded/HashUploadServlet",
            params: {
              userToken: 1,
              begin:0,
              end:10000,
              hash:String(hash)
            }
          }
      ).then(tryHashUploadCallback)
    };
    function fileUpload(file) {
      let params = new FormData()
      params.append('userToken', userToken)
      params.append("begin", "0")
      params.append("end", "1000")
      params.append('mp3', file)
      axios({
            method: 'post',
            url: '/Splitter_war_exploded/FileUploadServlet',
            data: params,
            headers: {'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()},
            onUploadProgress: function (p) {
              let complete = (p.loaded / p.total * 100 | 0) + '%'
              console.log('上传' + complete)
            }
          }
      ).then(function (response) {
        if(response.data["state"]==="failed"){
          console.log("file upload failed");
        }else if(response.data["state"]==="succeeded"){
          console.log("file upload succeeded. TaskID: "+response.data["id"]);
        }
      }).catch(function (error) {
        console.log(error)
      })
    };
    function computeMD5(f,callback) {
      var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          file = f,
          chunkSize = 2097152,                             // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();
      fileReader.onload = function (e) {
        console.log('read chunk nr', currentChunk + 1, 'of', chunks);
        spark.append(e.target.result);                   // Append array buffer
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          console.log('finished loading');
          let hash=spark.end();
          console.info('computed hash', hash);  // Compute hash
          callback(hash);
        }
      };
      fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
      };
      function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
  }