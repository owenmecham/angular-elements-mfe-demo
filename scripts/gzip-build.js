const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const distFolder = process.argv[2] || 'dist';

const extensionsToCompress = ['.html', '.js', '.css'];

let globalFilesCount = 0;
let successGlobalFilesCount = 0;
const resolvedDistFolder = path.resolve(__dirname, '../', distFolder);

compressFolderRecursively(resolvedDistFolder);

function compressFolderRecursively(outputDir) {
  const fileList = fs.readdirSync(outputDir);

  fileList.forEach((file) => {
    const fullFilePath = path.resolve(outputDir, file);

    if (isCompressibleFile(fullFilePath)) {
      globalFilesCount += 1;
      compressFile(file, outputDir);
    } else if (isDirectory(fullFilePath)) {
      compressFolderRecursively(fullFilePath);
    }
  });
}

function isCompressibleFile(fullFilePath) {
  return fs.lstatSync(fullFilePath).isFile() && extensionsToCompress.includes(path.extname(fullFilePath));
}

function isDirectory(fullFilePath) {
  return fs.lstatSync(fullFilePath).isDirectory();
}

function compressFile(filename, outputDir) {
  const compress = zlib.createGzip({ level: 9 });
  const input = fs.createReadStream(path.join(outputDir, filename));
  const output = fs.createWriteStream(path.join(outputDir, filename) + '.gz');

  input.pipe(compress).pipe(output);

  output.on('finish', () => renameFile(filename, outputDir));
  output.on('error', (error) => console.error(error));
}

function renameFile(filename, outputDir) {
  fs.rename(
    path.join(outputDir, filename + '.gz'),
    path.join(outputDir, path.basename(filename, '.gz')),
    (err) => {
      if (err) {
        console.error('ERROR: ' + err);
      } else {
        compressFileComplete(filename);
      }
    },
  );
}

function compressFileComplete(filename) {
  successGlobalFilesCount += 1;
  console.log(`File ${filename} has been compressed.`);

  if (globalFilesCount === successGlobalFilesCount) {
    console.log(`${globalFilesCount} files have been compiled.`);
  }
}
