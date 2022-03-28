import dayjs from 'dayjs';
import postApi from './api/postApi';
import { registerLightbox, setTextContent } from './utils';

function renderPostDetail(post) {
    if (!post) return;
    setTextContent(document, '#postDetailTitle', post.title);
    setTextContent(document, '#postDetailDescription', post.description);
    setTextContent(document, '#postDetailAuthor', post.author);
    setTextContent(
        document,
        '#postDetailTimeSpan',
        dayjs(post.updateAt).format(' - DD/MM/YYYY HH:mm')
    );

    const heroImage = document.getElementById('postHeroImage');
    if (heroImage) {
        heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

        heroImage.addEventListener('error', () => {
            heroImage.src = 'https://via.placeholder.com/1138x400?text=thumbnail';
        });
    }

    const editPageLink = document.getElementById('goToEditPageLink');
    if (editPageLink) {
        editPageLink.href = `/add-edit-post.html?id=${post.id}`;
        editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
    }
}

(async() => {
    registerLightbox({
        modalId: 'lightbox',
        imageSelector: 'img[data-id="lightboxImg"]',
        nextSelector: 'button[data-id="lightboxNext"]',
        prevSelector: 'button[data-id="lightboxPrev"]',
    });
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const postId = searchParams.get('id');

        if (!postId) {
            console.log('Not Found');
            return;
        }

        const post = await postApi.getById(postId);
        renderPostDetail(post);
    } catch (error) {
        console.log('failed to fetch post detail', error);
    }
})();