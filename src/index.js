import fetchImgUser from './js/fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchQueryInput = document.querySelector('[name="searchQuery"]');
const sabmitBtn = document.querySelector('[type="submit"]');
const gallary = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {});
const runTopBtn = document.querySelector('.array-top');

runTopBtn.addEventListener('click', () => {
  window.scrollTo(0, 0);
});

let searchQueryCurrent = '';
let page = 1;
let arrayLength = 0;

sabmitBtn.addEventListener('click', e => {
  e.preventDefault();

  clearGallary();

  loadMoreBtn.classList.add('is-hidden');
  runTopBtn.classList.add('is-hidden');

  fetchImgUser(searchQueryInput.value, page).then(response => {
    searchQueryCurrent = searchQueryInput.value;
    arrayLength += response.hits.length;

    creatingPhotoMarkup(response);
    lightbox.refresh();

    if (response.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    loadMoreBtn.classList.remove('is-hidden');
    runTopBtn.classList.remove('is-hidden');

    console.log(response);
  });
});

loadMoreBtn.addEventListener('click', () => {
  onLoadMore();
});

function creatingPhotoMarkup(images) {
  const foto = images.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" title="${tags}"loading="lazy" width="100%" height="70%"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>
`;
      }
    )
    .join('');

  gallary.insertAdjacentHTML('beforeend', foto);
}

function onLoadMore() {
  page += 1;

  fetchImgUser(searchQueryCurrent, page).then(response => {
    arrayLength += response.hits.length;

    if (arrayLength >= response.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.add('is-hidden');
    }

    creatingPhotoMarkup(response);
    lightbox.refresh();
  });
}

function clearGallary() {
  gallary.innerHTML = '';

  page = 1;
}
