import sunflowersImg from "@/assets/artworks/sunflowers.jpg";
import waterLiliesImg from "@/assets/artworks/water-lilies.jpg";
import irisesImg from "@/assets/artworks/irises.jpg";
import orientalPoppiesImg from "@/assets/artworks/oriental-poppies.jpg";
import almondBlossomImg from "@/assets/artworks/almond-blossom.jpg";
import rosesImg from "@/assets/artworks/roses.jpg";
import chrysanthemumsImg from "@/assets/artworks/chrysanthemums.jpg";
import lotusPondImg from "@/assets/artworks/lotus-pond.jpg";

// Source paintings (full original artwork)
import almondBlossomSourceImg from "@/assets/artworks/almond-blossom-source.jpg";

// Sticker cut-outs (transparent PNG)
import almondBlossomStickerImg from "@/assets/artworks/almond-blossom-sticker.png";

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
  "almond-blossom": almondBlossomSourceImg,
};

export const artworkStickerImages: Record<string, string> = {
  "almond-blossom": almondBlossomStickerImg,
};
