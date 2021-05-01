const SUBSTRING_BLACKLIST = [
  "#short",
  "cm",
  "premiere",
  "pv",
  "teaser",
  "trailer",
];
const DEBOUNCE_DELAY = 2000;

function hasOneThumbnail(video) {
  return video.getElementsByTagName("ytd-thumbnail").length === 1;
}

function getVideos() {
  const videos = [
    ...document.querySelectorAll("div[id=dismissible]:not(.already-seen)"),
  ];

  return videos.filter(hasOneThumbnail);
}

const substringBlacklistRegExp = RegExp(SUBSTRING_BLACKLIST.join("|"), "i");
function hasBlacklistedSubstring(video) {
  return substringBlacklistRegExp.test(video.innerText);
}

function hasProgressBar(video) {
  return Boolean(
    video.getElementsByTagName("ytd-thumbnail-overlay-resume-playback-renderer")
      .length
  );
}

function markAsAlreadySeen(video) {
  video.classList.add("already-seen");
}

function getThumbnail(video) {
  return video.getElementsByTagName("img")[0];
}

function applyDarken() {
  const videos = getVideos();
  if (videos.length === 0) {
    return;
  }

  console.log(`Loaded ${videos.length} video(s)`);

  const filteredVideos = videos.filter(
    (video) => hasBlacklistedSubstring(video) || hasProgressBar(video)
  );

  console.log(
    `Found ${filteredVideos.length} video(s) to darken`,
    filteredVideos.map((video) => ({ title: video.innerText, video }))
  );

  videos.forEach(markAsAlreadySeen);

  filteredVideos
    .map(getThumbnail)
    .forEach((thumbnail) => thumbnail.classList.add("darken"));
}

let timeout = null;
function debouncer() {
  clearTimeout(timeout);
  timeout = setTimeout(applyDarken, DEBOUNCE_DELAY);
}

const targetNode = document.body;
const config = { childList: true, subtree: true };
const observer = new MutationObserver(debouncer);
observer.observe(targetNode, config);