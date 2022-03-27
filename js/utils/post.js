import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

dayjs.extend(relativeTime);

export function createPostElement(post) {
    if (!post) return;
    const postTemplate = document.getElementById('postTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 300));
    setTextContent(liElement, '[data-id="author"]', post.author);
    setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updateAt).fromNow()}`);

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) thumbnailElement.src = post.imageUrl;

    //  go to post detail when click on div.post-item
    const divElement = liElement.firstElementChild;
    if (divElement) {
        divElement.addEventListener('click', () => {
            window.location.assign(`/post-detail.html?id=${post.id}`);
        });
    }

    return liElement;
}

export function renderPostList(postList) {
    if (!Array.isArray(postList)) return;

    const ulElement = document.getElementById('postList');
    if (!ulElement) return;

    ulElement.textContent = '';

    postList.forEach((post, idx) => {
        const liElement = createPostElement(post);
        ulElement.appendChild(liElement);
    });
}