import sunflowersImg from "@/assets/artworks/sunflowers.jpg";
import waterLiliesImg from "@/assets/artworks/water-lilies.jpg";
import irisesImg from "@/assets/artworks/irises.jpg";
import orientalPoppiesImg from "@/assets/artworks/oriental-poppies.jpg";
import almondBlossomImg from "@/assets/artworks/almond-blossom.jpg";
import rosesImg from "@/assets/artworks/roses.jpg";
import vangoghOleandersImg from "@/assets/artworks/vangogh-oleanders.jpg";
import peoniesImg from "@/assets/artworks/peonies.jpg";
import boncompainAnemonesImg from "@/assets/artworks/boncompain-anemones.jpg";
import boncompainLilasImg from "@/assets/artworks/boncompain-lilas.jpg";
import boncompainTulipesImg from "@/assets/artworks/boncompain-tulipes.jpg";
import boncompainBouquetChampsImg from "@/assets/artworks/boncompain-bouquet-champs.jpg";
import boncompainBouquetJauneImg from "@/assets/artworks/boncompain-bouquet-jaune.jpg";
import vangoghDaisiesImg from "@/assets/artworks/vangogh-daisies.jpg";
import vangoghCarnationsImg from "@/assets/artworks/vangogh-carnations.jpg";

// Source paintings (full original artwork for hover reveal)
import sunflowersSourceImg from "@/assets/artworks/sunflowers-source.jpg";
import waterLiliesSourceImg from "@/assets/artworks/water-lilies-source.jpg";
import irisesSourceImg from "@/assets/artworks/irises-source.jpg";
import orientalPoppiesSourceImg from "@/assets/artworks/oriental-poppies-source.jpg";
import almondBlossomSourceImg from "@/assets/artworks/almond-blossom-source.jpg";
import rosesSourceImg from "@/assets/artworks/roses-source.jpg";
import vangoghOleandersSourceImg from "@/assets/artworks/vangogh-oleanders-source.jpg";
import peoniesSourceImg from "@/assets/artworks/peonies-source.jpg";
import boncompainAnemonesSourceImg from "@/assets/artworks/boncompain-anemones-source.jpg";

// Pre-made transparent cutouts (AI-isolated from source paintings)
import rosesCutoutImg from "@/assets/artworks/roses-cutout.png";
import sunflowerCutoutImg from "@/assets/artworks/sunflower-cutout.png";

// Sticker cut-outs (on paper texture)
import sunflowersStickerImg from "@/assets/artworks/sunflowers-sticker.png";
import waterLiliesStickerImg from "@/assets/artworks/water-lilies-sticker.png";
import irisesStickerImg from "@/assets/artworks/irises-sticker.png";
import orientalPoppiesStickerImg from "@/assets/artworks/oriental-poppies-sticker.png";
import almondBlossomStickerImg from "@/assets/artworks/almond-blossom-sticker.png";
import rosesStickerImg from "@/assets/artworks/roses-sticker.png";
import vangoghOleandersStickerImg from "@/assets/artworks/vangogh-oleanders-sticker.png";
import peoniesStickerImg from "@/assets/artworks/peonies-sticker.png";
import boncompainAnemonesStickerImg from "@/assets/artworks/boncompain-anemones-sticker.png";
import boncompainLilasStickerImg from "@/assets/artworks/boncompain-lilas-sticker.png";
import boncompainTulipesStickerImg from "@/assets/artworks/boncompain-tulipes-sticker.png";
import boncompainBouquetChampsStickerImg from "@/assets/artworks/boncompain-bouquet-champs-sticker.png";
import boncompainBouquetJauneStickerImg from "@/assets/artworks/boncompain-bouquet-jaune-sticker.png";
import vangoghDaisiesStickerImg from "@/assets/artworks/vangogh-daisies-sticker.png";
import vangoghCarnationsStickerImg from "@/assets/artworks/vangogh-carnations-sticker.png";

export const artworkImages: Record<string, string> = {
  sunflower: sunflowersImg,
  "water-lily": waterLiliesImg,
  iris: irisesImg,
  "red-poppy": orientalPoppiesImg,
  "almond-blossom": almondBlossomImg,
  rose: rosesImg,
  oleander: vangoghOleandersImg,
  peony: peoniesImg,
  anemone: boncompainAnemonesImg,
  lilac: boncompainLilasImg,
  tulip: boncompainTulipesImg,
  wildflower: boncompainBouquetChampsImg,
  "golden-bouquet": boncompainBouquetJauneImg,
  daisy: vangoghDaisiesImg,
  carnation: vangoghCarnationsImg,
};

export const artworkSourceImages: Record<string, string> = {
  sunflower: sunflowersSourceImg,
  "water-lily": waterLiliesSourceImg,
  iris: irisesSourceImg,
  "red-poppy": orientalPoppiesSourceImg,
  "almond-blossom": almondBlossomSourceImg,
  rose: rosesSourceImg,
  oleander: vangoghOleandersSourceImg,
  peony: peoniesSourceImg,
  anemone: boncompainAnemonesSourceImg,
  lilac: boncompainLilasImg,
  tulip: boncompainTulipesImg,
  wildflower: boncompainBouquetChampsImg,
  "golden-bouquet": boncompainBouquetJauneImg,
  daisy: vangoghDaisiesImg,
  carnation: vangoghCarnationsImg,
};

export const artworkStickerImages: Record<string, string> = {
  sunflower: sunflowersStickerImg,
  "water-lily": waterLiliesStickerImg,
  iris: irisesStickerImg,
  "red-poppy": orientalPoppiesStickerImg,
  "almond-blossom": almondBlossomStickerImg,
  rose: rosesStickerImg,
  oleander: vangoghOleandersStickerImg,
  peony: peoniesStickerImg,
  anemone: boncompainAnemonesStickerImg,
  lilac: boncompainLilasStickerImg,
  tulip: boncompainTulipesStickerImg,
  wildflower: boncompainBouquetChampsStickerImg,
  "golden-bouquet": boncompainBouquetJauneStickerImg,
  daisy: vangoghDaisiesStickerImg,
  carnation: vangoghCarnationsStickerImg,
};

/** Pre-made transparent cutouts — used instead of runtime segmentation when available */
export const artworkCutoutImages: Record<string, string> = {
  rose: rosesCutoutImg,
  sunflower: sunflowerCutoutImg,
};
