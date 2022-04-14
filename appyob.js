const title = document.querySelector('input[name=title]'); //инпут заголовка
const content = document.querySelector('input[name=content]'); //инпут поста
const postContainer = document.querySelector('.postContainer'); //общий контейнер куда будем добавлять посты
document.querySelector('.submitButton').addEventListener('click', createPost);
document.querySelector('.loadJSON').addEventListener('click', loadPost);
document.addEventListener("DOMContentLoaded", showPosts);

async function getUserAccs() {  //загрузка юзеров
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const userData = await response.json();
    console.log('user array from async', userData);
    return userData;
}

async function getPosts() {  //загрузка постов
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/`);
    const postData = await response.json();
    console.log('post array from async', postData);
    return postData;
}

function showPosts() {                                   //загрузка постов через .then; Ждём посты + аккаунты через promise.all
    Promise.all([getPosts(), getUserAccs()])
    .then(values => {
        const [posts, users] = values;
        posts.forEach(obj => {
            title.value = obj.title;
            content.value = obj.body;
            let feId = obj.userId;
            createPost(users.find(obj => obj.id === feId).username); //отображаем загруженные посты, передавая в функцию юзернейм автора. При этом заголовок и текст поста сохраняются в инпуты напрямую сейчас и забираются оттуда createPost-ом. 
        }                                                            //По хорошему нужно сохранять это в отдельные переменные, нет смысла отображать это в html, но влом переписывать
    )})
    .finally(clear => {
        title.value = '';
        content.value = ''; //очищаем последние заполненные подгрузкой поля за собой, чтобы туда можно было вручную что-то забить
    })
}

function createPost(username = 'Default User') { //более модный способ создания постов через вставку HTML. 
    if (checkInput()) {
        const date = new Date().toLocaleString(); //создаем новое время
        const post = `<section class="post">
        <h1 class="postTitle">${title.value.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</h1>
        <div class="dateIDContainer">
        <p class="postDate">${date}</p>
        <p class="username">by: ${username}</p>
        </div>
        <p class="postText">${content.value.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>
        </section>`;  //создаём наш пост с небольшим санитайзом (замена кавычек html-тэгов на энтети)
        postContainer.insertAdjacentHTML("afterbegin", post);
    }
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

function loadPost() { //загрузка рандомного поста на страницу 
    fetch(`https://jsonplaceholder.typicode.com/posts/${randomIntFromInterval(1,100)}`)
        .then(response => response.json())
        .then(obj => {
            title.value = obj.title
            content.value = obj.body
        })
        .then(createPost)
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
