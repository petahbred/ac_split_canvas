import ImageTools from './ImageTools';
import QRGenerator from './ACNLQRGenerator';

/**
 *
 * @description Splits the image into equal squares fitting the squares on the shorter
 * side.
 *
 * @export
 * @param {string} src
 * @param {number} grid
 * @param {number} gutter
 * @param {Function} callback
 */
export function splitImage(src, grid, gutter) {
  if (!src) {
    throw new Error('No src for the image was defined.');
  }

  return new Promise((resolve, reject) => {
    var image = new Image();
    image.onload = () => {
      resolve(Promise.all(cutImageUp(image, grid, gutter)));
    };
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = src;
  });
}

export function cutImageUp(image, grid = 2, gutter = 15, margin = gutter) {
  const halfGutter = gutter / 2;
  const size = Math.min(image.width, image.height) / grid;

  const cols = Math.floor(image.width / size);
  const rows = Math.floor(image.height / size);

  console.log({ width: image.width, height: image.height, cols, rows, size });

  const promises = [];
  let index = 1;
  for (var y = 0; y < rows; ++y) {
    for (var x = 0; x < cols; ++x) {
      var canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      var context = canvas.getContext('2d');
      // TODO: add gutter calculation here.

      let xPosition = x * size;
      let cropWidth = size - halfGutter;

      let yPosition = y * size;

      if (x > 0) {
        xPosition += halfGutter;

        if (x < grid - 1) {
          cropWidth = size - gutter;
        }
      }

      if (y > 0) {
        yPosition += halfGutter;
      }

      const cropHeight = cropWidth;

      // console.log(
      //   { x, y },
      //   { xPosition, yPosition, cropWidth, cropHeight, gutter }
      // );

      context.drawImage(
        image,
        xPosition, // move x position
        yPosition, // move y position
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      /**
       * Prepare image for quantize.
       */
      const imageData = getImageData(canvas);

      const imageTool = new ImageTools();
      imageTool.quantize(imageData);

      imageTool.title = `${index}`;
      imageTool.creator = 'Me';
      imageTool.town = 'AnimalCrossing';

      const src = canvas.toDataURL();
      const data = imageTool.draw.toString();

      promises.push(
        new Promise(async resolve => {
          try {
            const qrImage = await QRGenerator(data);
            resolve({
              gutter,
              src,
              data,
              qrImage
            });
          } catch (error) {
            console.error(error);
          }
        })
      );

      index++;
    }
  }
  console.log({ promises });
  return promises;
}

export function getImageData(canvas) {
  const preview = document.createElement('canvas');
  const context = preview.getContext('2d');
  context.imageSmoothingEnabled = true;
  context.drawImage(canvas, 0, 0, 32, 32);
  return context.getImageData(0, 0, 32, 32);
}
