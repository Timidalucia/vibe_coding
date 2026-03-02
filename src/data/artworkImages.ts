import sunflowersImg from "@/assets/artworks/sunflowers.jpg";
import waterLiliesImg from "@/assets/artworks/water-lilies.jpg";
import irisesImg from "@/assets/artworks/irises.jpg";
import orientalPoppiesImg from "@/assets/artworks/oriental-poppies.jpg";
import almondBlossomImg from "@/assets/artworks/almond-blossom.jpg";
import rosesImg from "@/assets/artworks/roses.jpg";
import chrysanthemumsImg from "@/assets/artworks/chrysanthemums.jpg";
import peoniesImg from "@/assets/artworks/peonies.jpg";
import boncompainAnemonesImg from "@/assets/artworks/boncompain-anemones.jpg";

// Source paintings (full original artwork)
import sunflowersSourceImg from "@/assets/artworks/sunflowers-source.jpg";
import waterLiliesSourceImg from "@/assets/artworks/water-lilies-source.jpg";
import irisesSourceImg from "@/assets/artworks/irises-source.jpg";
import orientalPoppiesSourceImg from "@/assets/artworks/oriental-poppies-source.jpg";
import almondBlossomSourceImg from "@/assets/artworks/almond-blossom-source.jpg";
import rosesSourceImg from "@/assets/artworks/roses-source.jpg";
import chrysanthemumsSourceImg from "@/assets/artworks/chrysanthemums-source.jpg";
import manetPeoniesSourceImg from "@/assets/artworks/manet-peonies-source.jpg";
import renoirAnemonesSourceImg from "@/assets/artworks/renoir-anemones-source.jpg";

// New source paintings
import oleandersSourceImg from "@/assets/artworks/oleanders-source.jpg";
import dahliaSourceImg from "@/assets/artworks/dahlia-source.jpg";
import carnationSourceImg from "@/assets/artworks/carnation-source.jpg";
import wisteriaSourceImg from "@/assets/artworks/wisteria-source.jpg";
import lilacSourceImg from "@/assets/artworks/lilac-source.jpg";
import magnoliaSourceImg from "@/assets/artworks/magnolia-source.jpg";
import violetsSourceImg from "@/assets/artworks/violets-source.jpg";
import tulipSourceImg from "@/assets/artworks/tulip-source.jpg";
import daisySourceImg from "@/assets/artworks/daisy-source.jpg";
import redonFlowersSourceImg from "@/assets/artworks/redon-flowers-source.jpg";
import ruyschFlowersSourceImg from "@/assets/artworks/ruysch-flowers-source.jpg";
import bosschaertTulipSourceImg from "@/assets/artworks/bosschaert-tulip-source.jpg";
import carnationLilyRoseSourceImg from "@/assets/artworks/carnation-lily-rose-source.jpg";

// Pre-made transparent cutouts
import rosesCutoutImg from "@/assets/artworks/roses-cutout.png";
import sunflowerCutoutImg from "@/assets/artworks/sunflower-cutout.png";

// Sticker cut-outs
import sunflowersStickerImg from "@/assets/artworks/sunflowers-sticker.png";
import waterLiliesStickerImg from "@/assets/artworks/water-lilies-sticker.png";
import irisesStickerImg from "@/assets/artworks/irises-sticker.png";
import orientalPoppiesStickerImg from "@/assets/artworks/oriental-poppies-sticker.png";
import almondBlossomStickerImg from "@/assets/artworks/almond-blossom-sticker.png";
import rosesStickerImg from "@/assets/artworks/roses-sticker.png";
import chrysanthemumsStickerImg from "@/assets/artworks/chrysanthemums-sticker.png";

export const artworkImages: Record<string, string> = {
  sunflower: sunflowersImg,
  "water-lily": waterLiliesImg,
  iris: irisesImg,
  "red-poppy": orientalPoppiesImg,
  "almond-blossom": almondBlossomImg,
  rose: rosesImg,
  chrysanthemum: chrysanthemumsImg,
  peony: peoniesImg,
  anemone: boncompainAnemonesImg,
};

export const artworkSourceImages: Record<string, string> = {
  sunflower: sunflowersSourceImg,
  "water-lily": waterLiliesSourceImg,
  iris: irisesSourceImg,
  "red-poppy": orientalPoppiesSourceImg,
  "almond-blossom": almondBlossomSourceImg,
  rose: rosesSourceImg,
  chrysanthemum: chrysanthemumsSourceImg,
  peony: manetPeoniesSourceImg,
  anemone: renoirAnemonesSourceImg,
  // New entries
  oleander: oleandersSourceImg,
  dahlia: dahliaSourceImg,
  carnation: carnationSourceImg,
  wisteria: wisteriaSourceImg,
  lilac: lilacSourceImg,
  magnolia: magnoliaSourceImg,
  violet: violetsSourceImg,
  tulip: tulipSourceImg,
  daisy: daisySourceImg,
  "redon-bouquet": redonFlowersSourceImg,
  "ruysch-bouquet": ruyschFlowersSourceImg,
  "bosschaert-tulip": bosschaertTulipSourceImg,
  "carnation-lily-rose": carnationLilyRoseSourceImg,
};

export const artworkStickerImages: Record<string, string> = {
  sunflower: sunflowersStickerImg,
  "water-lily": waterLiliesStickerImg,
  iris: irisesStickerImg,
  "red-poppy": orientalPoppiesStickerImg,
  "almond-blossom": almondBlossomStickerImg,
  rose: rosesStickerImg,
  chrysanthemum: chrysanthemumsStickerImg,
};

/** Pre-made transparent cutouts */
export const artworkCutoutImages: Record<string, string> = {
  rose: rosesCutoutImg,
  sunflower: sunflowerCutoutImg,
};
