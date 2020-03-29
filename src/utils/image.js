export function splitImage(src, grid, gutter, callback) {
  if (!src) {
    throw new Error('No src for the image was defined.');
  }

  var image = new Image();
  image.onload = () => {
    callback(cutImageUp(image, grid, gutter));
  };
  image.setAttribute('crossOrigin', 'anonymous');
  image.src = src;
}

export function cutImageUp(image, grid = 2, gutter = 15, margin = gutter) {
  const halfGutter = gutter / 2;
  const size = Math.min(image.width, image.height) / grid;

  const cols = Math.floor(image.width / size);
  const rows = Math.floor(image.height / size);

  console.log({ cols, rows });

  var imagePieces = [];
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
      imagePieces.push(canvas.toDataURL());
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

const logger = console;

export function quantize(imgdata) {
  let pixelCount = this.draw.pixelCount * 4;
  let pixels = [];
  for (let i = 0; i < pixelCount; i += 4) {
    if (imgdata.data[i + 3] < this.convert_trans) {
      continue;
    }
    pixels.push({
      r: imgdata.data[i],
      g: imgdata.data[i + 1],
      b: imgdata.data[i + 2]
    });
  }
  const medianCut = pixels => {
    let l = Math.floor(pixels.length / 2);
    let r_min = null;
    let r_max = null;
    let g_min = null;
    let g_max = null;
    let b_min = null;
    let b_max = null;
    for (let i in pixels) {
      if (pixels[i].r < r_min || r_min === null) {
        r_min = pixels[i].r;
      }
      if (pixels[i].r > r_max || r_max === null) {
        r_max = pixels[i].r;
      }
      if (pixels[i].g < g_min || g_min === null) {
        g_min = pixels[i].g;
      }
      if (pixels[i].g > g_max || g_max === null) {
        g_max = pixels[i].g;
      }
      if (pixels[i].b < b_min || b_min === null) {
        b_min = pixels[i].b;
      }
      if (pixels[i].b > b_max || b_max === null) {
        b_max = pixels[i].b;
      }
    }
    let r_dist = r_max - r_min;
    let g_dist = g_max - g_min;
    let b_dist = b_max - b_min;
    if (r_dist >= g_dist && r_dist >= b_dist) {
      //Sort on red
      pixels.sort((a, b) => a.r - b.r);
    } else if (g_dist >= r_dist && g_dist >= b_dist) {
      //Sort on green
      pixels.sort((a, b) => a.g - b.g);
    } else {
      //Sort on blue
      pixels.sort((a, b) => a.b - b.b);
    }
    return [pixels.slice(0, l), pixels.slice(l)];
  };
  const medianMultiCut = buckets => {
    let res = [];
    for (let i in buckets) {
      const newBuck = medianCut(buckets[i]);
      if (newBuck[0].length) {
        res.push(newBuck[0]);
      }
      if (newBuck[1].length) {
        res.push(newBuck[1]);
      }
    }
    return res;
  };
  let buckets = medianCut(pixels); //creates 2 buckets
  buckets = medianMultiCut(buckets); //splits into 4
  buckets = medianMultiCut(buckets); //splits into 8
  buckets = medianMultiCut(buckets); //splits into 16

  //Now we have 16 buckets.
  let colors = [];
  let uniqCol = new Set();

  //Pushes average color of given bucket onto colors.
  const pushAvg = b => {
    let r_avg = 0;
    let g_avg = 0;
    let b_avg = 0;
    for (let i in b) {
      r_avg += b[i].r;
      g_avg += b[i].g;
      b_avg += b[i].b;
    }
    let rgb = [
      Math.round(r_avg / b.length),
      Math.round(g_avg / b.length),
      Math.round(b_avg / b.length)
    ];
    let idx = this.draw.findRGB(rgb);
    if (!uniqCol.has(idx)) {
      colors.push(idx);
      uniqCol.add(idx);
    }
  };

  //Average the insides for colors.
  for (let i in buckets) {
    pushAvg(buckets[i]);
  }
  logger.info('Unique colors: ' + uniqCol.size);

  if (uniqCol.size < 15) {
    //We could add more colors. Quantize some more and cross fingers!
    buckets = medianMultiCut(buckets); //splits into 32
    for (let i in buckets) {
      pushAvg(buckets[i]);
    }
    logger.info('Unique colors after further quantize: ' + uniqCol.size);
    if (uniqCol.size < 15) {
      buckets = medianMultiCut(buckets); //splits into 64
      for (let i in buckets) {
        pushAvg(buckets[i]);
      }
      logger.info('Unique colors after further quantize: ' + uniqCol.size);
      if (uniqCol.size < 15) {
        buckets = medianMultiCut(buckets); //splits into 128
        for (let i in buckets) {
          pushAvg(buckets[i]);
        }
        logger.info('Unique colors after further quantize: ' + uniqCol.size);
      }
    }
  } else if (uniqCol.size > 15) {
    //We have 16 colors (one for each bucket)
    //Find the closest two colors and merge them
    let minDist = 255 * 255 * 3;
    let bucketA = null;
    let bucketB = null;
    for (let i in colors) {
      for (let j in colors) {
        if (i >= j) {
          continue;
        }
        let rD = colors[i][0] - colors[j][0];
        let gD = colors[i][1] - colors[j][1];
        let bD = colors[i][2] - colors[j][2];
        let match = rD * rD + gD * gD + bD * bD;
        if (match < minDist) {
          minDist = match;
          bucketA = i;
          bucketB = j;
        }
      }
    }
    //Merge bucket A and B into C
    let bucketC = buckets[bucketA].concat(buckets[bucketB]);
    colors.splice(bucketB); //Must remove B first, since B is guaranteed to be the latter entry
    colors.splice(bucketA); //Now we can remove A too, since it was before B and thus couldn't have shifted
    pushAvg(bucketC);
    uniqCol = new Set(colors);
    logger.info('Unique colors after merge of closest two: ' + uniqCol.size);
  }

  //Set palette to chosen colors
  let cNum = 0;
  for (let c of uniqCol) {
    if (cNum > 14) {
      break;
    }
    logger.info('Setting color ' + cNum + ' to ' + c);
    this.draw.setPalette(cNum, c);
    cNum++;
  }

  //Set each pixel to the nearest color from the palette
  for (let i = 0; i < pixelCount; i += 4) {
    let x = (i >> 2) % this.draw.width;
    let y = Math.floor((i >> 2) / this.draw.width);
    if (imgdata.data[i + 3] < this.convert_trans) {
      this.draw.setPixel(x, y, 15);
    } else {
      this.draw.setPixel(x, y, [
        imgdata.data[i],
        imgdata.data[i + 1],
        imgdata.data[i + 2]
      ]);
    }
  }
  this.draw.onLoad();
}
