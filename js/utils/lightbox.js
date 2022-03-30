function showModal(modalElement) {
    var modal = new window.bootstrap.Modal(modalElement);
    if (modal) modal.show();
}

export function registerLightbox({ modalId, imageSelector, nextSelector, prevSelector }) {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    if (Boolean(modalElement.dataset.registered)) return;

    //selector
    const imageElement = modalElement.querySelector(imageSelector);
    const nextButton = modalElement.querySelector(nextSelector);
    const prevButton = modalElement.querySelector(prevSelector);

    if (!imageElement || !nextButton || !prevButton) return;

    //lightbox var
    let imgList = [];
    let currenIndex = 0;

    function showImageAtIndex(index) {
        imageElement.src = imgList[index].src;
    }

    document.addEventListener('click', (event) => {
        const { target } = event;
        if (target.tagName !== 'IMG' || !target.dataset.album) return;

        imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
        currenIndex = [...imgList].findIndex((x) => x === target);
        console.log({ target, currenIndex });

        showImageAtIndex(currenIndex);
        showModal(modalElement);
    });

    prevButton.addEventListener('click', () => {
        //show prev image currenIndex
        currenIndex = (currenIndex - 1 + imgList.length) % imgList.length;
        showImageAtIndex(currenIndex);
    });
    nextButton.addEventListener('click', () => {
        //show next image currenIndex
        currenIndex = (currenIndex + 1) % imgList.length;
        showImageAtIndex(currenIndex);
    });

    modalElement.dataset.registered = 'true';
}