import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import postApi from './api/postApi';
import { setTextContent, truncateText } from './utils';

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

    postList.forEach((post, idx) => {
        const liElement = createPostElement(post);
        ulElement.appendChild(liElement);
    });
}

(async() => {
    try {
        const queryParams = {
            _page: 1,
            _limit: 20,
        };
        const { data, pagination } = await postApi.getAll(queryParams);
        renderPostList(data);
    } catch (error) {
        console.log('getAll failed', error);
    }
})();