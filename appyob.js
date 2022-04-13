const title = document.querySelector('input[name=title]'); //инпут заголовка
const content = document.querySelector('input[name=content]'); //инпут поста
const postContainer = document.querySelector('.postContainer'); //общий контейнер куда будем добавлять посты
document.querySelector('.submitButton').addEventListener('click', createPost);
document.querySelector('.loadJSON').addEventListener('click', loadPost);

function createPost() { //более модный способ через вставку HTML
    if (checkInput()) {
        const date = new Date().toLocaleString(); //создаем новое время
        const post = `<section class="post"> <h1 class="postTitle">${title.value.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</h1> <p class="postDate">${date}</p> <p class="postText">${content.value.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p> </section>`;  //создаём наш пост с небольшим санитайзом (замена кавычек html-тэгов на энтети)
        postContainer.insertAdjacentHTML("beforeend", post);
    }
}

function loadPost() {
    fetch(`https://jsonplaceholder.typicode.com/posts/${randomIntFromInterval(1,100)}`)
        .then(response => response.json())
        .then(obj => {
            title.value = obj.title
            content.value = obj.body
        })
        .then(createPost)
}

function checkInput() { //проверка на ошибки с выводом сообщений путём конкатенации строки 
    let err = '';
    if (title.value.trim().length < 1) {
        err += 'Заголовок поста не может быть менее 1 символа.\n';
    }
    if (title.value.trim().length > 96) {
        err += 'Заголовок поста не может быть длиннее 96 символов.\n';
    }
    if (content.value.trim().length < 1) {
        err += 'Текст поста не может быть менее 1 символа.'
    }
    if (content.value.trim().length > 250) {
        err += 'Текст поста не может быть длиннее 250 символов.'
    }
    if (err.length === 0) { //это вообще законно или нет?
        return true
    } else {
        alert(err);
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


