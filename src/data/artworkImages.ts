import sunflowersImg from "@/assets/artworks/sunflowers.jpg";
import waterLiliesImg from "@/assets/artworks/water-lilies.jpg";
import irisesImg from "@/assets/artworks/irises.jpg";
import orientalPoppiesImg from "@/assets/artworks/oriental-poppies.jpg";
import almondBlossomImg from "@/assets/artworks/almond-blossom.jpg";
import rosesImg from "@/assets/artworks/roses.jpg";
import chrysanthemumsImg from "@/assets/artworks/chrysanthemums.jpg";
import lotusPondImg from "@/assets/artworks/lotus-pond.jpg";

// Source paintings (full original artwork for hover reveal)
import sunflowersSourceImg from "@/assets/artworks/sunflowers-source.jpg";
import waterLiliesSourceImg from "@/assets/artworks/water-lilies-source.jpg";
import irisesSourceImg from "@/assets/artworks/irises-source.jpg";
import orientalPoppiesSourceImg from "@/assets/artworks/oriental-poppies-source.jpg";
import almondBlossomSourceImg from "@/assets/artworks/almond-blossom-source.jpg";
import rosesSourceImg from "@/assets/artworks/roses-source.jpg";

// Sticker cut-outs (transparent PNG)
import sunflowersStickerImg from "@/assets/artworks/sunflowers-sticker.png";
import waterLiliesStickerImg from "@/assets/artworks/water-lilies-sticker.png";
import irisesStickerImg from "@/assets/artworks/irises-sticker.png";
import orientalPoppiesStickerImg from "@/assets/artworks/oriental-poppies-sticker.png";
import almondBlossomStickerImg from "@/assets/artworks/almond-blossom-sticker.png";
import rosesStickerImg from "@/assets/artworks/roses-sticker.png";
import chrysanthemumsStickerImg from "@/assets/artworks/chrysanthemums-sticker.png";
import lotusStickerImg from "@/assets/artworks/lotus-sticker.png";

export const artworkImages: Record<string, string> = {
  sunflower: sunflowersImg,
  "water-lily": waterLiliesImg,
  iris: irisesImg,
  "red-poppy": orientalPoppiesImg,
  "almond-blossom": almondBlossomImg,
  rose: rosesImg,
  chrysanthemum: chrysanthemumsImg,
  lotus: lotusPondImg,
};

export const artworkSourceImages: Record<string, string> = {
  sunflower: sunflowersSourceImg,
  "water-lily": waterLiliesSourceImg,
  iris: irisesSourceImg,
  "red-poppy": orientalPoppiesSourceImg,
  "almond-blossom": almondBlossomSourceImg,
  rose: rosesSourceImg,
  chrysanthemum: chrysanthemumsImg, // using artwork as source
  lotus: lotusPondImg, // using artwork as source
};

export const artworkStickerImages: Record<string, string> = {
  sunflower: sunflowersStickerImg,
  "water-lily": waterLiliesStickerImg,
  iris: irisesStickerImg,
  "red-poppy": orientalPoppiesStickerImg,
  "almond-blossom": almondBlossomStickerImg,
  rose: rosesStickerImg,
  chrysanthemum: chrysanthemumsStickerImg,
  lotus: lotusStickerImg,
};
