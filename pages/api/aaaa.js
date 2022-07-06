async function upload(ctx) {
  let name;
  const file = ctx.request.files.file
  const fileStream = fs.createReadStream(file.path)
  const file_stat = fs.stat(file.path, function (err, stats) {
    if (err) {
      return console.log(err)
    }
    name = '/user/' + `${file.name}`;
    // application/octet-stream
    minioClient.putObject('metadata', name, fileStream, stats.size, { "content-type": `${file.type}` }, function (err, objInfo) {
      if (err) {
        return console.log(err) // err should be null
      }
      console.log("Success", objInfo)
    })
  })
  return {
    url: `${url}` + '/user/' + `${file.name}`
  }
}