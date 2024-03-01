import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputElem = document.querySelector('[name="searchQuery"]');
const galleryElem = document.querySelector('.gallery');
const searchBtn = document.querySelector('button[type="submit"]');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
const params = new URLSearchParams({
  per_page: 110,
  page: page,
});
const perPage = params.get('per_page');

//function showElem(elem, total) {
//if (total > 0) {
//  elem.style.display = 'block';
//}
//}
function hideElem(elem) {
  elem.style.display = 'none';
}
hideElem(loadMoreBtn);

async function getImage() {
  const userValue = inputElem.value;

  try {
    const response = await axios(
      `https://pixabay.com/api/?key=42371988-071288b1dfde1a3b3e48d8595&${params}&q=${userValue}&image_type=photo&orientation=horizontal&safesearch=true`
    );

    const {
      data: { hits, totalHits },
    } = response;

    handleResults(hits);

    if (totalHits && totalHits < page * perPage) {
      //   hideElem(loadMoreBtn);
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    //else {
    // showElem(loadMoreBtn, totalHits);
    // }
  } catch (error) {
    console.log(error);
  }
}
searchBtn.addEventListener('click', event => {
  event.preventDefault();
  getImage();
});

//loadMoreBtn.addEventListener('click', async () => {
//  try {
//    page += 1;
//    params.set('page', page);
//    await getImage();
//} catch (error) {
//    console.log(err);
//}
//});

inputElem.addEventListener('change', () => {
  galleryElem.innerHTML = '';
  page = 1;
});

function handleResults(hits) {
  hits.length > 0
    ? createElem(hits)
    : Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
}

function createElem(hits) {
  const markup = hits
    .map(hit => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hit;
      return `<div class="photo-card"><a class="photo-link" href=${largeImageURL} rel="gallery">
           <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
     <p class="info-item">
      <b>Likes:</b> ${likes}
     </p>
     <p class="info-item">
      <b>Views:</b> ${views}
     </p>
     <p class="info-item">
      <b>Comments:</b> ${comments}
     </p>
     <p class="info-item">
      <b>Downloads:</b> ${downloads}
     </p>
     </div>
     </div>`;
    })
    .join('');

  galleryElem.innerHTML += markup;
  lightbox = new SimpleLightbox('.gallery .photo-link');
}
window.addEventListener('scroll', async () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    try {
      page += 1;
      params.set('page', page);

      await getImage();
    } catch (error) {
      console.log(err);
    }
  }
});
