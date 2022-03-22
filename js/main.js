import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import postApi from './api/postApi';
import { getUlPagination, setTextContent, truncateText } from './utils';

dayjs.extend(relativeTime);

function createPostElement(post) {
    if (!post) return;
    const postTemplate = document.getElementById('postTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 300));
    setTextContent(liElement, '[data-id="author"]', post.author);
    setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updateAt).fromNow()}`);

    // const titleElement = liElement.querySelector('[data-id="title"]');
    // if (titleElement) titleElement.textContent = post.title;

    // const descriptionElement = liElement.querySelector('[data-id="description"]');
    // if (descriptionElement) descriptionElement.textContent = post.description;

    // const authorElement = liElement.querySelector('[data-id="author"]');
    // if (authorElement) authorElement.textContent = post.author;

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) thumbnailElement.src = post.imageUrl;

    return liElement;
}

function renderPostList(postList) {
    if (!Array.isArray(postList) || postList.length === 0) return;

    const ulElement = document.getElementById('postList');
    if (!ulElement) return;

    ulElement.textContent = '';

    postList.forEach((post, idx) => {
        const liElement = createPostElement(post);
        ulElement.appendChild(liElement);
    });
}

function renderPagination(pagination) {
    const ulPagination = getUlPagination();
    if (!pagination || !ulPagination) return;

    const { _page, _limit, _totalRows } = pagination;
    const totalPages = Math.ceil(_totalRows / _limit);

    ulPagination.dataset.page = _page;
    ulPagination.dataset.totalPages = totalPages;

    if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled');
    else ulPagination.firstElementChild.classList.remove('disabled');

    if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled');
    else ulPagination.lastElementChild.classList.remove('disabled');
}

async function handleFilterChange(filterName, filterValue) {
    try {
        const url = new URL(window.location);
        url.searchParams.set(filterName, filterValue);
        history.pushState({}, '', url);
        const { data, pagination } = await postApi.getAll(url.searchParams);
        renderPostList(data);
        renderPagination(pagination);
    } catch (error) {
        console.log('failed call post list', error);
    }
}

function handlePrevClick(e) {
    e.preventDefault();
    console.log('Prev');

    const ulPagination = getUlPagination();
    if (!ulPagination) return;

    const page = Number.parseInt(ulPagination.dataset.page);
    if (page <= 1) return;
    handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
    e.preventDefault();
    console.log('Next');

    const ulPagination = getUlPagination();
    if (!ulPagination) return;

    const page = Number.parseInt(ulPagination.dataset.page);
    const totalPages = ulPagination.dataset.totalPages;
    if (page >= totalPages) return;
    handleFilterChange('_page', page + 1);
}

function initPagination() {
    const ulPagination = getUlPagination();
    if (!ulPagination) return;

    const prevLink = ulPagination.firstElementChild.firstElementChild;
    if (prevLink) prevLink.addEventListener('click', handlePrevClick);

    const nextLink = ulPagination.lastElementChild.lastElementChild;
    if (nextLink) nextLink.addEventListener('click', handleNextClick);
}

function initURL() {
    const url = new URL(window.location);

    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    history.pushState({}, '', url);
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
        console.log(event.target.value);
    });
}

(async() => {
    try {
        initPagination();
        initSearch();
        initURL();

        const queryParams = new URLSearchParams(window.location.search);
        console.log(queryParams.toString());
        const { data, pagination } = await postApi.getAll(queryParams);
        renderPostList(data);
        renderPagination(pagination);
    } catch (error) {
        console.log('getAll failed', error);
    }
})();