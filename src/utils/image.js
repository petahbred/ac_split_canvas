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
      resolve(cutImageUp(image, grid, gutter));
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

  console.log({ cols, rows });

  var imagePieces = [];
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

      console.log(
        { x, y },
        { xPosition, yPosition, cropWidth, cropHeight, gutter }
      );

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
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      const imageData = context.getImageData(0, 0, cropWidth, cropHeight);

      const imageTool = new ImageTools();
      imageTool.quantize(imageData);

      imageTool.title = `${index}`;
      imageTool.creator = 'Me';
      imageTool.town = 'AnimalCrossing';

      imagePieces.push({
        gutter,
        src: canvas.toDataURL(),
        qrImage: QRGenerator(imageTool.draw.toString()),
        data: imageData
      });

      index++;
    }
  }

  // imagePieces now contains data urls of all the pieces of the image

  // load one piece onto the page
  // const frag = document.createDocumentFragment();
  // let container = document.createElement('div');
  // container.style.display = 'flex';
  // for (let i = 0; i < imagePieces.length; i++) {
  //   const index = i + 1;
  //   const data = imagePieces[i];
  //   const img = document.createElement('img');
  //   // img.classList.add('img-fluid');
  //   img.style.flex = '0 1 0';
  //   img.style.marginBottom = `${margin}px`;
  //   img.style.marginRight = `${margin}px`;
  //   img.src = data;

  //   container.appendChild(img);
  //   if (index % cols === 0) {
  //     frag.appendChild(container);
  //     container = document.createElement('div');
  //     container.style.display = 'flex';
  //   }
  // }

  // const imageContainer = document.querySelector('#imageContainer');
  // imageContainer.appendChild(frag);

  return imagePieces;
}
