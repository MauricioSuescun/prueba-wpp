let ads = [];

export function getAds() {
  return ads;
}

export function addAd(ad) {
  ads.push(ad);
}

export function getRandomAd() {
  return ads[Math.floor(Math.random() * ads.length)];
}
