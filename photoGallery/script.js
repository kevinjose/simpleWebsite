let imageData = [];

let currentIndex = 0;
const mainPhoto = document.getElementById("main-photo");
const captionTitle = document.getElementById("caption-title");
const captionDesc = document.getElementById("caption-desc");
const previews = document.getElementById("previews");

async function loadCaptions() {
  const response = await fetch("captions.md");
  const md = await response.text();

  const blocks = md.split('## ').filter(Boolean);
  imageData = blocks.map(block => {
    const [filenameLine, ...lines] = block.split('\n').map(line => line.trim());
    const filename = filenameLine.trim();
    const titleMatch = lines[0]?.match(/\*\*(.*?)\*\*/);
    const descMatch = lines[1]?.match(/\*(.*?)\*/);

    return {
      src: 'images/' + filename,
      title: titleMatch ? titleMatch[1] : '',
      desc: descMatch ? descMatch[1] : ''
    };
  });

  currentIndex = Math.floor(Math.random() * imageData.length);
  showImage(currentIndex);
  renderPreviews();
}

function showImage(index) {
  const img = imageData[index];
  mainPhoto.src = img.src;
  captionTitle.textContent = img.title;
  captionDesc.textContent = img.desc;
}

function nextImage() {
  currentIndex = (currentIndex + 1) % imageData.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
  showImage(currentIndex);
}

function randomImage() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * imageData.length);
  } while (newIndex === currentIndex);
  currentIndex = newIndex;
  showImage(currentIndex);
}

function renderPreviews() {
  previews.innerHTML = '';
  imageData.forEach((img, i) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.className = "preview-img";
    thumb.onclick = () => {
      currentIndex = i;
      showImage(currentIndex);
    };
    previews.appendChild(thumb);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

loadCaptions();
